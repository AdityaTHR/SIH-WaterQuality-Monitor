# IoT Water Quality Monitoring Backend

This is the Python Flask backend for the Smart India Hackathon Water Quality Monitoring project. It simulates and provides real-time water quality data for Northeast India regions through REST APIs.

## Features

- Simulates water quality sensor data with realistic parameters
- Integrates real government water quality data where available
- Provides REST endpoints for sensor data, alerts, and status
- Periodically sends data to the main backend system
- Designed for easy integration with frontend, AIML, and blockchain modules

## Setup Instructions

1. **Prerequisites**
   - Python 3.8 or higher
   - Git installed
   - Internet connection (for real data integration)


2. **Installation**

git clone <repository-url>
cd SIH-WaterQuality-Monitor/iot-backend-python
python -m venv venv
source venv/bin/activate # Linux/Mac
.\venv\Scripts\activate # Windows
pip install -r requirements.txt


3. **Running the Backend**

python enhanced_iot_backend.py

The backend will start on [http://localhost:5000](http://localhost:5000).


4. **Testing API Endpoints**

Access the following URLs in a browser or API client (Postman/VSCode REST Client):

- `/api/status` : System health and sensor status
- `/api/sensors/latest` : Latest water quality readings
- `/api/sensors/alerts` : Current alerts for poor water quality
- `/api/sensors/reading/<region>` : Fresh readings for a specific region

## Troubleshooting

- If the server doesn’t start, check Python and pip installation.
- Ensure port 5000 is free and not blocked by firewall.
- Activate the virtual environment before running.

## Contact

For help or questions, reach out to "adityakmohanty1729@gmail.com" .

---

*Prepared for Smart India Hackathon 2025*



