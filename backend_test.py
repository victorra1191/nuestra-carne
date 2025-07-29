import requests
import sys
import json
from datetime import datetime
import os

class NuestraCarneTester:
    def __init__(self):
        # Get the backend URL from environment variable or use a default
        with open('/app/frontend/.env', 'r') as f:
            env_content = f.read()
            for line in env_content.split('\n'):
                if line.startswith('REACT_APP_BACKEND_URL='):
                    self.base_url = line.split('=')[1].strip() + '/api'
                    break
            else:
                self.base_url = "https://8ee28f53-7feb-400d-88df-0bec5e6e0400.preview.emergentagent.com/api"
        
        print(f"Using backend URL: {self.base_url}")
        
        self.auth_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.auth_header = None
        self.user_id = None
        self.test_user = {
            "nombre": "Test User",
            "email": f"test.user.{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com",
            "telefono": "+507 6123-4567",
            "password": "TestPassword123!"
        }
        self.wholesale_user = {
            "nombre": "Test Wholesale",
            "email": f"test.wholesale.{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com",
            "telefono": "+507 6987-6543",
            "password": "WholesaleTest123!",
            "tipo": "mayorista"
        }

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
            "orders/health",
            200
        )

    # 1. Product APIs Tests
    def test_retail_products(self):
        """Test retail products endpoint with new price structure"""
        success, response = self.run_test(
            "Get Retail Products (New Structure)",
            "GET",
            "products/retail",
            200
        )
        
        if success:
            products = response.get('products', [])
            print(f"Found {len(products)} retail products")
            
            # Check if the response has the expected structure
            if 'success' not in response or not response['success']:
                print("❌ Response missing 'success: true' field")
                return False, response
                
            if 'products' not in response or not isinstance(response['products'], list):
                print("❌ Response missing 'products' array")
                return False, response
            
            # Verify exactly 59 products are returned (products with precioMedioKilo > 0)
            if len(products) != 59:
                print(f"❌ Expected exactly 59 products, but got {len(products)}")
                return False, response
            else:
                print("✅ Correct number of products returned (59)")
            
            # Check for specific product - Costillón entero (codigo: 10014)
            costillon = next((p for p in products if p.get('codigo') == '10014'), None)
            if costillon:
                print(f"Found Costillón entero: {costillon['nombre']} - ${costillon['precioMedioKilo']} per medio kilo")
                
                # Verify the price is 3.68
                if costillon['precioMedioKilo'] == 3.68:
                    print("✅ Costillón entero has the correct price of $3.68 per medio kilo")
                else:
                    print(f"❌ Costillón entero has incorrect price: ${costillon['precioMedioKilo']} (expected $3.68)")
                    return False, response
            else:
                print("❌ Costillón entero (codigo: 10014) not found in products list")
                return False, response
            
            # Check for specific product - New york rebanado (codigo: 10001)
            newyork = next((p for p in products if p.get('codigo') == '10001'), None)
            if newyork:
                print(f"Found New york rebanado: {newyork['nombre']} - ${newyork['precioMedioKilo']} per medio kilo")
                
                # Verify the price is 4.63
                if newyork['precioMedioKilo'] == 4.63:
                    print("✅ New york rebanado has the correct price of $4.63 per medio kilo")
                else:
                    print(f"❌ New york rebanado has incorrect price: ${newyork['precioMedioKilo']} (expected $4.63)")
                    return False, response
            else:
                print("❌ New york rebanado (codigo: 10001) not found in products list")
                return False, response
            
            # Verify all products have the new structure with precioMedioKilo field
            for product in products:
                if 'precioMedioKilo' not in product:
                    print(f"❌ Product {product.get('codigo', 'unknown')} missing precioMedioKilo field")
                    return False, response
                if product['precioMedioKilo'] <= 0:
                    print(f"❌ Product {product.get('codigo', 'unknown')} has invalid precioMedioKilo: {product['precioMedioKilo']}")
                    return False, response
            
            print("✅ All products have valid precioMedioKilo field")
            
            # Verify product codes are in the new range (10001-10065)
            for product in products:
                codigo = product.get('codigo', '')
                if not codigo.startswith('100'):
                    print(f"❌ Product has old code format: {codigo}")
                    return False, response
            
            print("✅ All products use new code format (10001-10065)")
                
            if products:
                print(f"First product: {products[0]['nombre']} - ${products[0]['precioMedioKilo']} per medio kilo")
        
        return success, response

    def test_admin_products(self):
        """Test admin products endpoint with basic auth"""
        # Set up basic auth header
        import base64
        credentials = base64.b64encode(b'admin:nuestra123').decode('utf-8')
        headers = {'Authorization': f'Basic {credentials}'}
        
        url = f"{self.base_url}/admin/products/all"
        
        self.tests_run += 1
        print(f"\n🔍 Testing Admin Products Endpoint...")
        
        try:
            response = requests.get(url, headers=headers)
            success = response.status_code == 200
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                data = response.json()
                products = data.get('products', [])
                print(f"Found {len(products)} total products in admin view")
                
                # Verify structure is the same as retail but includes all products
                if len(products) != 64:
                    print(f"❌ Expected 64 total products, got {len(products)}")
                    return False, data
                
                # Check that it includes products with precioMedioKilo = 0 (unavailable ones)
                unavailable_products = [p for p in products if p.get('precioMedioKilo', 0) == 0]
                print(f"Found {len(unavailable_products)} unavailable products")
                
                # Verify specific products exist
                costillon = next((p for p in products if p.get('codigo') == '10014'), None)
                newyork = next((p for p in products if p.get('codigo') == '10001'), None)
                
                if costillon and newyork:
                    print("✅ Admin endpoint returns all products with correct structure")
                    return True, data
                else:
                    print("❌ Missing expected products in admin view")
                    return False, data
                    
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_admin_update_product(self):
        """Test updating a product price via admin endpoint"""
        # Set up basic auth header
        import base64
        credentials = base64.b64encode(b'admin:nuestra123').decode('utf-8')
        headers = {
            'Authorization': f'Basic {credentials}',
            'Content-Type': 'application/json'
        }
        
        # First, get the current price of product 10014
        get_url = f"{self.base_url}/admin/products/all"
        try:
            get_response = requests.get(get_url, headers=headers)
            if get_response.status_code == 200:
                products = get_response.json().get('products', [])
                costillon = next((p for p in products if p.get('codigo') == '10014'), None)
                if costillon:
                    original_price = costillon.get('precioMedioKilo', 0)
                    print(f"Original price for Costillón entero: ${original_price}")
                else:
                    print("❌ Could not find product 10014 for update test")
                    return False, {}
            else:
                print("❌ Could not retrieve products for update test")
                return False, {}
        except Exception as e:
            print(f"❌ Error retrieving product for update: {str(e)}")
            return False, {}
        
        # Update the product price
        update_url = f"{self.base_url}/admin/products/10014"
        new_price = 4.00  # Test price
        update_data = {
            "precioMedioKilo": new_price,
            "precioKg": new_price * 2  # Since precioKg should be double precioMedioKilo
        }
        
        self.tests_run += 1
        print(f"\n🔍 Testing Admin Product Update...")
        
        try:
            response = requests.put(update_url, json=update_data, headers=headers)
            success = response.status_code == 200
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                data = response.json()
                if data.get('success'):
                    updated_product = data.get('product', {})
                    updated_price = updated_product.get('precioMedioKilo', 0)
                    
                    if updated_price == new_price:
                        print(f"✅ Product price updated successfully to ${updated_price}")
                        
                        # Restore original price
                        restore_data = {"precioMedioKilo": original_price}
                        restore_response = requests.put(update_url, json=restore_data, headers=headers)
                        if restore_response.status_code == 200:
                            print(f"✅ Original price restored to ${original_price}")
                        
                        return True, data
                    else:
                        print(f"❌ Price not updated correctly. Expected ${new_price}, got ${updated_price}")
                        return False, data
                else:
                    print("❌ Update response indicates failure")
                    return False, data
                    
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    # 2. Authentication APIs Tests
    def test_user_registration(self):
        """Test user registration"""
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=self.test_user
        )
        
        if success and response.get('success'):
            print(f"User registered: {response.get('user', {}).get('nombre')}")
            self.user_id = response.get('user', {}).get('id')
        
        return success, response

    def test_wholesale_registration(self):
        """Test wholesale user registration"""
        success, response = self.run_test(
            "Wholesale User Registration",
            "POST",
            "auth/register",
            200,
            data=self.wholesale_user
        )
        
        if success and response.get('success'):
            print(f"Wholesale user registered: {response.get('user', {}).get('nombre')}")
            print(f"Status: {response.get('user', {}).get('estado')}")
        
        return success, response

    def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": self.test_user["email"],
            "password": self.test_user["password"]
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and response.get('success') and 'token' in response:
            self.auth_token = response['token']
            self.auth_header = f"Bearer {self.auth_token}"
            self.user_id = response.get('user', {}).get('id')
            print(f"Login successful, token: {self.auth_token}")
            return True, response
        
        return success, response

    def test_user_profile(self):
        """Test getting user profile"""
        if not self.user_id:
            print("❌ Cannot test profile - no user ID available")
            return False, {}
        
        return self.run_test(
            "Get User Profile",
            "GET",
            f"auth/profile/{self.user_id}",
            200,
            auth=True
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
        """Test order submission with new product codes and structure"""
        test_order = {
            "cliente": {
                "tipoCliente": "individual",
                "nombre": "Test Customer Order",
                "telefono": "+507 6000-1111",
                "email": "testcustomer@example.com",
                "direccion": "Test Address, Panama City",
                "fechaEntrega": "2025-02-21",
                "horaEntrega": "14:00",
                "notas": "Test order for debugging"
            },
            "productos": [
                {
                    "codigo": "10028",
                    "nombre": "Trip tip (punta Rincón)",
                    "cantidad": 1,
                    "unidad": "kilos",
                    "subtotal": 9.60,
                    "precioKg": 9.60,
                    "precioMedioKilo": 4.80
                }
            ],
            "total": 9.60
        }
        
        print(f"\n🔍 Testing Order Submission with data:")
        print(f"   Cliente: {test_order['cliente']['nombre']}")
        print(f"   Email: {test_order['cliente']['email']}")
        print(f"   Productos: {len(test_order['productos'])} items")
        print(f"   Total: ${test_order['total']}")
        
        # Test the order submission endpoint
        success, response = self.run_test(
            "Submit Order (POST /api/orders/submit)",
            "POST",
            "orders/submit",
            200,
            data=test_order
        )
        
        if success:
            print("✅ Order submission successful!")
            print(f"   Order ID: {response.get('orderId', 'N/A')}")
            print(f"   Emails sent: {response.get('emailsSent', False)}")
            
            # Verify the order was saved by checking if we can retrieve it
            if 'orderId' in response:
                order_id = response['orderId']
                print(f"\n🔍 Verifying order {order_id} was saved...")
                
                # Try to get the specific order
                get_success, get_response = self.run_test(
                    f"Get Order {order_id}",
                    "GET",
                    f"orders/{order_id}",
                    200
                )
                
                if get_success and get_response.get('success'):
                    saved_order = get_response.get('order', {})
                    print("✅ Order successfully saved and retrieved!")
                    print(f"   Saved cliente: {saved_order.get('cliente', {}).get('nombre', 'N/A')}")
                    print(f"   Saved total: ${saved_order.get('total', 0)}")
                    print(f"   Order status: {saved_order.get('estado', 'N/A')}")
                    return True
                else:
                    print("❌ Order was submitted but could not be retrieved from storage")
                    return False
            
            return True
        else:
            print("❌ Order submission failed")
            if response:
                print(f"   Error: {response.get('error', 'Unknown error')}")
                print(f"   Message: {response.get('message', 'No message')}")
            return False

    def test_orders_file_persistence(self):
        """Test that orders are being saved to orders.json file"""
        import json
        import os
        
        orders_file = '/app/backend/src/data/orders.json'
        
        print(f"\n🔍 Testing orders file persistence...")
        print(f"   Orders file path: {orders_file}")
        
        # Check if orders file exists
        if not os.path.exists(orders_file):
            print("❌ Orders file does not exist")
            return False
        
        try:
            # Read the orders file
            with open(orders_file, 'r') as f:
                orders_data = json.load(f)
            
            print(f"✅ Orders file exists and is readable")
            print(f"   Total orders in file: {len(orders_data)}")
            
            # Check if there are any orders
            if len(orders_data) > 0:
                latest_order = orders_data[-1]  # Get the most recent order
                print(f"   Latest order ID: {latest_order.get('id', 'N/A')}")
                print(f"   Latest order cliente: {latest_order.get('cliente', {}).get('nombre', 'N/A')}")
                print(f"   Latest order total: ${latest_order.get('total', 0)}")
                print(f"   Latest order date: {latest_order.get('fecha', 'N/A')}")
            
            return True
            
        except json.JSONDecodeError as e:
            print(f"❌ Orders file exists but contains invalid JSON: {e}")
            return False
        except Exception as e:
            print(f"❌ Error reading orders file: {e}")
            return False

    def test_admin_orders_stats(self):
        """Test admin orders statistics endpoint"""
        # Set up basic auth header
        import base64
        credentials = base64.b64encode(b'admin:nuestra123').decode('utf-8')
        headers = {'Authorization': f'Basic {credentials}'}
        
        url = f"{self.base_url}/admin/orders/stats"
        
        self.tests_run += 1
        print(f"\n🔍 Testing Admin Orders Statistics...")
        
        try:
            response = requests.get(url, headers=headers)
            success = response.status_code == 200
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                data = response.json()
                if not data.get('success'):
                    print("❌ Response indicates failure")
                    return False, data
                
                stats = data.get('stats', {})
                
                # Verify required statistics fields
                required_fields = [
                    'totalOrders', 'completedOrders', 'activeOrders', 'todayOrders',
                    'totalRevenue', 'topProducts', 'recentOrders', 'ordersByStatus', 'salesByPeriod'
                ]
                
                for field in required_fields:
                    if field not in stats:
                        print(f"❌ Missing required field: {field}")
                        return False, data
                
                print(f"📊 Statistics Summary:")
                print(f"   Total Orders: {stats['totalOrders']}")
                print(f"   Completed Orders: {stats['completedOrders']}")
                print(f"   Active Orders: {stats['activeOrders']}")
                print(f"   Today Orders: {stats['todayOrders']}")
                print(f"   Total Revenue: ${stats['totalRevenue']:.2f}")
                
                # Verify topProducts structure
                top_products = stats.get('topProducts', [])
                print(f"   Top Products: {len(top_products)} items")
                if top_products:
                    for i, product in enumerate(top_products[:3]):
                        print(f"     {i+1}. {product.get('nombre', 'N/A')} - Qty: {product.get('cantidad', 0)}, Revenue: ${product.get('ingresos', 0):.2f}")
                
                # Verify recentOrders structure
                recent_orders = stats.get('recentOrders', [])
                print(f"   Recent Orders: {len(recent_orders)} items")
                if recent_orders:
                    for order in recent_orders[:2]:
                        print(f"     Order {order.get('id', 'N/A')[:8]}... - {order.get('cliente', 'N/A')} - ${order.get('total', 0):.2f}")
                
                # Verify ordersByStatus structure
                orders_by_status = stats.get('ordersByStatus', {})
                print(f"   Orders by Status:")
                for status, count in orders_by_status.items():
                    print(f"     {status}: {count}")
                
                # Verify salesByPeriod structure
                sales_by_period = stats.get('salesByPeriod', {})
                print(f"   Sales by Period:")
                for period, amount in sales_by_period.items():
                    print(f"     {period}: ${amount:.2f}")
                
                # Verify we have the expected 2 test orders
                if stats['totalOrders'] >= 2:
                    print("✅ Expected test orders found in statistics")
                else:
                    print(f"⚠️  Expected at least 2 orders, found {stats['totalOrders']}")
                
                return True, data
                    
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_orders_all(self):
        """Test get all orders endpoint"""
        success, response = self.run_test(
            "Get All Orders",
            "GET",
            "orders/all",
            200
        )
        
        if success:
            orders = response.get('orders', [])
            total = response.get('total', 0)
            stats = response.get('stats', {})
            
            print(f"📋 Orders Summary:")
            print(f"   Total Orders: {total}")
            print(f"   Orders in response: {len(orders)}")
            
            if stats:
                print(f"   Status breakdown:")
                for status, count in stats.items():
                    print(f"     {status}: {count}")
            
            # Verify structure of orders
            if orders:
                first_order = orders[0]
                required_order_fields = ['id', 'cliente', 'productos', 'total', 'estado', 'fecha']
                
                for field in required_order_fields:
                    if field not in first_order:
                        print(f"❌ Missing required order field: {field}")
                        return False, response
                
                print(f"   Sample order: {first_order['id'][:8]}... - {first_order['cliente']['nombre']} - ${first_order['total']}")
                
            # Verify we have the expected 2 test orders
            if total >= 2:
                print("✅ Expected test orders found")
            else:
                print(f"⚠️  Expected at least 2 orders, found {total}")
        
        return success, response

    def test_admin_orders_stats_enhanced(self):
        """Test admin orders statistics endpoint with enhanced validation for 3 orders"""
        # Set up basic auth header
        import base64
        credentials = base64.b64encode(b'admin:nuestra123').decode('utf-8')
        headers = {'Authorization': f'Basic {credentials}'}
        
        url = f"{self.base_url}/admin/orders/stats"
        
        self.tests_run += 1
        print(f"\n🔍 Testing Enhanced Admin Orders Statistics...")
        
        try:
            response = requests.get(url, headers=headers)
            success = response.status_code == 200
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                data = response.json()
                if not data.get('success'):
                    print("❌ Response indicates failure")
                    return False, data
                
                stats = data.get('stats', {})
                
                # Verify required statistics fields
                required_fields = [
                    'totalOrders', 'completedOrders', 'activeOrders', 'todayOrders',
                    'totalRevenue', 'topProducts', 'recentOrders', 'ordersByStatus', 'salesByPeriod'
                ]
                
                for field in required_fields:
                    if field not in stats:
                        print(f"❌ Missing required field: {field}")
                        return False, data
                
                print(f"📊 Enhanced Statistics Summary:")
                print(f"   Total Orders: {stats['totalOrders']}")
                print(f"   Completed Orders: {stats['completedOrders']}")
                print(f"   Active Orders: {stats['activeOrders']}")
                print(f"   Today Orders: {stats['todayOrders']}")
                print(f"   Total Revenue: ${stats['totalRevenue']:.2f}")
                
                # SPECIFIC VALIDATION FOR REVIEW REQUEST
                # 1. Verify 3 orders total
                if stats['totalOrders'] != 3:
                    print(f"❌ Expected 3 total orders, got {stats['totalOrders']}")
                    return False, data
                else:
                    print("✅ Correct total orders count: 3")
                
                # 2. Verify total revenue is $72.70 (25.35 + 9.60 + 37.75)
                expected_revenue = 72.70
                if abs(stats['totalRevenue'] - expected_revenue) > 0.01:
                    print(f"❌ Expected total revenue ${expected_revenue}, got ${stats['totalRevenue']:.2f}")
                    return False, data
                else:
                    print(f"✅ Correct total revenue: ${stats['totalRevenue']:.2f}")
                
                # 3. Verify active orders count (3: 2 pendiente + 1 en_proceso)
                if stats['activeOrders'] != 3:
                    print(f"❌ Expected 3 active orders, got {stats['activeOrders']}")
                    return False, data
                else:
                    print("✅ Correct active orders count: 3")
                
                # 4. Verify topProducts includes expected products
                top_products = stats.get('topProducts', [])
                print(f"   Top Products: {len(top_products)} items")
                
                expected_products = ['Ribeye', 'Trip tip', 'Arañita', 'Filete Limpio']
                found_products = [p.get('nombre', '') for p in top_products]
                
                for expected_product in expected_products:
                    if not any(expected_product in found_name for found_name in found_products):
                        print(f"❌ Expected product '{expected_product}' not found in top products")
                        return False, data
                
                print("✅ All expected products found in top products")
                
                for i, product in enumerate(top_products[:4]):
                    print(f"     {i+1}. {product.get('nombre', 'N/A')} - Qty: {product.get('cantidad', 0)}, Revenue: ${product.get('ingresos', 0):.2f}")
                
                # 5. Verify ordersByStatus includes en_proceso status
                orders_by_status = stats.get('ordersByStatus', {})
                print(f"   Orders by Status:")
                for status, count in orders_by_status.items():
                    print(f"     {status}: {count}")
                
                if orders_by_status.get('en_proceso', 0) != 1:
                    print(f"❌ Expected 1 order with 'en_proceso' status, got {orders_by_status.get('en_proceso', 0)}")
                    return False, data
                else:
                    print("✅ Correct 'en_proceso' status count: 1")
                
                if orders_by_status.get('pendiente', 0) != 2:
                    print(f"❌ Expected 2 orders with 'pendiente' status, got {orders_by_status.get('pendiente', 0)}")
                    return False, data
                else:
                    print("✅ Correct 'pendiente' status count: 2")
                
                # 6. Verify recentOrders structure and victor rodriguez order
                recent_orders = stats.get('recentOrders', [])
                print(f"   Recent Orders: {len(recent_orders)} items")
                
                victor_order_found = False
                for order in recent_orders:
                    print(f"     Order {order.get('id', 'N/A')[:8]}... - {order.get('cliente', 'N/A')} - ${order.get('total', 0):.2f}")
                    if 'victor rodriguez' in order.get('cliente', '').lower():
                        victor_order_found = True
                        if order.get('total') != 37.75:
                            print(f"❌ Victor Rodriguez order has incorrect total: ${order.get('total')} (expected $37.75)")
                            return False, data
                
                if not victor_order_found:
                    print("❌ Victor Rodriguez order not found in recent orders")
                    return False, data
                else:
                    print("✅ Victor Rodriguez order found with correct total")
                
                # 7. Verify salesByPeriod structure
                sales_by_period = stats.get('salesByPeriod', {})
                print(f"   Sales by Period:")
                for period, amount in sales_by_period.items():
                    print(f"     {period}: ${amount:.2f}")
                
                print("✅ All enhanced validation checks passed!")
                return True, data
                    
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_orders_all_enhanced(self):
        """Test get all orders endpoint with enhanced validation for 3 orders"""
        success, response = self.run_test(
            "Get All Orders (Enhanced)",
            "GET",
            "orders/all",
            200
        )
        
        if success:
            orders = response.get('orders', [])
            total = response.get('total', 0)
            stats = response.get('stats', {})
            
            print(f"📋 Enhanced Orders Summary:")
            print(f"   Total Orders: {total}")
            print(f"   Orders in response: {len(orders)}")
            
            # SPECIFIC VALIDATION FOR REVIEW REQUEST
            # 1. Verify 3 orders total
            if total != 3:
                print(f"❌ Expected 3 total orders, got {total}")
                return False, response
            else:
                print("✅ Correct total orders count: 3")
            
            if len(orders) != 3:
                print(f"❌ Expected 3 orders in response, got {len(orders)}")
                return False, response
            else:
                print("✅ Correct orders count in response: 3")
            
            # 2. Verify victor rodriguez order exists and has proper usuarioId
            victor_order_found = False
            for order in orders:
                if 'victor rodriguez' in order.get('cliente', {}).get('nombre', '').lower():
                    victor_order_found = True
                    print(f"✅ Victor Rodriguez order found:")
                    print(f"     Order ID: {order.get('id', 'N/A')}")
                    print(f"     Usuario ID: {order.get('usuarioId', 'N/A')}")
                    print(f"     Total: ${order.get('total', 0)}")
                    print(f"     Estado: {order.get('estado', 'N/A')}")
                    
                    # Verify usuarioId is present
                    if not order.get('usuarioId'):
                        print("❌ Victor Rodriguez order missing usuarioId")
                        return False, response
                    else:
                        print(f"✅ Victor Rodriguez order has proper usuarioId: {order.get('usuarioId')}")
                    
                    # Verify total is correct
                    if order.get('total') != 37.75:
                        print(f"❌ Victor Rodriguez order has incorrect total: ${order.get('total')} (expected $37.75)")
                        return False, response
                    else:
                        print("✅ Victor Rodriguez order has correct total: $37.75")
                    
                    # Verify products are complete
                    productos = order.get('productos', [])
                    if len(productos) != 2:
                        print(f"❌ Victor Rodriguez order should have 2 products, got {len(productos)}")
                        return False, response
                    
                    expected_products = ['Ribeye', 'Filete Limpio']
                    found_products = [p.get('nombre', '') for p in productos]
                    
                    for expected_product in expected_products:
                        if not any(expected_product in found_name for found_name in found_products):
                            print(f"❌ Expected product '{expected_product}' not found in Victor's order")
                            return False, response
                    
                    print("✅ Victor Rodriguez order has complete product details")
                    break
            
            if not victor_order_found:
                print("❌ Victor Rodriguez order not found")
                return False, response
            
            # 3. Verify status breakdown
            if stats:
                print(f"   Status breakdown:")
                for status, count in stats.items():
                    print(f"     {status}: {count}")
                
                if stats.get('en_proceso', 0) != 1:
                    print(f"❌ Expected 1 'en_proceso' order, got {stats.get('en_proceso', 0)}")
                    return False, response
                else:
                    print("✅ Correct 'en_proceso' status count: 1")
                
                if stats.get('pendientes', 0) != 2:
                    print(f"❌ Expected 2 'pendientes' orders, got {stats.get('pendientes', 0)}")
                    return False, response
                else:
                    print("✅ Correct 'pendientes' status count: 2")
            
            # 4. Verify structure of orders
            if orders:
                first_order = orders[0]
                required_order_fields = ['id', 'cliente', 'productos', 'total', 'estado', 'fecha']
                
                for field in required_order_fields:
                    if field not in first_order:
                        print(f"❌ Missing required order field: {field}")
                        return False, response
                
                print(f"   Sample order: {first_order['id'][:8]}... - {first_order['cliente']['nombre']} - ${first_order['total']}")
            
            print("✅ All enhanced validation checks passed!")
        
        return success, response

    def test_user_specific_orders(self):
        """Test user-specific order retrieval for victor rodriguez"""
        user_id = "e95820ef-429a-4419-a75b-d37043adc651"
        
        success, response = self.run_test(
            f"Get User Orders for Victor Rodriguez",
            "GET",
            f"orders/user/{user_id}",
            200
        )
        
        if success:
            orders = response.get('orders', [])
            
            print(f"👤 User-Specific Orders Summary:")
            print(f"   User ID: {user_id}")
            print(f"   Orders found: {len(orders)}")
            
            # SPECIFIC VALIDATION FOR REVIEW REQUEST
            # 1. Should return 1 order for victor rodriguez
            if len(orders) != 1:
                print(f"❌ Expected 1 order for Victor Rodriguez, got {len(orders)}")
                return False, response
            else:
                print("✅ Correct order count for Victor Rodriguez: 1")
            
            # 2. Verify the order details
            order = orders[0]
            
            # Verify customer name
            if 'victor rodriguez' not in order.get('cliente', {}).get('nombre', '').lower():
                print(f"❌ Order customer name doesn't match: {order.get('cliente', {}).get('nombre', '')}")
                return False, response
            else:
                print(f"✅ Correct customer name: {order.get('cliente', {}).get('nombre', '')}")
            
            # Verify products (should have Ribeye and Filete Limpio)
            productos = order.get('productos', [])
            if len(productos) != 2:
                print(f"❌ Expected 2 products, got {len(productos)}")
                return False, response
            
            expected_products = ['Ribeye', 'Filete Limpio']
            found_products = [p.get('nombre', '') for p in productos]
            
            print(f"   Products in order:")
            for i, product in enumerate(productos):
                print(f"     {i+1}. {product.get('nombre', 'N/A')} - Qty: {product.get('cantidad', 0)} {product.get('unidad', '')} - ${product.get('subtotal', 0)}")
            
            for expected_product in expected_products:
                if not any(expected_product in found_name for found_name in found_products):
                    print(f"❌ Expected product '{expected_product}' not found")
                    return False, response
            
            print("✅ All expected products found with complete details")
            
            # Verify total
            if order.get('total') != 37.75:
                print(f"❌ Expected total $37.75, got ${order.get('total')}")
                return False, response
            else:
                print(f"✅ Correct total: ${order.get('total')}")
            
            # Verify usuarioId matches
            if order.get('usuarioId') != user_id:
                print(f"❌ Expected usuarioId {user_id}, got {order.get('usuarioId')}")
                return False, response
            else:
                print(f"✅ Correct usuarioId: {order.get('usuarioId')}")
            
            print("✅ All user-specific validation checks passed!")
        
        return success, response

def main():
    # Setup
    tester = NuestraCarneTester()
    
    # Run tests for the updated admin dashboard statistics API
    print("\n🔍 TESTING UPDATED ADMIN DASHBOARD STATISTICS API 🔍")
    print("====================================================")
    print("Verifying new data structure and enhanced metrics with 3 orders")
    print("Expected: Total orders: 3, Total revenue: $72.70, Active orders: 3")
    print("Expected products: Ribeye, Trip tip, Arañita, Filete Limpio")
    
    # 1. Health check first
    print("\n🔍 TESTING API HEALTH 🔍")
    print("========================")
    health_success, health_response = tester.test_health()
    if health_success:
        print(f"✅ API Health Check Passed")
        print(f"   Service: {health_response.get('service', 'N/A')}")
        print(f"   Status: {health_response.get('status', 'N/A')}")
        print(f"   Environment: {health_response.get('environment', 'N/A')}")
        print(f"   Email configured: {health_response.get('email_from', 'N/A')}")
    else:
        print("❌ API Health Check Failed - Cannot proceed with testing")
        return 1
    
    # 2. Test GET /api/admin/orders/stats with enhanced validation
    print("\n🔍 TESTING GET /api/admin/orders/stats (ENHANCED) 🔍")
    print("===================================================")
    stats_success, stats_response = tester.test_admin_orders_stats_enhanced()
    
    # 3. Test GET /api/orders/all with enhanced validation
    print("\n🔍 TESTING GET /api/orders/all (ENHANCED) 🔍")
    print("===========================================")
    all_orders_success, all_orders_response = tester.test_orders_all_enhanced()
    
    # 4. Test GET /api/orders/user/:userId for victor rodriguez
    print("\n🔍 TESTING GET /api/orders/user/e95820ef-429a-4419-a75b-d37043adc651 🔍")
    print("====================================================================")
    user_orders_success, user_orders_response = tester.test_user_specific_orders()
    
    # Print results
    print("\n📊 TEST RESULTS 📊")
    print("=================")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.2f}%")
    
    # Detailed results
    print("\n📋 DETAILED RESULTS:")
    print(f"   ✅ API Health Check: {'PASSED' if health_success else 'FAILED'}")
    print(f"   ✅ Admin Orders Statistics (Enhanced): {'PASSED' if stats_success else 'FAILED'}")
    print(f"   ✅ Get All Orders (Enhanced): {'PASSED' if all_orders_success else 'FAILED'}")
    print(f"   ✅ User-Specific Orders (Victor Rodriguez): {'PASSED' if user_orders_success else 'FAILED'}")
    
    # Critical issue detection
    if not stats_success:
        print("\n🚨 CRITICAL ISSUE DETECTED:")
        print("   Admin orders statistics endpoint validation failed")
        print("   The new data structure or enhanced metrics are not working correctly")
        
    if not all_orders_success:
        print("\n🚨 CRITICAL ISSUE DETECTED:")
        print("   Get all orders endpoint validation failed")
        print("   The 3 orders including victor rodriguez order are not properly structured")
    
    if not user_orders_success:
        print("\n🚨 CRITICAL ISSUE DETECTED:")
        print("   User-specific order retrieval failed")
        print("   Victor Rodriguez order cannot be retrieved by user ID")
    
    # Success criteria: all three enhanced endpoints must work
    success_criteria = stats_success and all_orders_success and user_orders_success
    
    if success_criteria:
        print("\n🎉 SUCCESS: Updated admin dashboard statistics API is working correctly!")
        print("   ✅ 3 orders total (including victor rodriguez order)")
        print("   ✅ Total revenue: $72.70 (25.35 + 9.60 + 37.75)")
        print("   ✅ Active orders: 3 (2 pendiente + 1 en_proceso)")
        print("   ✅ Top products include Ribeye, Trip tip, Arañita, and Filete Limpio")
        print("   ✅ Victor Rodriguez order has proper usuarioId and complete product details")
        print("   ✅ User-specific order retrieval working for victor rodriguez")
        print("\n   The enhanced dashboard data structure is working with real order and product information!")
    else:
        print("\n❌ FAILURE: One or more enhanced validation checks failed.")
        print("   The updated admin dashboard statistics API needs attention.")
    
    return 0 if success_criteria else 1

if __name__ == "__main__":
    sys.exit(main())