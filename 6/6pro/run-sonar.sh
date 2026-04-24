#!/bin/bash

# ============================================================
# SonarQube Analysis Runner Script
# Test Case 6 — Code Quality Analysis
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  SonarQube Analysis - NodeJS API       ${NC}"
echo -e "${GREEN}========================================${NC}"

# Step 1: Start SonarQube via Docker
echo -e "\n${YELLOW}[Step 1] Starting SonarQube server via Docker Compose...${NC}"
docker compose up -d sonarqube

# Step 2: Wait for SonarQube to be ready
echo -e "\n${YELLOW}[Step 2] Waiting for SonarQube dashboard at http://localhost:9000 ...${NC}"
MAX_WAIT=120
ELAPSED=0
until curl -s http://localhost:9000/api/system/status | grep -q '"status":"UP"'; do
  if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo -e "${RED}SonarQube did not start within ${MAX_WAIT}s. Check Docker logs.${NC}"
    exit 1
  fi
  echo -e "  Waiting... (${ELAPSED}s)"
  sleep 10
  ELAPSED=$((ELAPSED + 10))
done
echo -e "${GREEN}✔ SonarQube is UP at http://localhost:9000${NC}"

# Step 3: Generate token (prompt user)
echo -e "\n${YELLOW}[Step 3] Token Generation${NC}"
echo -e "  1. Open http://localhost:9000 in your browser."
echo -e "  2. Log in with: admin / admin (change password on first login)."
echo -e "  3. Go to: My Account → Security → Generate Token."
echo -e "  4. Copy the token and paste it below:"
echo -n "  Enter your SonarQube token: "
read -r SONAR_TOKEN

if [ -z "$SONAR_TOKEN" ]; then
  echo -e "${RED}No token provided. Exiting.${NC}"
  exit 1
fi

# Step 4: Update sonar-project.properties with token
echo -e "\n${YELLOW}[Step 4] Updating sonar-project.properties with your token...${NC}"
if grep -q '^# sonar.login=' sonar-project.properties; then
  # Replace commented-out line with actual token
  sed -i 's|^# sonar.login=.*|sonar.login='"$SONAR_TOKEN"'|' sonar-project.properties
elif grep -q '^sonar.login=' sonar-project.properties; then
  sed -i 's|^sonar.login=.*|sonar.login='"$SONAR_TOKEN"'|' sonar-project.properties
else
  echo "sonar.login=$SONAR_TOKEN" >> sonar-project.properties
fi
echo -e "${GREEN}✔ sonar-project.properties updated.${NC}"

# Step 5: Install sonar-scanner if not present
echo -e "\n${YELLOW}[Step 5] Checking sonar-scanner installation...${NC}"
if ! command -v sonar-scanner &> /dev/null; then
  echo -e "  sonar-scanner not found. Installing globally via npm..."
  npm install -g sonarqube-scanner
  echo -e "${GREEN}✔ sonar-scanner installed.${NC}"
else
  echo -e "${GREEN}✔ sonar-scanner already installed: $(sonar-scanner --version 2>&1 | head -1)${NC}"
fi

# Step 6: Install project dependencies
echo -e "\n${YELLOW}[Step 6] Installing Node.js project dependencies...${NC}"
npm install
echo -e "${GREEN}✔ Dependencies installed.${NC}"

# Step 7: Run tests with coverage
echo -e "\n${YELLOW}[Step 7] Running tests and generating coverage report...${NC}"
npm test -- --passWithNoTests || echo -e "${YELLOW}  ⚠ Some tests failed or no tests found — continuing with analysis.${NC}"

# Step 8: Run SonarQube scanner
echo -e "\n${YELLOW}[Step 8] Running SonarQube scanner...${NC}"
sonar-scanner -Dsonar.login="$SONAR_TOKEN"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  EXECUTION SUCCESS!                    ${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "  Dashboard: http://localhost:9000/dashboard?id=nodejs-api"
echo -e "  Check the 'NodeJS API' project for analysis results."
