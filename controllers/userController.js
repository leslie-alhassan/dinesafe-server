const knex = require('knex')(require('../knexfile'));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({
        message: 'Please provide the required information in the request body',
      });
    }

    const { username, email, password, github_id, google_id, avatar_url, bio } =
      req.body;

    const [newUserId] = await knex('users').insert({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      github_id,
      google_id,
      avatar_url,
      bio,
    });

    const newUser = await knex('users').where({ id: newUserId });
    delete newUser.password;

    return res.json({ message: 'Registered successfully', added: newUser });
  } catch (err) {
    const { sqlMessage, sql } = err;
    return res.status(500).json({
      message: `Failed registration. Unable to add '${req.body.username}' to database`,
      error: { sqlMessage, sql },
    });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await knex('users')
      .select()
      .where({ username: username })
      .orWhere({ email: username })
      .first();

    if (!user) {
      return res.status(400).json('The username is incorrect');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json('The password is incorrect');
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
      process.env.JWT_SECRET,
      { expiresIn: '14d' }
    );
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: `Unable to login`, error: err });
  }
};

exports.getAllUsers = async (req, res) => {
  const searchTerm = req.query.search;
  const order = req.query.order;
  const sort = req.query.sort;

  if (searchTerm) {
    try {
      const searchResults = await knex('users')
        .select('id', 'username', 'email', 'bio')
        .whereILike('username', `%${searchTerm}%`)
        .orWhereILike('email', `%${searchTerm}%`)
        .orWhereILike('bio', `%${searchTerm}%`)
        .orderBy(`${order || 'username'}`, `${sort || 'asc'}`);

      searchResults.length === 0
        ? res.sendStatus(204)
        : res.json({ matches: searchResults.length, data: searchResults });
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Unable to get users from database', error: err });
    }
  } else {
    try {
      const data = await knex('users')
        .select('id', 'username', 'email', 'bio')
        .orderBy(`${order || 'username'}`, `${sort || 'asc'}`);

      return res.json({ length: data.length, data: data });
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Unable to get users from database', error: err });
    }
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await knex('users').where({ id: req.token.id }).first();
    delete user.password;
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Unable to get logged in user', error: err });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await knex('users')
      .select('id', 'username', 'email', 'bio')
      .where({ id: req.params.userId })
      .first();

    user
      ? res.json(user)
      : res.status(400).json({ message: `No user with ID ${userId}` });
  } catch (err) {
    res.status(500).send({
      message: `Unable to get user with ID '${req.params.userId}' from database`,
      error: err,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const rowsUpdated = await knex('users').update(req.body);

    if (rowsUpdated === 0) {
      return res
        .status(400)
        .json({ message: `User with ID ${req.params.userId} npt found` });
    }

    const updatedUser = await knex('user')
      .where({ id: req.params.userId })
      .first();

    return res.json({ message: 'OK', updated: updatedUser });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to update user with ID '${req.params.userId}'`,
      error: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const rowsDeleted = await knex('users').where({ id: req.params.id }).del();

    rowsDeleted === 0
      ? res
          .status(404)
          .json({ message: `User with ID ${req.params.userId} not found` })
      : res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      message: `Unable to delete user with ID ${req.params.userId} from database`,
      error: err,
    });
  }
};
