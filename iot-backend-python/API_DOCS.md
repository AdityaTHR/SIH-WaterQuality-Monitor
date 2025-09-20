# IoT Backend API Documentation

This document describes the REST API endpoints provided by the IoT Water Quality Monitoring Backend.

---

## Base URL

Assuming local development:  
`http://localhost:5000`

---

## Endpoints

### 1. GET `/api/status`

- **Description**: Returns overall system health and sensor status.
- **Response**: JSON object
   
{
"status": "online",
"total_sensors": 8,
"sensors_active": 8,
"last_update": "2025-09-20T07:14:20.021103+00:00",
"regions": [ "Guwahati", "Shillong", ... ],
"data_sources": {
"Guwahati": "mixed",
"Shillong": "mixed",
...
},
"api_version": "2.0_enhanced"
}


---

### 2. GET `/api/sensors/latest`

- **Description**: Returns latest readings from all or a specific region.
- **Query Parameters**:
  - `region` (optional): Name of the region (e.g., `Guwahati`)
  - `metadata` (optional): `"true"` to include metadata in response
- **Response**: JSON object with sensor data and water quality parameters.

---

### 3. GET `/api/sensors/reading/<region>`

- **Description**: Generate and return a fresh reading for specified region.
- **Path Parameters**:
  - `region` (string): e.g., `Shillong`
- **Response**: JSON object with fresh sensor readings.

---

### 4. GET `/api/sensors/alerts`

- **Description**: Returns regions currently having water quality alerts.
- **Query Parameters**:
  - `severity` (optional): Filter alerts by severity (`poor`, `fair`, `all`)
- **Response**: JSON array of alert objects with severity, recommendations, timestamp.

---

### 5. POST `/api/sensors/simulate`

- **Description**: Manually trigger data simulation for testing.
- **Body Parameters**:
  - `region` (optional): Region name or `"all"`
  - `force_alert` (optional): Boolean to force an alert scenario
  - `data_source` (optional): `"auto"`, `"real"`, or `"simulated"`
- **Response**: JSON success/failure message.

---

### 6. POST `/api/transmission/start`

- **Description**: Start automatic data transmission to main backend.

---

### 7. POST `/api/transmission/stop`

- **Description**: Stop automatic data transmission.

---

### 8. GET `/api/config`

- **Description**: Get current configuration (backend URL, send interval, etc.)

---

### 9. POST `/api/config`

- **Description**: Update configuration parameters.

---

## Notes

- All endpoints return JSON.
- Authentication currently disabled; add API keys if required.
- Use `/api/status` to check if backend is online.
- Recommended tools for API testing: Postman, VSCode REST Client.

---

_End of API Documentation_
