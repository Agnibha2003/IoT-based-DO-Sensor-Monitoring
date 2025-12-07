#!/usr/bin/env python3
"""
IoT DO Sensor - Cloud Deployment Verification Script
Verifies that both backend and frontend are properly deployed and connected.
"""

import requests
import sys
import time
from datetime import datetime
from typing import Tuple, Optional

class DeploymentVerifier:
    def __init__(self, backend_url: str, frontend_url: str):
        self.backend_url = backend_url.rstrip('/')
        self.frontend_url = frontend_url.rstrip('/')
        self.api_base = f"{self.backend_url}/api"
        self.results = []
        self.token: Optional[str] = None
        
    def log(self, status: str, message: str, detail: str = ""):
        """Log test result"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        symbol = "✓" if status == "PASS" else "✗" if status == "FAIL" else "⚠"
        print(f"[{timestamp}] {symbol} {message}")
        if detail:
            print(f"         → {detail}")
        self.results.append((status, message, detail))
    
    def test_backend_health(self) -> bool:
        """Test backend health endpoint"""
        try:
            response = requests.get(f"{self.api_base}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log("PASS", "Backend Health Check", f"Status OK, Time: {data.get('time')}")
                return True
            else:
                self.log("FAIL", "Backend Health Check", f"Status: {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            self.log("FAIL", "Backend Health Check", "Cannot connect - service may be spinning up")
            return False
        except Exception as e:
            self.log("FAIL", "Backend Health Check", str(e))
            return False
    
    def test_user_registration(self) -> bool:
        """Test user registration"""
        try:
            email = f"test_{int(time.time())}@example.com"
            password = "TestPassword123!"
            
            response = requests.post(
                f"{self.api_base}/auth/register",
                json={"email": email, "password": password},
                timeout=10
            )
            
            if response.status_code == 201:
                self.log("PASS", "User Registration", f"Account created: {email}")
                return True
            elif response.status_code == 409:
                self.log("WARN", "User Registration", "Email already exists (OK for testing)")
                return True
            else:
                self.log("FAIL", "User Registration", f"Status: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log("FAIL", "User Registration", str(e))
            return False
    
    def test_user_login(self) -> bool:
        """Test user login"""
        try:
            email = "test@example.com"
            password = "Test123!"
            
            response = requests.post(
                f"{self.api_base}/auth/login",
                json={"email": email, "password": password},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("token")
                if self.token:
                    self.log("PASS", "User Login", "JWT token received")
                    return True
                else:
                    self.log("FAIL", "User Login", "No token in response")
                    return False
            else:
                self.log("FAIL", "User Login", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log("FAIL", "User Login", str(e))
            return False
    
    def test_sensor_submission(self) -> bool:
        """Test sensor data submission"""
        if not self.token:
            self.log("SKIP", "Sensor Submission", "No token available (login first)")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            data = {
                "sensor_id": "sensor-001",
                "do_level": 8.5,
                "temperature": 25.3,
                "pressure": 1013.25
            }
            
            response = requests.post(
                f"{self.api_base}/readings",
                json=data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 201:
                self.log("PASS", "Sensor Data Submission", "Reading stored in database")
                return True
            else:
                self.log("FAIL", "Sensor Data Submission", f"Status: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log("FAIL", "Sensor Data Submission", str(e))
            return False
    
    def test_frontend_access(self) -> bool:
        """Test frontend accessibility"""
        try:
            response = requests.get(self.frontend_url, timeout=10)
            if response.status_code == 200:
                self.log("PASS", "Frontend Access", "Dashboard is accessible")
                return True
            else:
                self.log("FAIL", "Frontend Access", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log("FAIL", "Frontend Access", str(e))
            return False
    
    def test_cors_headers(self) -> bool:
        """Test CORS headers"""
        try:
            response = requests.options(
                f"{self.api_base}/readings",
                headers={"Origin": self.frontend_url},
                timeout=10
            )
            
            if "access-control-allow-origin" in response.headers:
                origin = response.headers.get("access-control-allow-origin")
                self.log("PASS", "CORS Configuration", f"Allowed origin: {origin}")
                return True
            else:
                self.log("WARN", "CORS Configuration", "CORS headers not found (may still work)")
                return True
        except Exception as e:
            self.log("FAIL", "CORS Configuration", str(e))
            return False
    
    def test_database_connection(self) -> bool:
        """Test database connectivity via readings endpoint"""
        if not self.token:
            self.log("SKIP", "Database Connection", "No token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(
                f"{self.api_base}/readings",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                self.log("PASS", "Database Connection", f"Retrieved {count} readings")
                return True
            else:
                self.log("FAIL", "Database Connection", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log("FAIL", "Database Connection", str(e))
            return False
    
    def run_all_tests(self):
        """Run all verification tests"""
        print("\n" + "="*60)
        print("🚀 IoT DO Sensor - Deployment Verification")
        print("="*60 + "\n")
        
        print(f"Backend URL: {self.backend_url}")
        print(f"Frontend URL: {self.frontend_url}\n")
        
        print("Running tests...\n")
        
        # Core tests
        self.test_backend_health()
        self.test_frontend_access()
        self.test_cors_headers()
        
        # Authentication tests
        self.test_user_registration()
        self.test_user_login()
        
        # Data tests
        self.test_sensor_submission()
        self.test_database_connection()
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        passed = sum(1 for s, _, _ in self.results if s == "PASS")
        failed = sum(1 for s, _, _ in self.results if s == "FAIL")
        warned = sum(1 for s, _, _ in self.results if s == "WARN")
        skipped = sum(1 for s, _, _ in self.results if s == "SKIP")
        total = len(self.results)
        
        print("\n" + "="*60)
        print("📊 Test Summary")
        print("="*60)
        print(f"✓ Passed:  {passed}/{total}")
        print(f"✗ Failed:  {failed}/{total}")
        print(f"⚠ Warned:  {warned}/{total}")
        print(f"⊘ Skipped: {skipped}/{total}")
        print("="*60 + "\n")
        
        if failed == 0:
            print("🎉 DEPLOYMENT SUCCESSFUL - All critical tests passed!")
            print("\nYour IoT Dashboard is ready to use:")
            print(f"  Dashboard: {self.frontend_url}")
            print(f"  API: {self.api_base}")
        else:
            print("⚠️  Some tests failed. Check the output above for details.")
            print("\nCommon issues:")
            print("  • Backend spinning up (first request slow)")
            print("  • Database not initialized")
            print("  • CORS not configured correctly")
            print("  • Environment variables not set")
        
        print()


def main():
    """Main function"""
    print("\n🔧 IoT DO Sensor - Deployment Verification Tool\n")
    
    # Get URLs from user
    backend_url = input("Enter your backend URL (e.g., https://do-sensor-backend.onrender.com): ").strip()
    frontend_url = input("Enter your frontend URL (e.g., https://do-sensor-dashboard.vercel.app): ").strip()
    
    if not backend_url or not frontend_url:
        print("\n✗ URLs are required!")
        sys.exit(1)
    
    # Run verification
    verifier = DeploymentVerifier(backend_url, frontend_url)
    verifier.run_all_tests()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nVerification cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Verification failed: {e}")
        sys.exit(1)
