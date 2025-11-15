# E-commerce Demo

## Installation:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Rename `.env.example` to `.env`.
4. Run the server using `npm run dev`.

## Configuration:

- Environment Variables:
  - `PORT`: Port number the server listens on. Default: 3000
  - `MONGODB_URI`: URI for MongoDB database.
  - `JWT_SECRET`: Secret key for JWT token generation.
  - `EXPIRES_IN`: Token expiration time.

## Usage:

- API Endpoints:

  - POST `/api/v1/auth/login`

    - Description: Authenticates user and returns a JWT token.
    - Request:
      ```json
      {
        "email": "example@email.com",
        "password": "password"
      }
      ```
    - Response:
      ```json
      {
        "success": true,
        "message": "User registered successfully"
      }
      ```

  - POST `/api/v1/users/register`
    - Description: Registers a new user.
    - Request:
      ```json
      {
        "name": "John",
        "email": "example@email.com",
        "password": "password"
      }
      ```
    - Response:
      ```json
      {
        "success": true,
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBoMkBleGFtcGxlLmNvbSIsImlhdCI6MTcwNzg1MDYyMSwiZXhwIjoxNzA3OTM3MDIxfQ.7EahSgmPLPNuZ_T9ok-B6TayWCJVdxPzi_Nx4UfrhvY"
      }
      ```

## Dependencies:

- `express`: Web framework for Node.js.
- `mongoose`: mongodb object modeling for node.js.
- `mongodb`: MongoDB driver for Node.js.
- `bcryptjs`: Library for hashing passwords.
- `cors`: Express middleware for enabling CORS.
- `dotenv`: Loads environment variables from .env file.
- `jsonwebtoken`: Library for generating and verifying JWT tokens.
- `nodemon`: Utility for automatically restarting the server during development.
