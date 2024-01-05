// const config = require('./config')
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const connectWithDB = require('./config/db');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const logger = require('morgan');

const socketIo = require('socket.io');

const cloudinary = require('cloudinary').v2;
// connect with database
connectWithDB();

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = require('http').createServer(app);
const io = socketIo(server);

// For handling cookies
app.use(cookieParser())

// Initialize cookie-session middleware
app.use(cookieSession({
  name: 'session',
  maxAge: process.env.COOKIE_TIME * 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_SECRET],
  secure: true, // Only send over HTTPS
  sameSite: 'none', // Allow cross-origin requests
  httpOnly: true, // Makes the cookie accessible only on the server-side
}))

// middleware to handle json
app.use(express.json());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(helmet()); //helmet middleware to secure with http headers

// for logging resp in express server
app.use(logger('combined'));

// use express router
app.use('/', require('./routes'));
const reviewRouter = require("./routes/review");
app.use("/review", reviewRouter);

app.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    console.log('Error in connecting to server: ', err);
  }
  console.log(`Server is running on port no. ${process.env.PORT}`);
});


io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle custom events (if needed)
  // socket.on('custom-event', (data) => {
  //   console.log('Custom event received:', data);
  //   io.emit('custom-event-response', 'Custom event response data');
  // });
});

module.exports = app;
