const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name.']
    },
    email: {
        type: String,
        required: [true, 'Please add an email.'],
        unique: [true, 'User already exists'],
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password.'],
        minLength: 6, 
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);