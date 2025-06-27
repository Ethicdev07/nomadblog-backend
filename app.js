const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/posts'); 

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API');
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
