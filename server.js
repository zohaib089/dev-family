const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//to make route private
const passport = require('passport');
//User Routes
const users = require('./routes/api/users');
//Profile Routes
const profile = require('./routes/api/profile');
//Posts routes
const posts = require('./routes/api/posts');

//DB Config
const db = require('./config/keys').mongoURI;
const app = express();
//Body Parser middleWare
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDb Connected'))
  .catch(err => console.log(err));

//Pssport middleware
app.use(passport.initialize());

//passport Config
require('./config/passport')(passport);

//making app to use exact routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port} `));
