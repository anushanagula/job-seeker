const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true })); 



const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true}
).then(()=>console.log('connected'))
.catch(e=>console.log(e));;
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');

//app.use('/exercises', exercisesRouter);
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/user', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});