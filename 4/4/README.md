# Test Case 4 — Docker & Containerization

## Build the image

```bash
docker build -t nodejs-api .
```

## Run the container

```bash
docker run -p 8080:8080 nodejs-api
```

## Verify health endpoint

```bash
curl http://localhost:8080/health
```

Expected:

```json
{ "status": "OK" }
```

## Run with Docker Compose

```bash
docker compose up -d
```
