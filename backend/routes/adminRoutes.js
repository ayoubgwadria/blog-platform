const express = require('express');
const checkRole = require('../middleware/checkRole');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();
const userController =  require ('../controllers/userController')

router.use(authMiddleware(), checkRole(['admin']));

router.get('/users', userController.getAllUsers);
router.patch('/users/:id/role', userController.updateUserRole);

module.exports = router;