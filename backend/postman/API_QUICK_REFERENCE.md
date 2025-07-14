# ANRS User APIs - Quick Reference

## Base URL
```
http://localhost:8080
```

## Authentication Endpoints

### 🔐 Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```
**Response**: `201 Created` + User data + JWT token

### 🔑 Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```
**Response**: `200 OK` + User data + JWT token

### ✅ Verify Token
```http
GET /api/auth/verify
Authorization: Bearer {your_jwt_token}
```
**Response**: `200 OK` + Token validity + User data

### 👤 Get Auth Profile
```http
GET /api/auth/profile
Authorization: Bearer {your_jwt_token}
```
**Response**: `200 OK` + User profile

### 🧪 Auth Test
```http
GET /api/auth/test
```
**Response**: `200 OK` + Test message

## User Management Endpoints

### 📋 Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {your_jwt_token}
```
**Response**: `200 OK` + User profile

### ✏️ Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer {your_jwt_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```
**Response**: `200 OK` + Updated profile

### 🔒 Change Password
```http
PUT /api/users/password
Authorization: Bearer {your_jwt_token}
Content-Type: application/json

{
  "currentPassword": "CurrentPass123",
  "newPassword": "NewPass123"
}
```
**Response**: `200 OK` + Success message

### 📊 Get User Activities
```http
GET /api/users/activities?page=1&limit=10
Authorization: Bearer {your_jwt_token}
```
**Response**: `200 OK` + Activities + Pagination

### 📈 Get User Statistics
```http
GET /api/users/stats
Authorization: Bearer {your_jwt_token}
```
**Response**: `200 OK` + User statistics

### 🗑️ Delete User Account
```http
DELETE /api/users/account
Authorization: Bearer {your_jwt_token}
Content-Type: application/json

{
  "password": "CurrentPassword123"
}
```
**Response**: `200 OK` + Deletion confirmation

### 🧪 User Test
```http
GET /api/users/test
Authorization: Bearer {your_jwt_token}
```
**Response**: `200 OK` + Test message + User data

## System Endpoints

### 🏥 Health Check
```http
GET /api/health
```
**Response**: `200 OK` + Server status

## Response Formats

### ✅ Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### ❌ Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

### 🚫 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "param": "email",
      "msg": "Please provide a valid email",
      "value": "invalid-email"
    }
  ]
}
```

## Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST (registration) |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Invalid/missing token, wrong password |
| 409 | Conflict | Email already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server/database errors |

## Authentication Flow

1. **Register** → Get JWT token
2. **Login** → Get JWT token (if already registered)
3. **Use token** in `Authorization: Bearer {token}` header
4. **Verify token** periodically
5. **Refresh** by logging in again when expired

## Rate Limits

- **Auth endpoints**: 5 requests per 15 minutes per IP
- **Other endpoints**: Standard server limits

## Password Requirements

- Minimum 6 characters
- Must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

## Testing Tips

### 🔄 Testing Workflow
1. Health check → Register → Login → Profile operations
2. Test error cases with invalid data
3. Test authentication with wrong/missing tokens

### 🛠️ Postman Setup
1. Import provided collections
2. Set environment variables
3. Run requests in sequence
4. Check automated test results

### 🐛 Common Issues
- **401 errors**: Check token validity, re-login if needed
- **429 errors**: Wait 15 minutes or restart server
- **500 errors**: Check server logs and database connection

## cURL Examples

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

### Get Profile
```bash
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile
```bash
curl -X PUT http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","email":"john@example.com"}'
```

## Environment Variables

For production, set these environment variables:
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
- `BCRYPT_ROUNDS`: Password hashing rounds (default: 12)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Database config
