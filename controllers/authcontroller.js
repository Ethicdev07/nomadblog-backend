const User = require('../models/usermodel');
const generateToken = require('../utils/generateToken');

const register = async(req, res) => {
   const { username, email, password } = req.body;

   const userExists = await User.findOne({ email });
   if(userExists) {
       return res.status(400).json({ message: 'User already exists' });
   }

   const user = await User.create({
       username,
       email,
       password
   });

   if(user){
    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
    });
   }else{
    res.status(400).json({ message: 'Invalid user data' });
   }
};


const login = async (req, res) =>{
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))){
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    }else{
        res.status(401).json({ message: 'Invalid email or password' });
    }
};






module.exports = { register, login };