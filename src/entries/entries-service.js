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
        'entry.duration',
        'entry.mood_type',
        'entry.date_created',
        ...userFields,
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

  getEntryByUserId(db, userId) {
    return db
      .select('*')
      .from('mood_entries')
      .where('user_id', userId)
  },

  getCommentsForEntries(db, entry_id) {
    return db
      .from('mood_comments AS coms')
      .select(
        'coms.id',
        'coms.text',
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

  deleteEntry(db, id) {
    return db
      .from('mood_entries')
      .where({ id })
      .delete()
  },

  insertEntry(db, newEntry) {
    return db
      .insert(newEntry)
      .into('mood_entries')
      .returning('*')
      .then(row => row[0])
  },

  updateEntry(db, id, newEntryField) {
    return db
      .from('mood_entries')
      .where({ id })
      .update(newEntryField)
  },

  serializeEntries(entry) {
    return entry
  },

  serializeEntry(entry) {
    const entryTree = new Treeize();

    const entryData = entryTree.grow([ entry ]).getData()[0]

    return {
      id: entryData.id,
      title: xss(entryData.title),
      content: xss(entryData.content),
      duration: Number(entryData.duration),
      mood_type: xss(entryData.mood_type),
      date_created: entryData.date_created,
      user: entryData.user || {},
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
      date_created: commentData.date_created,
      entry_id: commentData.entry_id,
      user: commentData.user || {},
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