# Muslim Viet Backend API

Backend API server for Muslim Viet application built with Node.js, Express, and MongoDB.

## Features

- 🔐 Google OAuth Authentication
- 📚 Bookmark Management (Hadith, Quran, Dua, Tasbih)
- 👤 User Profile Management
- 🔍 Search Functionality
- 📊 User Statistics
- 📤 Data Export
- 🛡️ Security Middleware
- 📈 Rate Limiting

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Helmet** - Security
- **CORS** - Cross-origin requests
- **Morgan** - Logging

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/muslimviet
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/activity` - Get user activity
- `GET /api/users/search` - Search bookmarks
- `GET /api/users/export` - Export user data

### Bookmarks
- `POST /api/bookmarks` - Create bookmark
- `GET /api/bookmarks` - Get user bookmarks
- `GET /api/bookmarks/:id` - Get single bookmark
- `PUT /api/bookmarks/:id` - Update bookmark
- `DELETE /api/bookmarks/:id` - Delete bookmark
- `PATCH /api/bookmarks/:id/favorite` - Toggle favorite
- `GET /api/bookmarks/public/popular` - Get popular bookmarks
- `POST /api/bookmarks/bulk` - Bulk operations

## Database Models

### User
- Google OAuth integration
- Profile information
- Preferences
- Activity tracking

### Bookmark
- Support for Hadith, Quran, Dua, Tasbih
- Metadata storage
- Tags and notes
- Favorite status
- Public/private visibility
- View tracking

## Security Features

- JWT token authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Error handling

## Development

The server runs on `http://localhost:3000` by default.

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/muslimviet` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Required |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Required |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

ISC License
