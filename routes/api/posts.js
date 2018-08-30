const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//bringing in the  post model
const Post = require('../../models/Post');
//bringing in the  profile model
const Profile = require('../../models/Profile');

//Validate the post
const ValidatePostInput = require('../../validations/post');
//@routes to Get api/posts/test
//@desxription  Tests Posts route
//@access      Public

router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

//@routes to Get api/posts
//@desxription  Get Post
//@access      Public

router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found ' }));
});

//@routes to Get api/posts/:id
//@desxription  Get Post by id
//@access      Public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)

    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

//@routes to POST api/posts
//@desxription  Create Post
//@access      Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = ValidatePostInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

//@routes to Delete api/posts/:id
//@desxription  Delete post
//@access      Private

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check the post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ noauthorized: 'User not authorized' });
          }
          //Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ nopostfound: 'No post found' }));
    });
  }
);

//@routes to Post api/posts/like/:id
//@desxription  like post
//@access      Private

router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: 'User already liked this post' });
          }
          //Add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ nopostfound: 'No post found' }));
    });
  }
);

//@routes to Post api/posts/unlike/:id
//@desxription  unlike post
//@access      Private

router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: 'you have not yet liked this post' });
          }
          //Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //Splice out of array
          post.likes.splice(removeIndex, 1);
          //save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ nopostfound: 'No post found' }));
    });
  }
);

//@routes to Post api/posts/comment/:id
//@desxription  Add comment to post
//@access      Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = ValidatePostInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        //Add to comments array
        post.comments.unshift(newComment);
        //Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

//@routes to delete api/posts/comment/:id/:comment_id
//@desxription  remove comment from post
//@access      Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Common does not exist' });
        }
        //Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        //Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

module.exports = router;
