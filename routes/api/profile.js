const express = require('express');
const router = express.Router();

//@routes to Get api/profile/test
//@desxription  Tests Profile route
//@access      Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

module.exports = router;
