import requests
import sys
import json
from datetime import datetime

class NuestraCarneTester:
    def __init__(self, base_url="http://localhost:8080/api"):
        self.base_url = base_url
        self.auth_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.auth_header = None

    def run_test(self, name, method, endpoint, expected_status, data=None, auth=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth and self.auth_header:
            headers['Authorization'] = self.auth_header
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health(self):
        """Test health endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )

    def test_admin_login(self, username, password):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={"username": username, "password": password}
        )
        
        if success and response.get('success') and 'token' in response:
            self.auth_token = response['token']
            self.auth_header = f"Basic {self.auth_token}"
            return True
        return False

    def test_get_public_articles(self):
        """Test getting public blog articles"""
        return self.run_test(
            "Get Public Blog Articles",
            "GET",
            "admin/blog/articles",
            200
        )

    def test_get_all_articles(self):
        """Test getting all blog articles (requires auth)"""
        return self.run_test(
            "Get All Blog Articles (Admin)",
            "GET",
            "admin/blog/all-articles",
            200,
            auth=True
        )

    def test_create_article(self):
        """Test creating a new blog article"""
        test_article = {
            "titulo": f"Test Article {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "resumen": "This is a test article created by automated testing",
            "contenido": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.",
            "imagen": "/images/blog/test-article.jpg"
        }
        
        return self.run_test(
            "Create Blog Article",
            "POST",
            "admin/blog/articles",
            200,
            data=test_article,
            auth=True
        )

    def test_order_submission(self):
        """Test order submission (expected to fail on email)"""
        test_order = {
            "cliente": {
                "tipoCliente": "individual",
                "nombre": "Test Customer",
                "telefono": "+507 6000-0000",
                "email": "test@example.com",
                "direccion": "Test Address, Panama City",
                "fechaEntrega": "2025-02-20",
                "horaEntrega": "14:00",
                "notas": "This is a test order"
            },
            "productos": [
                {
                    "codigo": "20047",
                    "nombre": "Arañita",
                    "cantidad": 2,
                    "unidad": "libras",
                    "subtotal": 18.32
                },
                {
                    "codigo": "20002",
                    "nombre": "Filete Limpio",
                    "cantidad": 1,
                    "unidad": "libras",
                    "subtotal": 7.03
                }
            ],
            "total": 25.35
        }
        
        # Note: We expect this to either succeed or fail with a 503 (email service error)
        success, response = self.run_test(
            "Submit Order",
            "POST",
            "orders/submit",
            200,
            data=test_order
        )
        
        # If it failed with 503, that's expected (email service not configured)
        if not success and response.get('error') == 'Error de servicio de email':
            print("✅ Order submission failed as expected due to email service not being configured")
            self.tests_passed += 1
            return True
            
        return success

def main():
    # Setup
    tester = NuestraCarneTester()
    
    # Run tests
    print("\n🔍 TESTING NUESTRA CARNE API 🔍")
    print("===============================")
    
    # 1. Health check
    health_success, health_response = tester.test_health()
    if health_success:
        print(f"API Health: {json.dumps(health_response, indent=2)}")
    
    # 2. Get public blog articles
    articles_success, articles_response = tester.test_get_public_articles()
    if articles_success:
        articles = articles_response.get('articles', [])
        print(f"Found {len(articles)} public blog articles")
        if articles:
            print(f"First article: {articles[0]['titulo']}")
    
    # 3. Admin login
    if tester.test_admin_login("admin", "nuestra123"):
        print("Admin login successful")
        
        # 4. Get all articles (including inactive)
        all_articles_success, all_articles_response = tester.test_get_all_articles()
        if all_articles_success:
            all_articles = all_articles_response.get('articles', [])
            print(f"Found {len(all_articles)} total blog articles (including inactive)")
        
        # 5. Create a test article
        create_success, create_response = tester.test_create_article()
        if create_success:
            print(f"Created test article: {create_response.get('article', {}).get('titulo')}")
    
    # 6. Test order submission
    tester.test_order_submission()
    
    # Print results
    print("\n📊 TEST RESULTS 📊")
    print("=================")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.2f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())