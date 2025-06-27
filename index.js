const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const connectDB = require('./config/db');
// const logger = require('./utils/logger');

const PORT = process.env.PORT || 8080;

connectDB();



app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`); 
})