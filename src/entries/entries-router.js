const express = require('express');
const EntriesService = require('./entries-service');
const { requireAuth } = require('../middleware/jwt-auth');

const entriesRouter = express.Router();

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