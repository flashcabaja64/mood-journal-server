const express = require('express');
const EntriesService = require('./entries-service');
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth');

const entriesRouter = express.Router();
const bodyParser = express.json();

// get all data from DB
//validation on the POST request
entriesRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    EntriesService.getEntryByUserId(req.app.get('db'), req.user.id)
      .then(entry => {
        res.status(200).json(entry)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    console.log(req.body)

    const { user_id, title, content, duration, mood_type } = req.body
    const newEntry = { user_id, title, content, duration, mood_type }
    const db = req.app.get('db')

    for (const [key, value] of Object.entries(newEntry)) {
      if(value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }
    }

  EntriesService.insertEntry(db, newEntry) 
    .then(entry => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl + `/${entry.id}`))
        .json(EntriesService.serializeEntries(entry))
    })
    .catch(next)
  })

// Check entry id
entriesRouter
  .route('/:entry_id')
  .all(requireAuth)
  .all(checkEntryExists)
  .get((req, res, next) => {
    res.json(EntriesService.serializeEntry(res.entry))
  })
  .delete((req, res, next) => {
    const { entry_id } = req.params
    EntriesService.deleteEntry(
      req.app.get('db'),
      entry_id
    )
    .then(() => res.status(204).end())
    .catch(next)
  })
  .patch(bodyParser, (req, res, next) => {
    const {entry_id} = req.params;
    const { user_id, title, content, duration, mood_type } = req.body;
    const newEntryField = { user_id, title, content, duration, mood_type };
    const db = req.app.get('db');

    const numOfVals = Object.values(newEntryField).filter(Boolean).length;
    if (numOfVals === 0) {
      return res
        .status(400)
        .json({error: {
          message: `Request body must contain 'title', 'content', 'duration', or 'mood_type"`
        }})
    }
    EntriesService.updateEntry(db, entry_id, newEntryField)
      .then(() => res.status(204).end())
      .catch(next)
  })

entriesRouter
  .route('/:entry_id/comments/')
  .all(requireAuth)
  .all(checkEntryExists)
  .get((req, res, next) => {
    EntriesService.getCommentsForEntries(
      req.app.get('db'),
      req.params.entry_id
    )
      .then(entry => {
        res.json(EntriesService.serializeEntryComments(entry))
      })
      .catch(next)
  })

//
async function checkEntryExists(req, res, next) {
  try {
    const entry = await EntriesService.getById(
      req.app.get('db'),
      req.params.entry_id
    )

    if (!entry) {
      return res.status(404).json({
        error: `Entry doesn't exist`
      })
    }

    res.entry = entry
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = entriesRouter;