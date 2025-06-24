const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const morgan = require('morgan');
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'), { flags: 'a' }
);

// Log HTTP requests using Morgan
app.use(morgan('combined', {
  stream: accessLogStream // Write to logs/access.log
}));

// logs HTTP requests to Winston logger
app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));


app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/posts');
// app.use('/api/users');

app.get('/', (req, res)=> {
    res.send('Welcome to the Blog API');
});

app.get('/error', (req, res)=> {
    logger.error('This is a test error log');
    res.status(500).send('This is a test error endpoint');
})




app.use(notFound);
app.use(errorHandler);


module.exports = app;