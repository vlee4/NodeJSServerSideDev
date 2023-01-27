const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        maxLength: 20,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String, 
        enum: [
            'Male',
            'Female',
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    
},{
    timestamps: true,
})

//pre-hook instance method (triggered on- PUT, POST, DELETE)
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        //only if new password saved should we hash it again
        next()
    }
    //salt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
} )

//Generate JWT token to send back to client
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports = mongoose.model('User', UserSchema);