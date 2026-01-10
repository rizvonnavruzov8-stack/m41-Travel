import urllib.request
import json
import time
import urllib.error

def test_api():
    base_url = "http://127.0.0.1:8000"
    
    # Wait for server to start
    print("Waiting for server to start...")
    for _ in range(10):
        try:
            with urllib.request.urlopen(f"{base_url}/api/health") as response:
                if response.status == 200:
                    print("Server is up!")
                    break
        except (urllib.error.URLError, ConnectionRefusedError):
            time.sleep(1)
            print("Retrying...")
    else:
        print("Server failed to start.")
        return

    # Test Health Check
    try:
        with urllib.request.urlopen(f"{base_url}/api/health") as response:
            print(f"Health Check: {response.status}")
            print(response.read().decode())
    except Exception as e:
        print(f"Health check failed: {e}")

    # Test Submit Form
    payload = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "num_travelers": 2,
        "message": "This is a test message from the verification script."
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(f"{base_url}/api/submit-form", data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Submit Form: {response.status}")
            print(response.read().decode())
    except Exception as e:
        print(f"Submit form failed: {e}")

if __name__ == "__main__":
    test_api()
