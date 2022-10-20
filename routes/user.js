const express = require('express');
const router = express.Router();
const {createUser, userSignIn} = require('../controllers/user');
const { isAuth } = require('../middlewares/auth');
const { validateUserSignUp, userValidation, validateUserSignIn } = require('../middlewares/validation/user');
const User = require('../models/user');
const multer = require('multer');

const storage = multer.memoryStorage();
const sharp = require('sharp');

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    }else{
        cb('invalid image type!', false)
    }
}

const uploads = multer({storage, fileFilter});

router.post('/create-user',validateUserSignUp, userValidation, createUser);
router.post('/sign-in', validateUserSignIn, userValidation,userSignIn);
router.post('/upload-profile', isAuth, uploads.single('profile'), async (req, res) => {
    const { user } = req;
    if(!user) return res.status(401).json({success: false, message: "Unauthorized access"});

    try {
    const profileBuffer = req.file.buffer

    const {width, height} = await sharp(profileBuffer).metadata()
    const avatar = await sharp(profileBuffer).resize(Math.round(width * .5), Math.round(height * .5)).toBuffer()

    await User.findByIdAndUpdate(user._id, {avatar})

    res.status(201).json({success: true, message: 'Profile updated successfully'})
    } catch (error) {
        res.status(500).json({success: false, message: 'Server error try again later'})
        console.log('Error while uploading',error.message);
    }
})

module.exports = router;