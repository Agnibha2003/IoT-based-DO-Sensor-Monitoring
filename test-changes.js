// Quick test script to verify the backend export stats endpoint
// Uses native fetch API (Node.js 18+)

const API_BASE = 'https://do-sensor-backend.onrender.com/api';

async function testExportStats() {
  console.log('🧪 Testing /api/export/stats endpoint...\n');
  
  // First, try to register/login a test user
  let token;
  try {
    const loginResp = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123'
      })
    });
    
    if (loginResp.ok) {
      const data = await loginResp.json();
      token = data.token;
      console.log('✅ Logged in as test user');
    } else {
      // Try registration if login fails
      const regResp = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpass123',
          name: 'Test User'
        })
      });
      
      if (regResp.ok) {
        const data = await regResp.json();
        token = data.token;
        console.log('✅ Registered new test user');
      } else {
        console.error('❌ Could not authenticate:', await regResp.text());
        return;
      }
    }
  } catch (err) {
    console.error('❌ Auth failed:', err.message);
    return;
  }

  // Test the export stats endpoint
  try {
    const statsResp = await fetch(`${API_BASE}/export/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!statsResp.ok) {
      console.error('❌ Stats endpoint failed:', statsResp.status, await statsResp.text());
      return;
    }

    const stats = await statsResp.json();
    console.log('\n📊 Export Stats Response:');
    console.log(JSON.stringify(stats, null, 2));
    
    // Validate structure
    const requiredFields = ['total_records', 'total_size_bytes', 'oldest_record', 'newest_record', 
                            'average_records_per_day', 'retention_days', 'data_points', 'last_updated'];
    const missingFields = requiredFields.filter(f => !(f in stats));
    
    if (missingFields.length > 0) {
      console.error('\n❌ Missing required fields:', missingFields.join(', '));
    } else {
      console.log('\n✅ All required fields present');
      console.log(`✅ Total records: ${stats.total_records}`);
      console.log(`✅ Total size: ${(stats.total_size_bytes / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`✅ Data points: ${stats.data_points?.length || 0} metrics`);
    }
  } catch (err) {
    console.error('❌ Stats test failed:', err.message);
  }
}

// Test reading history endpoint
async function testReadingHistory() {
  console.log('\n🧪 Testing /api/readings/history endpoint...\n');
  
  let token;
  try {
    const loginResp = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123'
      })
    });
    
    if (loginResp.ok) {
      const data = await loginResp.json();
      token = data.token;
    }
  } catch (err) {
    console.error('❌ Auth failed:', err.message);
    return;
  }

  try {
    const historyResp = await fetch(`${API_BASE}/readings/history?limit=10`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!historyResp.ok) {
      console.error('❌ History endpoint failed:', historyResp.status, await historyResp.text());
      return;
    }

    const history = await historyResp.json();
    console.log('📈 History Response Structure:');
    console.log(`  sensor_id: ${history.sensor_id}`);
    console.log(`  count: ${history.count}`);
    console.log(`  points: ${history.points?.length || 0} readings`);
    
    if (history.points && history.points.length > 0) {
      console.log('\n  Sample reading:');
      const sample = history.points[0];
      console.log(`    captured_at: ${sample.captured_at}`);
      console.log(`    do_concentration: ${sample.do_concentration}`);
      console.log(`    corrected_do: ${sample.corrected_do}`);
      console.log(`    temperature: ${sample.temperature}`);
      console.log('  ✅ History endpoint working');
    } else {
      console.log('  ℹ️  No readings found (expected for new sensor)');
    }
  } catch (err) {
    console.error('❌ History test failed:', err.message);
  }
}

// Run tests
(async () => {
  console.log('🚀 Starting automated tests for backend changes\n');
  await testExportStats();
  await testReadingHistory();
  console.log('\n✅ Tests complete\n');
})();
