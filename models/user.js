const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: Buffer
    
})

userSchema.pre('save', function (next) {
    if(this.isModified('password')){
        bcrypt.hash(this.password, 8, (err, hash) => {
            if(err) return next(err);

            this.password = hash;
            next();
        })
    }
})

userSchema.methods.comparePassword = async function (password) {
    if (!password) throw new Error('Missing password, cannot compare. ');
    try {
        const result = await bcrypt.compare(password, this.password)
        return result;
    } catch (error) {
        console.log('Error while trying to compare password', error.message);
    }
}

userSchema.statics.isThisEmailInUse = async function(email){
    if(!email) throw new Error('Invalid email provided')
    try {
        const user = await this.findOne({email})
    if (user) return false

    return true
        
    } catch (error) {
        console.log('error in the method', err.message);
        return false
        
    }
    
}

module.exports = mongoose.model('User', userSchema)