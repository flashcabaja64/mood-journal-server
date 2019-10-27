const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "testing",
      full_name: "testing name",
      password: "password",
      nickname: "nickname",
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: "testing1",
      full_name: "testing name1",
      password: "password1",
      nickname: "nickname1",
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: "testing2",
      full_name: "testing name2",
      password: "password2",
      nickname: "nickname2",
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('mood_users').insert(preppedUsers)
    .then(() => 
      db.raw(
        `SELECT setval('mood_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function makeEntriesArray(users) {
  return [
    {
      id: 1,
      title: 'title #1',
      content: 'content #1',
      duration: 1,
      mood_type: 'Balanced',
      date_created: '2029-01-22T16:28:32.615Z',
      user_id: users[0].id
    },
    {
      id: 2,
      title: 'title #2',
      content: 'content #2',
      duration: 2,
      mood_type: 'Balanced',
      date_created: '2029-01-22T16:28:32.615Z',
      user_id: users[1].id
    },
    {
      id: 3,
      title: 'title #3',
      content: 'content #3',
      duration: 3,
      mood_type: 'Balanced',
      date_created: '2029-01-22T16:28:32.615Z',
      user_id: users[2].id
    },
  ]
}

function makeCommentsArray(users, entries) {
  return [
    {
      id: 1,
      text: 'sample text',
      date_created: '2029-01-22T16:28:32.615Z',
      entry_id: entries[0].id,
      user_id: users[0].id,
    },
    {
      id: 2,
      text: 'sample text1',
      date_created: '2029-01-22T16:28:32.615Z',
      entry_id: entries[1].id,
      user_id: users[1].id,
    },
    {
      id: 3,
      text: 'sample text2',
      date_created: '2029-01-22T16:28:32.615Z',
      entry_id: entries[2].id,
      user_id: users[2].id,
    }
  ]
}

function makeExpectedEntry(users, entry) {
  const user = users
    .find(user => user.id === entry.user_id)
  
  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    duration: entry.duration,
    mood_type: entry.mood_type,
    date_created: entry.date_created,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
      date_created: user.date_created,
    },
  }  
}

function makeExpectedEntryComments(users, entryId, comments) {
  const expectedComments = comments
    .filter(comms => comms.entry_id === entryId)

  return expectedComments.map(coms => {
    const commentsUser = users.find(user => user.id === coms.user_id)
    return {
      id: coms.id,
      text: coms.text,
      date_created: coms.date_created,
      user: {
        id: commentsUser.id,
        user_name: commentsUser.user_name,
        full_name: commentsUser.full_name,
        nickname: commentsUser.nickname,
        date_created: commentsUser.date_created,
      }
    }
  })
}

function makeMaliciousEntry(user) {
  const maliciousEntry = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    duration: 1,
    mood_type: 'Balanced',
    date_created: new Date().toISOString(),
    user_id: user.id,
  }
  const expectedEntry = {
    ...makeExpectedEntry([user], maliciousEntry),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousEntry,
    expectedEntry,
  }
}

function makeEntriesFixtures() {
  const testUsers = makeUsersArray()
  const testEntries = makeEntriesArray(testUsers)
  const testComments = makeCommentsArray(testUsers, testEntries)
  return { testUsers, testEntries, testComments }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      mood_comments,
      mood_entries,
      mood_users
      RESTART IDENTITY CASCADE`
  )
}

function seedEntriesTables(db, users, entries, comments=[]) {
  return db
    .transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('mood_entries').insert(entries)
      await trx.raw(
        `SELECT setval('mood_entries_id_seq', ?)`,
        [entries[entries.length - 1].id],
      )
      if (comments.length) {
        await trx.into('mood_comments').insert(comments);
        await trx.raw(`SELECT setval('mood_comments_id_seq', ?)`,
          [comments[comments.length - 1].id]
        )
      }
    })
}

function seedMaliciousEntry(db, user, entry) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('mood_entries')
        .insert([entry])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeEntriesArray,
  makeCommentsArray,
  makeExpectedEntry,
  makeExpectedEntryComments,
  makeMaliciousEntry,
  makeEntriesFixtures,
  makeAuthHeader,

  seedUsers,
  cleanTables,
  seedEntriesTables,
  seedMaliciousEntry,
  seedUsers,
}