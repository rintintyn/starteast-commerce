# STAREast Commerce API

## Description
Simple in-memory REST API for an e-commerce checkout flow with JWT authentication.

## Installation
```bash
npm install
```

## How to Run
```bash
npm start
```

The API runs on `http://localhost:3000` by default. You can override the port with
`PORT` and the JWT secret with `JWT_SECRET`.

Swagger UI is available at `http://localhost:3000/docs`.

## Rules
- Only `cash` or `credit_card` are accepted as payment methods (the API also
  normalizes `credit card` and `credit-card` to `credit_card`).
- Cash payments get a 10% discount.
- Checkout requires a valid JWT token.

## Data Already Existent
Users (all passwords are `password123`):
- Alex Johnson (`alex@stareast.com`)
- Jamie Lee (`jamie@stareast.com`)
- Taylor Morgan (`taylor@stareast.com`)

Products:
- 1: STAREast Conference Pass ($399)
- 2: STAREast Hoodie ($55)
- 3: STAREast Mug ($18)

## How to Use the Rest API
Login:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@stareast.com","password":"password123"}'
```

Register:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sam Rivera","email":"sam@stareast.com","password":"password123"}'
```

Checkout (requires a token from login/register):
```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"paymentMethod":"cash","items":[{"productId":1,"quantity":1}]}'
```

Healthcheck:
```bash
curl http://localhost:3000/healthcheck
```
