const router = require('express').Router();

const commentController = require('../controllers/commentController');

router.get('/', commentController.getAllComments);
router.get(
  '/establishments/:establishmentId',
  commentController.getEstablishmentComments
);
router.get('/users/:userId', commentController.getUserComments);
router.post('/', commentController.addComment);
router.put('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
