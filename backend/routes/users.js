const express = require('express');
const router = require('express').Router();
const {User, Education} = require('../models/userModel');
const {validateUser, validateEducation} = require('../middleware/validation');
const app = express();
const multer = require('multer');; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});
const filefilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, filefilter: filefilter });



router.route('/').get(async (req, res) => {
  const id = req.query.id;
  const email = req.query.email;
  console.log(req.query);
  let user;
  try {
    if(id) user = await User.findById(id).populate('education');
    if(email) user = await User.findOne({email: email}).populate('education');
    if(!user) {
      return (res.status(400).json('Error: user not found'));
    }
    res.status(200).json(user);
  }
  catch(e) {
    res.status(400).json('Error: ' + e)
  }

});

router.route('/createUser').post((req, res) => {
  console.log(req);
  var data = req.body;
  const {error} = validateUser(data);
  if(error) {
    return res.status(400).json('Invalid data' + error);
  }
  const newUser = new User(data);

  newUser.save()
    .then((user) => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/updateProfile/:id').post(async (req, res) => {
  upload.any()(req, res,async function (error) {
    if (error) {
      console.log(`upload.single error: ${error}`);
      return res.sendStatus(500);
    }
  const data = req.body;
  const id = req.params.id;
  try {
    const user = await User.findById(id)
    if(!user) {
      return (res.status(400).json('Error: user not found'));
    }
    console.log(user);
    //if(req.file != null)
    console.log(data);
    console.log(data.firstName);
    //user.firstName = data.firstName;
    //user.lastName = data.lastName;
    //user.location = data.location;
    console.log(req.files);
    if(req.files[0]) data.profileImage =  'http://localhost:5000/uploads/' + req.files[0].filename,
    User.findByIdAndUpdate(id, data, {returnDocument: "after"})
    .then((json) => res.json(json))
    .catch(err => res.status(400).json('Error: ' + err));
  } catch (error) {
    res.status(400).json('Error: ' + error)
  }
})
});

router.route('/:id/addEducation').post(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if(!user) {
      return (res.status(400).json('Error: user not found'));
    }
    const newEdu = Education(req.body.education);
    newEdu.save()
    .then((edu) => { 
      user.education.push(edu);
      res.json(edu);
      user.save();
    })
    .catch(err => res.status(400).json('Error: ' + err));
  } catch (error) {
    res.status(400).json('Error: ' + error)
  }
});

router.route('/:id/editEducation/:eduId').post(async (req, res) => {
  const data = req.body.education;
  const id = req.params.id;
  const eduId = req.params.eduId;
  try {
    const user = await User.findById(id);
    if(!user) {
      return (res.status(400).json('Error: user not found'));
    }
    Education.findByIdAndUpdate(eduId, data, {returnDocument: "after"})
    .then((edu) => {
      res.json(edu);
    })
    .catch(err => res.status(400).json('Error: ' + err));
  } catch (error) {
    res.status(400).json('Error: ' + error)
  }
});

router.route('/:id/deleteEducation/:eduId').delete(async (req, res) => {
  const id = req.params.id;
  const eduId = req.params.eduId;
  try {
    const user = await User.findById(id);
    if(!user) {
      return (res.status(400).json('Error: user not found'));
    }
    let result = await User.updateOne(
      { _id: id},
      {
        $pull: { "education": { _id: eduId } }
      }
    );
    Education.deleteOne({_id:eduId})
    .then((edu) => {
      res.json("Updated successfully")
    })
    .catch(err => res.status(400).json('Error: ' + err));
  } catch (error) {
    res.status(400).json('Error: ' + error)
  }
});

router.route('/:id/updateSkills').post(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  try {
    const user = await User.findById(id)
    if(!user) {
      return (res.status(400).json('Error: user not found'));
    }
    user.skills = [...req.body.skills];
    user.save();
    res.status(200).json('Updated Skills');
  } catch (error) {
    res.status(400).json('Error: ' + err)
  }
});

module.exports = router;