const knex = require('knex')(require('../knexfile'));

exports.getAllComments = async (_req, res) => {
  try {
    const comments = await knex('comments').orderBy('created_at', 'desc');

    return res.json({ length: comments.length, data: comments });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to get comments from database`,
      error: err,
    });
  }
};

exports.getEstablishmentComments = async (req, res) => {
  try {
    const establishmentComments = await knex('comments')
      .where({ establishment_id: req.params.establishmentId })
      .orderBy('created_at', 'desc');

    establishmentComments.length === 0
      ? res.sendStatus(204)
      : res.json(establishmentComments);
  } catch (err) {
    return res.status(500).json({
      message: `Unable to get comments for establishment with ID  ${req.params.establishmentId}`,
      error: err,
    });
  }
};

exports.getUserComments = async (req, res) => {
  try {
    const userComments = await knex('comments')
      .where({ user_id: req.params.userId })
      .orderBy('created_at', 'desc');

    userComments.length === 0 ? res.sendStatus(204) : res.json(userComments);
  } catch (err) {
    return res.status(500).json({
      message: `Unable to get comments for user with ID  ${req.params.userId}`,
      error: err,
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    !req.body.establishment_id &&
      res.status(400).json({ message: 'Please provide an establishment_id' });

    !req.body.user_id &&
      res.status(400).json({ message: 'Please provide a user_id' });

    !req.body.username &&
      res.status(400).json({ message: 'Please provide a username' });

    !req.body.comment &&
      res.status(400).json({ message: 'Comment body cannot be empty' });

    const { establishment_id, user_id, comment, username } = req.body;

    const [newCommentId] = await knex('comments').insert({
      establishment_id,
      user_id,
      comment,
      username,
    });

    const newComment = await knex('comments').where({ id: newCommentId });

    return res.json({ message: 'OK', added: newComment });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to add comment to database`,
      error: err,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const rowsUpdated = await knex('comments')
      .where({ id: req.params.commentId })
      .update(req.body);

    if (rowsUpdated === 0) {
      return res
        .status(400)
        .json({ message: `No comment with ID ${req.params.commentId} found` });
    }

    const updatedComment = await knex('comments')
      .where({ id: req.params.commentId })
      .first();

    return res.json({ message: 'OK', updated: updatedComment });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to update comment with ID  ${req.params.commentId}`,
      error: err,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const rowsDeleted = await knex('comments')
      .where({ id: req.params.commentId })
      .delete();

    rowsDeleted === 0
      ? res
          .status(404)
          .json({ message: `No comment with ID ${req.params.commentId} found` })
      : res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({
      message: `Unable to delete comment with ID  ${req.params.commentId}`,
      error: err,
    });
  }
};
