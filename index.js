const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 8080;

const dotenv = require('dotenv');

dotenv.config();

app.get('/', (req, res)=> {
    res.send('Welcome to the Blog API');
});

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`); 
});