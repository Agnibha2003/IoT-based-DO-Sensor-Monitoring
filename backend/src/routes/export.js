import { Router } from 'express';
import { stringify } from 'csv-stringify/sync';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { gzip } from 'zlib';
import { promisify } from 'util';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { readingsInRange } from '../services/readingService.js';
import { getSensorByIdAndUser } from '../services/sensorService.js';
import config from '../config.js';

const router = Router();
const gzipAsync = promisify(gzip);

const metricCatalog = {
  do_concentration: { label: 'DO Concentration (mg/L)', field: 'do_concentration' },
  corrected_do: { label: 'Corrected DO (mg/L)', field: 'corrected_do' },
  temperature: { label: 'Temperature (°C)', field: 'temperature' },
  pressure: { label: 'Pressure (kPa)', field: 'pressure' },
  do_saturation: { label: 'DO Saturation (%)', field: 'do_saturation' },
};

const filterMetrics = (requested) => {
  if (!requested?.length) {
    return ['do_concentration', 'corrected_do', 'temperature', 'pressure', 'do_saturation'];
  }
  return requested.filter((key) => metricCatalog[key]);
};

const parseDateToEpoch = (value, fallbackSeconds) => {
  if (!value) return fallbackSeconds;
  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric > 0) {
    return Math.floor(numeric > 1e12 ? numeric / 1000 : numeric);
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return fallbackSeconds;
  return Math.floor(parsed / 1000);
};

const buildDataset = (rows, metrics) =>
  rows.map((row) => {
    const record = {
      timestamp: row.captured_at,
      iso8601: new Date(row.captured_at * 1000).toISOString(),
    };
    metrics.forEach((metric) => {
      const metricInfo = metricCatalog[metric];
      record[metric] = row[metricInfo.field];
    });
    return record;
  });

const buildAnalytics = (dataset, metrics) => {
  const summary = metrics.map((metric) => {
    const values = dataset
      .map((row) => Number(row[metric]))
      .filter((v) => Number.isFinite(v));
    if (!values.length) return null;
    const total = values.reduce((sum, v) => sum + v, 0);
    return {
      metric,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: Number((total / values.length).toFixed(3)),
      count: values.length,
    };
  }).filter(Boolean);

  return { metrics: summary };
};

const compressIfNeeded = async (buffer, fileName, shouldCompress, mimeType) => {
  if (!shouldCompress) {
    return { payload: buffer, downloadName: fileName, contentType: mimeType };
  }
  const compressed = await gzipAsync(buffer);
  return { payload: compressed, downloadName: `${fileName}.gz`, contentType: 'application/gzip' };
};

