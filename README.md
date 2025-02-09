
# URL Shortener & Analytics API with Google Sign-In

## Overview

This project provides a **URL Shortener** service with overall analytics of the URLs and **Google Sign-In** for user authentication. Users can can sign in via google, shorten URLs, and track analytics such as clicks, unique users, operating systems, device types, and more.

### Features
- **Google Sign-In**: Simplified user authentication using Google OAuth 2.0.
- **URL Shortening**: Generate short URLs for long links.
- **Analytics**: Track clicks, unique users, OS types, device types, and more.
- **Topic-Based and Overall Analytics**: Get insights for specific topics or all URLs created by the user.
- **Date-Based Analytics**: Track click patterns by date.

---

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: Google OAuth 2.0, JWT (JSON Web Token)
- **Other Packages**: Passport.js, dotenv, useragent, redis, geoip-lite, nanoid, cors.

---

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ShubhamMaske/Url_Shortener
   cd Url_Shortener
   ```

2. **Install Dependencies**
   ```Terminal
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file and add the following:
   ```
   MONGO_URI=mongodb://localhost:27017/your-database-name
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL =callback_url
   JWT_SECRET=your-secret-key
   JWT_SECRET = "thisissecret"
   REDIS_URL = redis_url
   ```

4. **Run the Application**
   ```bash
   npm start
   ```

---

## API Endpoints

### 1. **User Authentication**






##### Response:


---

### 2. **URL Management**
#### `POST /api/shorten/`
**Create a Short URL**  
**Request Body:**
```json
{
  "longUrl": "https://example.com/very/long/url",
  "customAlias": "custom-alias",
  "topic": "blog"
}
```

##### Response:
```json
{
  "shortUrl": "http://localhost:3000/custom-alias",
  "createdAt": Date
}
```

#### `GET /api/shorten/:alias`
**Redirect to the longUrl and add analytics to database**

##### Response:
```
Redirect the user to the original long URL
```

---

## Project Structure

```
.
├── models
│   ├── user.js                     # User schema for MongoDB
│   └── url.js                      # URL and Analytics schema
├── routes
│   ├── authRoutes.js               # Google Sign-In routes
│   └── urlRoutes.js                # URL and Analytics routes
│   └── analyticsRoutes.js          # Analytics routes
├── controller
│   ├── authController.js           # authentication controller
│   ├── urlController.js            # short url controller
│   ├── analyticsController.js      # url analytics controller
├── server.js                       # Main application entry point
├── .env                            # Environment variables
├── package.json                    # Node.js dependencies and scripts
└── README.md                       # Project documentation
```

---

## How It Works

1. **User Authentication**
  

2. **URL Shortening**
   - Users can shorten any long URL with an optional custom alias.
   - Each short URL is stored in MongoDB.

3. **Analytics Tracking**
   - Each click on a short URL is recorded, capturing the timestamp, IP address, operating system, and device type.
   - The system provides **overall analytics** and **topic-based analytics**.

---