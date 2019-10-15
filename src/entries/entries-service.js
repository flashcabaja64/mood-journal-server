const xss = require('xss');
const Treeize = require('treeize');

const EntriesService = {
  getAllEntries(db) {
    return db
      .from('mood_entries AS entry')
      .select(
        'entry.id',
        'entry.title',
        'entry.content',
        'entry.date_created',
        ...userFields,
        db.raw(
          `count(DISTINCT coms) AS num_of_comments`
        ),
        db.raw(
          `AVG(coms.rating) as avg_comment_rating`
        ),
      )
      .leftJoin(
        'mood_comments AS coms',
        'entry.id',
        'coms.entry_id',
      )
      .leftJoin(
        'mood_users AS user',
        'entry.user_id',
        'user.id'
      )
      .groupBy('entry.id', 'user.id')
  },

  getById(db, id) {
    return EntriesService.getAllEntries(db)
      .where('entry.id', id)
      .first()
  },

  getCommentsForEntries(db, entry_id) {
    return db
      .from('mood_comments AS coms')
      .select(
        'coms.id',
        'coms.text',
        'coms.rating',
        'coms.date_created',
        ...userFields,
      )
      .where('coms.entry_id', entry_id)
      .leftJoin(
        'mood_users AS user',
        'coms.user_id',
        'user.id',
      )
      .groupBy('coms.id', 'user.id')
  },

  serializeEntries(entry) {
    return entry.map(this.serializeEntry)
  },

  serializeEntry(entry) {
    const entryTree = new Treeize();

    const entryData = entryTree.grow([ entry ]).getData()[0]

    return {
      id: entryData.id,
      title: xss(entryData.title),
      content: xss(entryData.content),
      date_created: entryData.date_created,
      user: entryData.user || {},
      num_of_comments: Number(entryData.num_of_comments) || 0,
      avg_comment_rating: Math.round(entryData.avg_comment_rating) || 0
    }
  },

  serializeEntryComments(comments) {
    return comments.map(this.serializeEntryComment)
  },

  serializeEntryComment(comment) {
    const commentTree = new Treeize();

    const commentData = commentTree.grow([ comment ]).getData()[0]

    return {
      id: commentData.id,
      text: xss(commentData.text),
      rating: commentData.rating,
      date_created: commentData.date_created,
      user: commentData.user || {},
      entry_id: commentData.entry_id,
    }
  },

}

const userFields = [
  'user.id AS user:id',
  'user.user_name AS user:user_name',
  'user.full_name AS user:full_name',
  'user.nickname AS user:nickname',
  'user.date_created AS user:date_created',
  'user.date_modified AS user:date_modified',
]

module.exports = EntriesService;