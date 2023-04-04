const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

//@desc Register new User
//@route POST api/user
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        res.status(400);
        throw new Error('Please input all fields.')
    }
    // Check if password length is at least 6 characters
    if(password.length < 6){
        res.status(400);
        throw new Error('Password must be at least 6 characters.');
    }
    // Check if User exist
    const userExist = await User.findOne({email});
    if(userExist){
        res.status(400);
        throw new Error('User already exist.');
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create User
    const user = await User.create({
        name, 
        email, 
        password: hashedPassword
    });
    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(400);
        throw new Error('User was not created.');
    }
});

//@desc Authenticate User
//@route POST api/user/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // check user email
    const user = await User.findOne({email});
    if(!user) {
        res.status(400);
        throw new Error('User does not exist');
    }
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid Password');
    }
});

//@desc Get User data
//@route GET api/user/me
//@access Private
const getUser = asyncHandler(async (req, res) => {
    const {_id, name, email} = await User.findById(req.user.id);
    res.status(200).json({
        id: _id,
        name,
        email,
    });
});

// generate JWT
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = {
    registerUser,
    loginUser,
    getUser
};