const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// POST /register
// - Creates a new user.
// - Expected body: { username, email, password }
router.post('/register', auth.register, userController.registerUser);

// POST /login
// -   Generates and responds with a JWT for the user to use for future authorization.
// -   Expected body: { username, password }
// -   Response format: { token: "JWT_TOKEN_HERE" }
router.post('/login', userController.loginUser);

// GET /current
// - Responds with data about currently logged in user
router.get('/profile', auth.authorize, userController.getLoggedInUser);

router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUser);

router.put('/:userId', userController.updateUser);
router.delete(':/userId', userController.deleteUser);

module.exports = router;
