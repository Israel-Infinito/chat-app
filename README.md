# FSE Chat Room Application

A real-time chat application built with Node.js, Express, and Socket.IO that allows users to register, log in, and participate in a shared chat room.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socketdotio&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

---

## Features

- **User Authentication** — Secure registration and login with password hashing via bcrypt
- **Real-time Messaging** — Instant message delivery using Socket.IO
- **Session Management** — User sessions maintained with Express sessions and Passport.js
- **User Presence Tracking** — Live notifications when users join or leave
- **Message History** — All messages persisted in MongoDB with timestamps
- **Responsive Design** — Clean and intuitive user interface

---

## Tech Stack

**Backend**
- Node.js — JavaScript runtime
- Express.js — Web application framework
- Socket.IO — Real-time communication
- Mongoose — MongoDB object modeling
- Passport.js — Authentication middleware
- bcrypt — Password hashing

**Frontend**
- HTML5, CSS3, JavaScript (jQuery)
- Socket.IO Client

**Database**
- MongoDB — NoSQL database for users and messages

---

## Project Structure
```
chat-app/
├── app.js                      # Express app setup and configuration
├── server.js                   # Server entry point with Socket.IO
├── package.json                # Dependencies and metadata
├── config/
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── authController.js       # Authentication logic
│   └── chatController.js       # Chat messaging logic
├── middleware/
│   └── auth.js                 # Authentication middleware
├── models/
│   ├── userModel.js            # User schema
│   └── messageModel.js         # Message schema
├── routes/
│   ├── authRoutes.js           # Auth endpoints
│   └── chatRoutes.js           # Chat endpoints
└── public/
    ├── index.html              # Chat room page
    ├── login.html              # Login/Registration page
    ├── css/
    │   └── styles.css
    └── js/
        ├── index.js            # Chat room functionality
        └── login.js            # Login/Registration functionality
```

---

## Prerequisites

- Node.js v14 or higher
- npm
- MongoDB Atlas account
- A modern web browser

---

## Installation

1. **Clone the repository**
```bash
   git clone https://github.com/Israel-Infinito/chat-app.git
   cd chat-app
```

2. **Install dependencies**
```bash
   npm install
```

3. **Configure MongoDB**

   Update the connection string in `config/db.js` with your MongoDB Atlas URI:
```js
   const uri = 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/chat-app';
```

---

## Running the Application

**Development**
```bash
npm run dev
```

**Production**
```bash
node server.js
```

App runs at `http://localhost:3000`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/login` | Display login/registration page |
| POST | `/login` | Authenticate user |
| GET | `/logout` | Logout current user |
| POST | `/register` | Register a new user |

### Chat

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/chat` | Display chat room | Yes |
| POST | `/messages` | Post a new message | No |
| GET | `/messages` | Retrieve all messages | No |

---

## Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Client → Server | Client connects to chat room |
| `user joined` | Server → Client | Broadcast when a user joins |
| `user left` | Server → Client | Broadcast when a user leaves |
| `chat message` | Bidirectional | Send and receive messages |
| `disconnect` | Client → Server | Client disconnects |

---

## Database Schema

**User**
```js
{
  username: String, // unique
  password: String  // bcrypt hashed
}
```

**Message**
```js
{
  userid:    ObjectId, // ref: User
  username:  String,
  message:   String,
  timestamp: Date      // default: Date.now
}
```

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- Session handling via express-session
- Protected routes with authentication middleware
- Passport.js local strategy

---

## Environment Variables

For production, move configuration to a `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=your_secret_key
NODE_ENV=production
```

---

## Future Enhancements

- [ ] Private messaging between users
- [ ] User profiles and avatars
- [ ] Typing indicators
- [ ] Message editing and deletion
- [ ] Message search
- [ ] Online user list
- [ ] Room-based channels
- [ ] File sharing
- [ ] Emoji and reactions support

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## Author

**Alagbe Israel**
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Israel-Infinito)

---

## Useful Links

- [Express.js Documentation](https://expressjs.com)
- [Socket.IO Documentation](https://socket.io/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [Passport.js Documentation](https://www.passportjs.org/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs)