const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const educationSchema = new Schema({
  college: {
    type: String,
    required: true
},
grade:{
    type: String,
    required: true
},
startDate: {
    type: Date,
    required: true
},
endDate: {
    type: Date,
    required: true
},
course: {
    type: String,
    required: true
},
branch: {
  type: String,
  required: true
}
})

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: Number,
    required: true
  },
  location: {
    type: String,
  },
  profileImage: { 
    type: String,
  },
  skills: [
    {
        type: String,
    }
  ],
  education: [
    {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Education'
    }
  ]

}, {
  timestamps: true,
});

const Education = mongoose.model('Education', educationSchema);

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  Education
}