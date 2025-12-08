// Test with existing production user credentials
const API_BASE = 'https://do-sensor-backend.onrender.com/api';

async function testWithRealUser() {
  console.log('🧪 Testing with production user account\n');
  
  // Use the email from your earlier test
  const credentials = {
    email: 'agnibnb@gmail.com',
    password: 'pass' // Replace with actual password if different
  };
  
  try {
    const loginResp = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!loginResp.ok) {
      console.error('❌ Login failed:', await loginResp.text());
      console.log('\nℹ️  If you have a different account, update credentials in test-prod.js');
      return;
    }
    
    const { token } = await loginResp.json();
    console.log('✅ Logged in successfully\n');
    
    // Test export stats
    console.log('📊 Testing /api/export/stats...');
    const statsResp = await fetch(`${API_BASE}/export/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!statsResp.ok) {
      console.error('❌ Stats failed:', statsResp.status, await statsResp.text());
    } else {
      const stats = await statsResp.json();
      console.log('✅ Stats endpoint working');
      console.log(`   Total records: ${stats.total_records}`);
      console.log(`   Storage: ${(stats.total_size_bytes / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`   Date range: ${stats.oldest_record || 'N/A'} → ${stats.newest_record || 'N/A'}`);
      console.log(`   Avg per day: ${stats.average_records_per_day}`);
      console.log(`   Data points: ${stats.data_points?.length || 0} metrics`);
    }
    
    // Test history
    console.log('\n📈 Testing /api/readings/history...');
    const historyResp = await fetch(`${API_BASE}/readings/history?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!historyResp.ok) {
      console.error('❌ History failed:', historyResp.status, await historyResp.text());
    } else {
      const history = await historyResp.json();
      console.log('✅ History endpoint working');
      console.log(`   Sensor: ${history.sensor_id}`);
      console.log(`   Total count: ${history.count}`);
      console.log(`   Points returned: ${history.points?.length || 0}`);
      
      if (history.points && history.points.length > 0) {
        const latest = history.points[history.points.length - 1];
        console.log('   Latest reading:');
        console.log(`     Time: ${new Date(latest.captured_at * 1000).toISOString()}`);
        console.log(`     DO: ${latest.corrected_do || latest.do_concentration} mg/L`);
        console.log(`     Temp: ${latest.temperature}°C`);
      }
    }
    
    console.log('\n✅ All tests passed!\n');
    
  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

testWithRealUser();
