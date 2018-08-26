const express = require('express');
const router = express.Router();

//@routes to Get api/posts/test
//@desxription  Tests Posts route
//@access      Public

router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

module.exports = router;
