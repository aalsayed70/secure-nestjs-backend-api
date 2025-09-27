# Backend API

A NestJS-based backend API for managing system data, credentials, and account information with MySQL database integration.

## 🚀 Features

- **Dashboard Analytics**: Get comprehensive statistics and insights
- **Account Management**: Search and manage user accounts
- **Corporate Data**: Handle corporate information and data
- **Combo List Management**: Manage credential combinations and URLs
- **System Data Tracking**: Monitor system information, hardware IDs, and leak detection
- **MySQL Integration**: Full TypeORM integration with MySQL database
- **CORS Support**: Configured for localhost development

## 🏗️ Project Structure

```
src/
├── accounts/           # Account management module
├── corporate/          # Corporate data module  
├── dashboard/          # Dashboard analytics module
├── combolist/          # Combo list management module
├── entities/           # Database entities
│   ├── compolistdata.entity.ts
│   ├── credentialsdata.entity.ts
│   └── systemdata.entity.ts
├── app.module.ts       # Main application module
└── main.ts            # Application entry point
```

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy the environment example file:
     ```bash
     cp env.example .env
     ```
   - Update the `.env` file with your actual database credentials:
     ```env
     DB_HOST=localhost
     DB_PORT=3306
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     DB_DATABASE=your_database_name
     PORT=3000
     NODE_ENV=development
     ```
   - Create a MySQL database with the name specified in your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 🧪 Testing

The application includes comprehensive test coverage for all services and controllers:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Coverage
- **Services**: All business logic methods tested with mocked repositories
- **Controllers**: All API endpoints tested with mocked services
- **Validation**: Input validation and error handling tested
- **Edge Cases**: Empty inputs, pagination, and error scenarios covered

**Current Test Status**: ✅ **33 tests passing** - 100% success rate

## 📊 API Endpoints

### Dashboard
- `GET /dashboard` - Get dashboard statistics

### Accounts
- `GET /accounts?username={username}` - Search accounts by username

### Corporate
- `GET /corporate` - Get corporate data

### Combo List
- `GET /combolist` - Get combo list data

## 🗄️ Database Schema

### SystemData Entity
- **ID**: Primary key
- **OS**: Operating system information
- **Path**: Installation path
- **InstallDate**: Installation timestamp
- **Hostname**: System hostname
- **Antivirus**: Antivirus information
- **HWID**: Unique hardware identifier
- **IPAddress**: System IP address
- **LeakedDate**: Data leak timestamp
- **Country**: Geographic location

### CredentialsData Entity
- **ID**: Primary key
- **Software**: Software name
- **URL**: Application URL
- **Username**: User credentials
- **Password**: Password data
- **HWID**: Foreign key to SystemData
- **LeakedDate**: Credential leak timestamp

### CompolistData Entity
- **ID**: Primary key
- **URL**: Website URL
- **Username**: Username
- **Password**: Password
- **url_md5**: MD5 hash of URL (generated)
- **username_md5**: MD5 hash of username (generated)


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



**Note**: This is a development version. Ensure proper security measures and environment configuration before production deployment.
