# ANRS User APIs - Postman Testing Guide

## Overview
This guide provides comprehensive instructions for testing the ANRS User Authentication and Management APIs using Postman.

## Collections Available

### 1. ANRS_User_APIs.postman_collection.json
Main collection with all core functionality tests including:
- Health check
- User authentication (register, login, verify, profile)
- User management (profile, password, activities, stats)
- Basic error testing

### 2. ANRS_User_APIs_Extended.postman_collection.json
Extended collection focused on error testing and edge cases:
- Invalid data validation
- Authentication failures
- Authorization errors
- Input validation errors

## Setup Instructions

### 1. Import Collections
1. Open Postman
2. Click "Import" button
3. Select both JSON files from the `backend/postman/` directory
4. Collections will be imported with all requests and tests

### 2. Environment Setup
The collections use variables that are automatically managed:
- `baseUrl`: Set to `http://localhost:8080` (modify if needed)
- `authToken`: Automatically set after successful login/registration
- `userId`: Automatically set after successful registration

### 3. Server Requirements
Ensure the ANRS backend server is running:
```bash
cd backend
npm run dev
# or
node server.js
```

## Testing Workflow

### Phase 1: Basic Functionality Testing

#### Step 1: Health Check
- Run "Health Check" request
- Verify server is running and responding
- Expected: 200 OK with server status

#### Step 2: User Registration
- Run "Register User" request
- Creates a new user account
- Automatically saves auth token for subsequent requests
- Expected: 201 Created with user data and JWT token

#### Step 3: User Login
- Run "Login User" request
- Authenticates with registered credentials
- Updates auth token
- Expected: 200 OK with user data and JWT token

#### Step 4: Token Verification
- Run "Verify Token" request
- Validates the current JWT token
- Expected: 200 OK with token validity confirmation

#### Step 5: Profile Management
- Run "Get User Profile" request
- Run "Update User Profile" request
- Expected: 200 OK with user profile data

#### Step 6: Password Management
- Run "Change Password" request
- Updates user password securely
- Expected: 200 OK with success message

#### Step 7: User Data
- Run "Get User Activities" request
- Run "Get User Statistics" request
- Expected: 200 OK with user activity/stats data

### Phase 2: Error Testing

#### Authentication Errors
1. **Invalid Registration Data**
   - Run "Register - Invalid Data"
   - Expected: 400 Bad Request with validation errors

2. **Duplicate Email Registration**
   - Run "Register - Duplicate Email"
   - Expected: 409 Conflict

3. **Wrong Login Credentials**
   - Run "Login - Wrong Credentials"
   - Expected: 401 Unauthorized

4. **Invalid Token Access**
   - Run "Invalid Token" request
   - Expected: 401 Unauthorized

#### Authorization Errors
1. **No Token Access**
   - Run "Access Without Token"
   - Expected: 401 Unauthorized

2. **Invalid Profile Updates**
   - Run "Update Profile - Invalid Email"
   - Expected: 400 Bad Request with validation errors

3. **Wrong Password for Changes**
   - Run "Change Password - Wrong Current"
   - Expected: 401 Unauthorized

## Request Details

### Authentication Endpoints

#### POST /api/auth/register
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```
**Response**: User object + JWT token

#### POST /api/auth/login
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```
**Response**: User object + JWT token

#### GET /api/auth/verify
**Headers**: `Authorization: Bearer {token}`
**Response**: Token validation result

#### GET /api/auth/profile
**Headers**: `Authorization: Bearer {token}`
**Response**: User profile data

### User Management Endpoints

#### GET /api/users/profile
**Headers**: `Authorization: Bearer {token}`
**Response**: Current user profile

#### PUT /api/users/profile
**Headers**: `Authorization: Bearer {token}`
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```
**Response**: Updated user profile

#### PUT /api/users/password
**Headers**: `Authorization: Bearer {token}`
```json
{
  "currentPassword": "CurrentPass123",
  "newPassword": "NewPass123"
}
```
**Response**: Success message

#### GET /api/users/activities
**Headers**: `Authorization: Bearer {token}`
**Query Params**: `page=1&limit=10`
**Response**: User activities with pagination

#### GET /api/users/stats
**Headers**: `Authorization: Bearer {token}`
**Response**: User statistics

#### DELETE /api/users/account
**Headers**: `Authorization: Bearer {token}`
```json
{
  "password": "CurrentPassword123"
}
```
**Response**: Account deletion confirmation

## Automated Testing

### Test Scripts Included
Each request includes automated test scripts that verify:
- Response status codes
- Response structure
- Data validation
- Error handling

### Running Collection Tests
1. Select a collection
2. Click "Run" button
3. Configure test run settings
4. Execute all tests automatically
5. Review test results

### Test Assertions
The collections include comprehensive test assertions:
- Status code validation
- Response structure verification
- Data type checking
- Error message validation
- Token management

## Common Issues & Solutions

### Issue: Rate Limiting
**Problem**: Too many requests in short time
**Solution**: Wait 15 minutes or restart server

### Issue: Token Expiration
**Problem**: 401 errors on authenticated requests
**Solution**: Re-run login request to get new token

### Issue: Server Not Running
**Problem**: Connection refused errors
**Solution**: Start the backend server

### Issue: Database Connection
**Problem**: 500 errors on requests
**Solution**: Check database configuration and connection

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

### Validation Error Response
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

## Security Testing Notes

### Password Requirements
- Minimum 6 characters
- Must contain uppercase, lowercase, and number
- Validated on registration and password change

### Token Security
- JWT tokens expire in 7 days (configurable)
- Tokens include user type verification
- Invalid tokens are rejected with 401 status

### Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes
- Prevents brute force attacks
- Returns 429 status when exceeded

## Next Steps

After successful testing:
1. Integrate with frontend applications
2. Configure production environment variables
3. Set up monitoring and logging
4. Implement additional security measures
5. Add more comprehensive user activity tracking

## Support

For issues or questions:
1. Check server logs for detailed error information
2. Verify database connectivity
3. Ensure all environment variables are set
4. Review the implementation documentation
