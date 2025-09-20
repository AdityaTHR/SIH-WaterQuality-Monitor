import requests

BASE_URL = 'http://localhost:5000'

def test_status():
    response = requests.get(f'{BASE_URL}/api/status')
    assert response.status_code == 200
    data = response.json()
    assert 'status' in data
    print("Status API OK")

def test_latest():
    response = requests.get(f'{BASE_URL}/api/sensors/latest')
    assert response.status_code == 200
    data = response.json()
    assert 'data' in data
    print("Latest sensors API OK")

def test_alerts():
    response = requests.get(f'{BASE_URL}/api/sensors/alerts')
    assert response.status_code == 200
    data = response.json()
    assert 'alerts' in data
    print("Alerts API OK")

if __name__ == '__main__':
    print("Running API Tests...")
    test_status()
    test_latest()
    test_alerts()
    print("All tests passed.")