const buildXlsxBuffer = async ({ dataset, analytics, metrics, includeRaw }) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DO Sensor Dashboard';
  workbook.created = new Date();

  const dataSheet = workbook.addWorksheet('Data');
  const dataColumns = [
    { header: 'Timestamp (epoch)', key: 'timestamp', width: 18 },
    { header: 'Timestamp (ISO)', key: 'iso8601', width: 26 },
    ...metrics.map((metric) => ({
      header: metricCatalog[metric]?.label || metric,
      key: metric,
      width: 16,
    })),
  ];
  dataSheet.columns = dataColumns;

  if (includeRaw && dataset.length) {
    dataSheet.addRows(dataset);
  } else {
    dataSheet.addRow({ iso8601: 'Raw data excluded from export' });
  }

  if (analytics?.metrics?.length) {
    const analyticsSheet = workbook.addWorksheet('Analytics');
    analyticsSheet.columns = [
      { header: 'Metric', key: 'metric', width: 24 },
      { header: 'Average', key: 'avg', width: 12 },
      { header: 'Minimum', key: 'min', width: 12 },
      { header: 'Maximum', key: 'max', width: 12 },
      { header: 'Samples', key: 'count', width: 12 },
    ];
    analyticsSheet.addRows(analytics.metrics);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

const buildPdfBuffer = async ({ dataset, analytics, metrics, includeRaw, meta }) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('error', reject);
  doc.on('end', () => resolve(Buffer.concat(chunks)));

  doc.fontSize(16).text('DO Sensor Data Export', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Sensor: ${meta.sensorId}`);
  doc.text(`Date range: ${meta.from} → ${meta.to}`);
  doc.text(`Metrics: ${metrics.join(', ')}`);
  doc.text(`Records: ${dataset.length}`);

  if (analytics?.metrics?.length) {
    doc.moveDown();
    doc.fontSize(12).text('Analytics', { underline: true });
    doc.moveDown(0.5);
    analytics.metrics.forEach((item) => {
      doc.fontSize(10).text(`${item.metric}: avg ${item.avg} | min ${item.min} | max ${item.max} | n=${item.count}`);
    });
  }

  if (includeRaw && dataset.length) {
    doc.moveDown();
    doc.fontSize(12).text('Data (first 200 rows)', { underline: true });
    doc.moveDown(0.5);
    const preview = dataset.slice(0, 200);
    doc.fontSize(8);
    const headers = ['timestamp', 'iso8601', ...metrics];
    doc.text(headers.join(' | '));
    doc.moveDown(0.2);
    preview.forEach((row) => {
      const line = headers.map((key) => row[key] ?? '').join(' | ');
      doc.text(line);
    });
    if (dataset.length > 200) {
      doc.moveDown(0.5);
      doc.text(`(+${dataset.length - 200} more rows)`);
    }
  }

  doc.end();
});

router.get('/readings', requireAuth, asyncHandler(async (req, res) => {
  const sensorId = req.query.sensor_id || config.deviceDefaultId;
  const sensor = await getSensorByIdAndUser(sensorId, req.user.id);
  if (!sensor) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const defaultFrom = nowSeconds - (7 * 24 * 60 * 60);
  const fromTime = parseDateToEpoch(req.query.start, defaultFrom);
  const toTime = parseDateToEpoch(req.query.end, nowSeconds);
  const validFrom = Math.min(fromTime, toTime);
  const validTo = Math.max(fromTime, toTime);

  const metrics = filterMetrics(req.query.metrics?.split(','));
  const includeRaw = req.query.includeRaw !== 'false';
  const includeAnalytics = req.query.includeAnalytics === 'true' || req.query.includeAnalytics === '1';
  const compression = req.query.compression === 'true' || req.query.compression === '1';
  const format = (req.query.format || 'csv').toString().toLowerCase();

  const rows = await readingsInRange(sensorId, validFrom, validTo);
  const dataset = buildDataset(rows, metrics);
  const analytics = includeAnalytics ? buildAnalytics(dataset, metrics) : null;

  const dateSuffix = `${new Date(validFrom * 1000).toISOString().slice(0, 10)}_${new Date(validTo * 1000).toISOString().slice(0, 10)}`;
  const baseName = `do-sensor-data_${dateSuffix}.${format}`;
  const meta = {
    sensorId,
    from: new Date(validFrom * 1000).toISOString(),
    to: new Date(validTo * 1000).toISOString(),
  };

  if (format === 'json') {
    const payload = JSON.stringify({ meta, metrics, data: includeRaw ? dataset : [], analytics });
    const { payload: finalPayload, downloadName, contentType } = await compressIfNeeded(Buffer.from(payload), baseName, compression, 'application/json');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    return res.send(finalPayload);
  }

  if (format === 'xlsx' || format === 'excel') {
    const buffer = await buildXlsxBuffer({ dataset, analytics, metrics, includeRaw });
    const { payload: finalPayload, downloadName, contentType } = await compressIfNeeded(buffer, baseName, compression, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName.replace('.excel', '.xlsx')}"`);
    return res.send(finalPayload);
  }

  if (format === 'pdf') {
    const buffer = await buildPdfBuffer({ dataset, analytics, metrics, includeRaw, meta });
    const { payload: finalPayload, downloadName, contentType } = await compressIfNeeded(buffer, baseName, compression, 'application/pdf');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    return res.send(finalPayload);
  }

  // Default CSV
  const csvRows = [];
  if (includeRaw && dataset.length) {
    csvRows.push(...dataset);
  }

  if (analytics?.metrics?.length) {
    csvRows.push({});
    csvRows.push({ metric: 'metric', avg: 'average', min: 'min', max: 'max', count: 'count' });
    analytics.metrics.forEach((item) => csvRows.push(item));
  }

  if (!csvRows.length) {
    csvRows.push({ notice: 'No data available for the selected range' });
  }

  const csv = stringify(csvRows, { header: true });
  const { payload: finalPayload, downloadName, contentType } = await compressIfNeeded(Buffer.from(csv), baseName.replace('.csv', '.csv'), compression, 'text/csv');
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  return res.send(finalPayload);
}));

router.get('/stats', requireAuth, asyncHandler(async (req, res) => {
  const sensorId = req.query.sensor_id || config.deviceDefaultId;
  const sensor = await getSensorByIdAndUser(sensorId, req.user.id);
  if (!sensor) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const fromTime = parseDateToEpoch(req.query.start, nowSeconds - (30 * 24 * 60 * 60));
  const toTime = parseDateToEpoch(req.query.end, nowSeconds);
  const rows = await readingsInRange(sensorId, Math.min(fromTime, toTime), Math.max(fromTime, toTime));

  const metrics = filterMetrics();
  const analytics = buildAnalytics(buildDataset(rows, metrics), metrics);

  return res.json({
    sensor_id: sensorId,
    total_records: rows.length,
    total_size_bytes: rows.length * metrics.length * 16, // approximate size for UI
    oldest_record: rows.length ? new Date(Math.min(...rows.map((r) => Number(r.captured_at))) * 1000).toISOString() : null,
    newest_record: rows.length ? new Date(Math.max(...rows.map((r) => Number(r.captured_at))) * 1000).toISOString() : null,
    average_records_per_day: rows.length && rows[0]?.captured_at
      ? Math.round((rows.length / Math.max(1, (toTime - fromTime) / 86400)))
      : 0,
    retention_days: 30,
    data_points: analytics.metrics.map((item) => ({ parameter: item.metric, count: item.count })),
    last_updated: new Date().toISOString(),
  });
}));

export default router;
