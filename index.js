import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import connectDB from './databases/dbConnection.js';
import routes from './src/routes.js';
import errorHandler from './middlewares/errorHandler.js';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { port } from './config.env.js';
import dotenv from 'dotenv'
 

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();


//! set security http headers
// app.use(helmet())

const uploadImageFolder = path.join(__dirname, 'uploads', 'images');
if (!fs.existsSync(uploadImageFolder)) {
  fs.mkdirSync(uploadImageFolder, { recursive: true });
}

const uploadFileFolder = path.join( __dirname, 'uploads', 'files');
if (!fs.existsSync(uploadFileFolder)) {
  fs.mkdirSync(uploadFileFolder, { recursive: true });
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use(cors({
  origin: '*', // should be conifgured for production version.
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(routes);

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use(errorHandler);

process.on('uncaughtException', (exception) => {
  console.log('Uncaught exception occurred:\n', exception);
  // here use process.exit(1); and use process manager to restart at any stop in deployment phase.
});
process.on('unhandledRejection', (exception) => {
  console.log('unhandled Rejection occurred:\n', exception);
  // here use process.exit(1); and use process manager to restart at any stop in deployment phase.
});

connectDB();

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Handle termination signals for graceful shutdown
function shutdown() {
  server.close((err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }
    console.log('Server closed gracefully');
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Closing server gracefully...');
  shutdown();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Closing server gracefully...');
  shutdown();
});

