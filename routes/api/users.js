const express = require('express');
//link the users route
const router = express.Router();
//bringing the avatar
const gravatar = require('gravatar');
//to hash the password
const bcrypt = require('bcryptjs');
//Load in User model
const User = require('../../models/User');
//JsonWebToken
const jwt = require('jsonwebtoken');
//bringing the keys
const keys = require('../../config/keys');
//pssport for protected routes
const passport = require('passport');

//loading input validation
const validateRegisterInput = require('../../validations/register');
//Loading Login input validation
//loading input validation
const validateLoginInput = require('../../validations/login');

//@routes to Get api/Users/test
//@desxription  Tests users route
//@access      Public

router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

//@routes to Get api/Users/Register
//@desxription  Register user
//@access      Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //Size
        r: 'pg', //Rating
        d: 'mm' //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@routes to Get api/Users/login
//@desxription  Login user / Returning JWT Token
//@access      Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //Find user By email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //JWT PAYLOAD

        //Signin Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

//@routes to Get api/Users/current
//@desxription  Return current user
//@access      Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
