const xss = require('xss');

const CommentsService = {
  getById(db, id) {
    return db
      .from('mood_comments AS coms')
      .select(
        'coms.id',
        'coms.text',
        'coms.date_created',
        'coms.mood_entries',
        db.raw(
          `row_to_json(
            (SELECT temp FROM (
              SELECT
                user.id,
                user.user_name,
                user.full_name,
                user.nickname,
                user.date_created,
                user.date_modified
            ) temp)
          ) AS "user"`
        )
      )
      .leftJoin(
        'mood_users AS user',
        'coms.entry_id',
        'user.id'
      )
      .where('coms.id', id)
      .first()
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('mood_comments')
      .returning('*')
      .then(([comment]) => comment)
      .then(comment =>
        CommentsService.getById(db, comment.id)
        )
  },

  serializeComment(comment) {
    return {
      id: comment.id,
      text: xss(comment.text),
      date_created: comment.date_created,
      user: comment.user || {},
    }
  }
}

module.exports = CommentsService;