const User = require('../models/usermodel');
const generateToken = require('../utils/generateToken');

const getUserProfile = async(req, res) => {
    const user = await User.findOne(req.user._id).select('-password');

    if(user){
        res.json(user);
    }else{
        res.status(404).json({
            messaage: 'User Not Found'
        });
    }
};

const updateUserProfile = async(req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.username = req.body.username;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            token: generateToken(updatedUser._id)
        });
    }else{
        res.status(404).json({
            message: 'User Not Found'
        })
    }
};

//Admin Only
const getAllUsers = async(req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users)
};


const deleteUser = async(req, res) => {
    const user = await User.findById(req,params.id);
    if(user){
        await user.remove();
        res.json({ message: 'User Removed' });
    }else{
        res.status(404).json({message: 'User Not Found'})
    }
}



module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser
};