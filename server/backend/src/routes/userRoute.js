// routes/userRoutes.js
import express from 'express';
const router = express.Router();
// const {
//   getUserById,
//   updateUser,
//   deleteUser
// } = require('../controllers/userController');
import { getUserById } from '../controllers/userController.js';

// const { protect } = require('../middleware/authMiddleware');

// All routes are protected
// router.use(protect);

router.get('/:userId', getUserById);
// router.put('/:userId', updateUser);
// router.delete('/:userId', deleteUser);
export default router;
// module.exports = router;