const knex = require("knex");
const knexConfig = require("./knexfile");
const db = process.env.NODE_ENV
  ? knex(knexConfig.production)
  : knex(knexConfig.development);

const addLocalNotesToDB = notes => {
  if (notes === undefined) {
    return;
  }

  for (const note of notes) {
    if (note.title === "Thanks for using Paper Notes!") {
      continue;
    }
    db("notes").insert({
      title: note.title,
      content: note.content,
      user_id: userId
    });
  }
};

const loginUser = (id, token, res) => {
  return db("notes")
    .where({ user_id: id })
    .then(notes => {
      return res.status(200).json({
        message: "welcome!",
        token,
        notes
      });
    })
    .catch(error => {
      return res.status(500).json({ error });
    });
};

const checkUserCredentials = ({ username, password }) => {
  if (!username && !password) {
    return { error: "Please enter a username and password." };
  }

  if (!username) {
    return { error: "Please enter a username." };
  }

  if (!password) {
    return { error: "Please enter a password." };
  }
};

const checkNoteRequirements = ({ title, content }) => {
  if (!title && !content) {
    return { error: "Please enter a title and some content in the note." };
  }

  if (!title) {
    return { error: "Please enter a title." };
  }

  if (!content) {
    return { error: "Please enter some content in the note." };
  }
};

module.exports = {
  addLocalNotesToDB,
  loginUser,
  checkUserCredentials,
  checkNoteRequirements
};
