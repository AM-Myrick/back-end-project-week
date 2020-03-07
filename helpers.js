export const addLocalNotesToDB = (notes, db) => {
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

export const loginUser = (notes, db, token, res) => {
  return db("notes")
    .where({ user_id: user.id })
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

export const checkCredentials = (req, res) => {
  const { creds } = req.body;

  if (!creds.username) {
    return res.status(400).json({
      error: "Please enter a username."
    });
  }

  if (!creds.password) {
    return res.status(400).json({
      error: "Please enter a password."
    });
  }
};
