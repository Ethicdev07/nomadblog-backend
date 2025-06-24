const jwt = require('jsonwebtoken');


const generateToken = (user) => {
    if (!user) {
        throw new Error('User object is required to generate token');
    }

    const payload = {
        id: user._id,
        email: user.email,
        username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h' 
    });

    return token;
}

module.exports = generateToken;