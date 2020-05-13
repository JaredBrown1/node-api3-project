const express = require("express");
const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(() => {
      res.status(500).json({
        message: "couldnt post user",
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  Posts.insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch(() => {
      res.status(500).json({
        message: "couldnt post a post",
      });
    });
});

router.get("/", (req, res) => {
  Users.get()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({
        message: "couldnt get users",
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.user.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({
        message: "couldnt get user posts",
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.user.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({
        message: "couldnt delete user",
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  Users.update(req.user.id, req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({
        message: "couldnt update user",
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          message: "invalid user id",
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "error retrieving the user id",
      });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing user data",
    });
  } else if (!req.body.name) {
    res.status(400).json({
      message: "missing required name field",
    });
  }
  next();
}

function validatePost(req, res, next) {
  response = {
    text: req.body.text,
    user_id: req.params.id,
  };
  if (!req.body) {
    res.status(400).json({
      message: "missing post data",
    });
  } else if (!req.body.text) {
    res.status(400).json({
      message: "missing required text field",
    });
  } else {
    req.body = response;
    next();
  }
}

module.exports = router;
