# Smart OTA Update and Monitoring Platform 🚀

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.35-blue.svg)](https://flutter.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.3-green)
![React](https://img.shields.io/badge/React-18-blue)
![Flutter](https://img.shields.io/badge/Flutter-3.0-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

> **Enterprise-grade Over-The-Air (OTA) update platform with real-time fleet management, JWT authentication, and multi-client support for seamless firmware distribution and device monitoring.**

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Authentication](#-authentication)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Team](#-team)

---

## ✨ Features

### 🔐 Security & Authentication
- ✅ **JWT-based Authentication** - Secure token-based access control
- ✅ **Protected Endpoints** - Bearer token authorization for sensitive operations
- ✅ **Role-based Access** - Admin and device-level permissions

### 🌐 Web Interface
- ✅ **React Dashboard** - Real-time device fleet management with status monitoring
- ✅ **Firmware Upload** - Drag & drop admin interface for firmware distribution
- ✅ **OTA Check Interface** - User-friendly update checking and download

### 📱 Mobile Application
- ✅ **Flutter Mobile App** - Cross-platform mobile interface
- ✅ **Clickable Download URLs** - Direct browser integration for firmware downloads
- ✅ **Real-time Updates** - Live OTA status checking

### 🤖 Device Simulator
- ✅ **Automated Polling** - Checks for updates every 10 seconds
- ✅ **Real Download Logic** - Automatically downloads firmware_update.zip when available
- ✅ **Error Handling** - Comprehensive logging and failure recovery

### 🗄️ Data Management
- ✅ **H2 Database** - In-memory database with persistent storage
- ✅ **Update History** - Complete audit trail of all device updates
- ✅ **Device Tracking** - Version management and status monitoring

### 🚀 Enterprise Features
- ✅ **Swagger UI** - Interactive API documentation
- ✅ **Docker Support** - Containerized deployment with docker-compose
- ✅ **Postman Collection** - Ready-to-use API testing suite
- ✅ **Cloud-Ready** - Deployable to Render, Railway, Fly.io, AWS, Azure

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Backend API** | Spring Boot | 3.3.4 |
| **Security** | Spring Security + JWT | 0.9.1 |
| **Database** | H2 Database | Embedded |
| **Frontend** | React + TypeScript | 18.0 |
| **Mobile** | Flutter + Dart | 3.35 |
| **Python API** | Flask | 3.0.0 |
| **Containerization** | Docker + Docker Compose | Latest |
| **API Docs** | Swagger/OpenAPI | 2.2.0 |
| **Build Tool** | Maven | 3.9.9 |

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Python 3.8+
- Flutter 3.0+ (for mobile app)
- Docker (optional, for containerized deployment)

### 1. Backend (Spring Boot)
```bash
cd backend-java
mvn clean install -DskipTests
java -jar target/test-project-1.0-SNAPSHOT.jar
```
**Access:** http://localhost:8081

### 2. Frontend (React)
```bash
cd frontend-react
npm install
npm start
```
**Access:** http://localhost:3000

### 3. Mobile App (Flutter)
```bash
cd mobile-flutter
flutter pub get
flutter run -d chrome
```

### 4. Device Simulator
```bash
cd device-simulator
pip install -r requirements.txt
python device.py
```

### 5. Docker Deployment (All-in-One)
```bash
docker-compose up --build
```
**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8081
- Swagger UI: http://localhost:8081/swagger-ui.html

---

## 🔐 Authentication

### Default Credentials
- **Username:** `admin`
- **Password:** `password`

### Getting JWT Token

**Via Browser:**
```
http://localhost:8081/login?username=admin&password=password
```

**Via cURL:**
```bash
curl "http://localhost:8081/login?username=admin&password=password"
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc2Mjc2OTk2OCwiaWF0IjoxNzYyNzY2MzY4fQ..."
}
```

### Using JWT Token

**Protected Endpoints:**
```bash
curl -H "Authorization: Bearer <your-token>" http://localhost:8081/ota
```

**In React Frontend:**
- Token is automatically stored in `localStorage` after login
- All authenticated requests include the token in headers

**Token Expiration:**
- Default: 1 hour
- Stored in browser localStorage for persistence

---

## 📸 Screenshots

### 1. Login Page
![Login Page](docs/screenshots/01-login.png)
*Secure JWT-based authentication interface*

### 2. Device Dashboard
![Device Dashboard](docs/screenshots/02-dashboard.png)
*Real-time fleet management with device status monitoring*

### 3. Firmware Upload
![Firmware Upload](docs/screenshots/03-upload.png)
*Drag & drop interface for firmware distribution*

### 4. OTA Update Check
![OTA Update](docs/screenshots/04-ota-update.png)
*Update availability and download interface*

### 5. Flutter Mobile App
![Flutter App](docs/screenshots/05-flutter-app.png)
*Cross-platform mobile interface with clickable download URLs*

> **Note:** Screenshots should be placed in `docs/screenshots/` directory. Update paths after adding actual images.

---

## 📁 Project Structure

```
smart-ota-platform/
├── backend-java/              # Spring Boot API
│   ├── src/main/java/com/ota/
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Data repositories
│   │   ├── service/           # Business logic
│   │   ├── controller/        # REST controllers
│   │   └── config/            # Configuration
│   ├── Dockerfile
│   └── pom.xml
├── frontend-react/            # React Web App
│   ├── src/
│   │   ├── App.tsx
│   │   ├── Dashboard.tsx
│   │   └── AdminUpload.tsx
│   ├── Dockerfile
│   └── nginx.conf
├── mobile-flutter/            # Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart
│   │   └── ota_screen.dart
│   └── pubspec.yaml
├── device-simulator/          # Python Simulator
│   ├── device.py
│   └── requirements.txt
├── backend-python/            # Flask API
│   ├── app.py
│   └── requirements.txt
├── postman/                   # API Testing
│   └── Smart_OTA_Platform.postman_collection.json
├── docs/                      # Documentation
│   ├── screenshots/
│   └── DEMO_VIDEO_SCRIPT.md
├── docker-compose.yml         # Docker orchestration
└── README.md
```

---

## 📡 API Documentation

### Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/login` | ❌ | Get JWT token |
| `GET` | `/ota` | ✅ | Get OTA update info |
| `GET` | `/api/devices` | ❌ | List all devices |
| `POST` | `/api/devices/register` | ❌ | Register device |
| `GET` | `/api/devices/{id}/history` | ❌ | Device update history |
| `POST` | `/api/upload` | ✅ | Upload firmware |
| `GET` | `/swagger-ui.html` | ❌ | Interactive API docs |

### Interactive Documentation
- **Swagger UI:** http://localhost:8081/swagger-ui.html
- **OpenAPI Spec:** http://localhost:8081/v3/api-docs
- **Postman Collection:** `postman/Smart_OTA_Platform.postman_collection.json`

---

## ☁️ Deployment

### Cloud-Ready Configuration

This platform is **production-ready** and can be deployed to:

- **Render** - Free tier available
- **Railway** - Simple deployment
- **Fly.io** - Global edge deployment
- **AWS** - EC2, ECS, or Lambda
- **Azure** - App Service or Container Instances
- **Google Cloud** - Cloud Run or GKE

### Docker Deployment
```bash
docker-compose up -d
```

### Environment Variables
```bash
# Backend
SPRING_PROFILES_ACTIVE=production
JWT_SECRET=your-secret-key
DATABASE_URL=jdbc:postgresql://...

# Frontend
REACT_APP_API_URL=https://your-api.com
```

### Database Migration
For production, replace H2 with PostgreSQL:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ota_db
    username: ${DB_USER}
    password: ${DB_PASSWORD}
```

---

## 👥 Team

👨‍💻 Developed by: Harshil Dodiya
🎓 B.Tech IT (4th Year)
📍 Ahmedabad, India

### Supervisor
- **[Supervisor Name]** - [DR. Sanjay Sonar , School of Computing And Technology , Institute of advanced research]

### Contact
- **Email:** [harshildodiya0333@gmail.com]
- **GitHub:** [(https://github.com/HarshilDodiyaForU)]
- **Project Repository:** [github.com/HarshilDodiyaForU/smart-ota-platform]

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React community for the robust frontend ecosystem
- Flutter team for cross-platform mobile development
- All open-source contributors whose libraries made this project possible

---
:

🏗️ System Architecture

<img width="1024" height="1100" alt="image" src="https://github.com/user-attachments/assets/b8daeb86-24b5-4be3-b7ea-d8549d78ef4d" />
<img width="1280" height="720" alt="image" src="https://github.com/user-attachments/assets/c9c2d3c0-a8ee-4f68-b8d7-23b89efc8124" />
<img width="1280" height="720" alt="image" src="https://github.com/user-attachments/assets/bd99d2b7-2e42-470f-83b8-435d4dc2e993" />
<img width="1292" height="622" alt="image" src="https://github.com/user-attachments/assets/b8b99049-3847-4f18-9b5b-fc5247015873" />




🎯 Project Impact
- Reduced manual firmware update effort by automating OTA deployment
- Enabled real-time device monitoring and update tracking
- Designed scalable architecture supporting multiple backend services
- Simulated real IoT environment using Python-based device emulator

## 📚 Additional Resources

- [API Documentation](http://localhost:8081/swagger-ui.html)
- [Postman Collection](postman/Smart_OTA_Platform.postman_collection.json)
- [Demo Video Script](docs/DEMO_VIDEO_SCRIPT.md)
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md)

---

<div align="center">

**Built with ❤️ by the Smart OTA Platform Team**

[⭐ Star this repo](https://github.com/HarshilDodiyaForU/smart-ota-platform) | [🐛 Report Bug](https://github.com/HarshilDodiyaForU/smart-ota-platform/issues) | [💡 Request Feature](https://github.com/HarshilDodiyaForU/smart-ota-platform/issues)

</div>
