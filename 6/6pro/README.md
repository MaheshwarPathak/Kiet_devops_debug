# NodeJS API — SonarQube Code Quality Analysis

> **Test Case 6**: Static Code Quality Analysis with SonarQube

A simple Node.js + Express REST API with full SonarQube integration for code quality analysis.

---

## 📁 Project Structure

```
6pro/
├── src/
│   ├── index.js                  # Express app entry point
│   ├── routes/
│   │   ├── users.js              # User routes
│   │   └── products.js           # Product routes
│   ├── controllers/
│   │   ├── userController.js     # User CRUD logic
│   │   └── productController.js  # Product CRUD logic
│   └── utils/
│       └── validator.js          # Input validation helpers
├── tests/
│   ├── users.test.js             # User API tests
│   └── products.test.js          # Product API tests
├── sonar-project.properties      # SonarQube configuration
├── docker-compose.yml            # SonarQube Docker setup
├── run-sonar.sh                  # Automated analysis runner
├── package.json
└── .env.example
```

---

## 🚀 Quick Start (Automated)

Run the full analysis in one command:

```bash
chmod +x run-sonar.sh
./run-sonar.sh
```

This script:
1. Starts SonarQube via Docker on port 9000
2. Waits for the dashboard to be accessible
3. Prompts you to enter your authentication token
4. Installs `sonarqube-scanner` CLI globally
5. Installs Node.js dependencies
6. Runs tests and generates coverage
7. Executes the SonarQube scanner

---

## 🔧 Manual Step-by-Step

### Step 1: Start SonarQube Server

```bash
docker compose up -d sonarqube
```

Wait until accessible at **http://localhost:9000** (~60–120 seconds).

### Step 2: Log In & Generate Token

| Field    | Value   |
|----------|---------|
| URL      | http://localhost:9000 |
| Username | `admin` |
| Password | `admin` (change on first login) |

1. Go to **My Account → Security**
2. Under **Generate Tokens**, enter a name (e.g., `nodejs-api-token`)
3. Click **Generate** and **copy the token**

### Step 3: Install SonarQube Scanner

```bash
npm install -g sonarqube-scanner
```

Verify:
```bash
sonar-scanner --version
```

### Step 4: Configure `sonar-project.properties`

Edit the file and set your token:

```properties
sonar.projectKey=nodejs-api
sonar.projectName=NodeJS API
sonar.projectVersion=1.0
sonar.host.url=http://localhost:9000
sonar.login=<YOUR_GENERATED_TOKEN>
sonar.sources=.
sonar.exclusions=node_modules/**,coverage/**,*.test.js
sonar.language=js
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.sourceEncoding=UTF-8
```

### Step 5: Install Dependencies & Run Tests

```bash
npm install
npm test
```

### Step 6: Run SonarQube Scanner

```bash
sonar-scanner
```

Expected output ends with:
```
INFO: EXECUTION SUCCESS
```

### Step 7: View Results

Open: **http://localhost:9000/dashboard?id=nodejs-api**

You should see:
- ✅ Project: **NodeJS API**
- 📊 Metrics: Bugs, Code Smells, Coverage, Duplications
- 🏆 Quality Gate status

---

## 📊 API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/health`             | Health check         |
| GET    | `/api/users`          | Get all users        |
| GET    | `/api/users/:id`      | Get user by ID       |
| POST   | `/api/users`          | Create new user      |
| PUT    | `/api/users/:id`      | Update user          |
| DELETE | `/api/users/:id`      | Delete user          |
| GET    | `/api/products`       | Get all products     |
| GET    | `/api/products/:id`   | Get product by ID    |
| POST   | `/api/products`       | Create new product   |
| PUT    | `/api/products/:id`   | Update product       |
| DELETE | `/api/products/:id`   | Delete product       |

---

## 🧪 Running Tests

```bash
npm test             # Run all tests
npm test -- --coverage  # With coverage report
```

---

## 🛑 Stop SonarQube

```bash
docker compose down
```

---

## 📋 Expected Outcome

| Outcome | Status |
|---------|--------|
| SonarQube container running on port 9000 | ✅ |
| Dashboard accessible at http://localhost:9000 | ✅ |
| Scanner exits with `EXECUTION SUCCESS` | ✅ |
| Project **NodeJS API** visible on dashboard | ✅ |
| Analysis report shows bugs, code smells, coverage | ✅ |
