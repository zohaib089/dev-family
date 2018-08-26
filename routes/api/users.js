const express = require('express');
const router = express.Router();

//@routes to Get api/Users/test
//@desxription  Tests users route
//@access      Public

router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

module.exports = router;
