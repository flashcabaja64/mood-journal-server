const express = require('express');
const EntriesService = require('./entries-service');
const { requireAuth } = require('../middleware/jwt-auth');

const entriesRouter = express.Router();
const bodyParser = express.json();

// get all data from DB
entriesRouter
  .route('/')
  .get((req, res, next) => {
    EntriesService.getAllEntries(req.app.get('db'))
      .then(entry => {
        res.json(EntriesService.serializeEntries(entry))
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { title, content, duration, mood_type } = req.body
    const newEntry = { title, content, duration, mood_type }
    const db = req.app.get('db')

    for (const [key, value] of Object.entries(newEntry)) {
      if(value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }
    }

    newEntry.user_id = req.user.id

  EntriesService.insertEntry(db, newEntry) 
    .then(entry => {
      res
        .status(201)
        .json(serializeEntries(entry))
    })
    .catch(next)
  })

// Check entry id
entriesRouter
  .route('/:entry_id')
  .all(requireAuth)
  .all(checkEntryExists)
  .get((req, res) => {
    res.json(EntriesService.serializeEntry(res.entry))
  })
  .delete((req, res, next) => {
    EntriesService.deleteEntry(
      req.app.get('db'),
      req.params.id
    )
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