const express = require('express');
const path = require('path');
const CommentsService = require('./comments-service');
const { requireAuth } = require('../middleware/jwt-auth')

const commentsRouter = express.Router();
const bodyParser = express.json();

commentsRouter
  .route('/')
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { rating, entry_id, text } = req.body;
    const newComment = { rating, entry_id, text, entry_id: req.user.id};

    for (const [key, value] of Object.entries(newComment)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }
    }

    newReview.user_id = req.user_id

    CommentsService.insertComment(
      req.app.get('db'),
      newComment
    )
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(CommentsService.serializeComment(comment))
      })
      .catch(next)
  })

  module.exports = commentsRouter