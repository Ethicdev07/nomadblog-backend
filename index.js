const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 8080;

connectDB();



app.listen(PORT, ()=> {
    logger.info(`Server is running on port ${PORT}`); 
})