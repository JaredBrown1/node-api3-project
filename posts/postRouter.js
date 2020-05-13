const express = require("express");

const Posts = require("./postDb.js");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.get()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch(() => {
      res.status(500).json({
        message: "failed to get users",
      });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  Posts.remove(req.post.id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch(() => {
      res.status(500).json({
        message: "couldnt delete post",
      });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  Posts.update(req.post.id, req.body)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch(() => {
      res.status(500).json({
        message: "couldnt update post",
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then((post) => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(400).json({
          message: "invalid post id",
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "error retrieving the post id",
      });
    });
}

module.exports = router;
