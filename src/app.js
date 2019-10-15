require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./errorHandler');
const entriesRouter = require('./entries/entries-router')
const commentsRouter = require('./comments/comments-router')

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/entries', entriesRouter)
app.use('/api/comments', commentsRouter)

app.get('/', ( req, res ) => {
  res.send('Hello world!');
});

app.use(errorHandler);

module.exports = app;