const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  confirmEmailToken: String,
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  twoFactorCode: String,
  twoFactorCodeExpire: Date,
  twoFactorEnable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


//Encrypt password using bcrypt
UserSchema.pre('save', async function(next){
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
})

//Sign JWT and return 
UserSchema.methods.getSignedJWT = function () {
  return jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRESIN
  })
}


UserSchema.methods.matchPassword =async function (password) {
  return await bcrypt.compare(password,this.password)
}

UserSchema.methods.getResetToken=async function () {
//Generate the token
const resetToken =  crypto.randomBytes(20).toString('hex');

//Hash the token and set to  resetPasswordToken field
this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//Set expire
this.resetPasswordExpire=Date.now()+10*60*1000

return resetToken;
}

module.exports = mongoose.model('User', UserSchema);