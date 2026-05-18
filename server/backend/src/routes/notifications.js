// // routes/notifications.js
// import express from 'express';
// import Notification from '../models/Notification.js';
// import Connection from '../models/Connection.js';
// import {Name as User} from '../models/Name.js';
// import {protect as authMiddleware} from '../middleware/auth.js';

// const router = express.Router();

// // Get all notifications for logged-in user
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { page = 1, limit = 20, type, isRead } = req.query;

//     const query = { recipient: userId };

//     // Filter by type if provided
//     if (type) {
//       query.type = type;
//     }

//     // Filter by read status if provided
//     if (isRead !== undefined) {
//       query.isRead = isRead === 'true';
//     }

//     const notifications = await Notification.find(query)
//       .populate('sender', 'name username avatar headline')
//       .populate('connectionId')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await Notification.countDocuments(query);
//     const unreadCount = await Notification.countDocuments({
//       recipient: userId,
//       isRead: false,
//     });

//     res.json({
//       notifications,
//       pagination: {
//         current: parseInt(page),
//         total: Math.ceil(total / limit),
//         totalNotifications: total,
//         unreadCount,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Mark notification as read
// router.put('/:notificationId/read', authMiddleware, async (req, res) => {
//   try {
//     const notification = await Notification.findOneAndUpdate(
//       {
//         _id: req.params.notificationId,
//         recipient: req.user.id,
//       },
//       { isRead: true },
//       { new: true }
//     );

//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     res.json({ notification });
//   } catch (error) {
//     console.error('Error marking notification as read:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Mark all notifications as read
// router.put('/read-all', authMiddleware, async (req, res) => {
//   try {
//     await Notification.updateMany(
//       { recipient: req.user.id, isRead: false },
//       { isRead: true }
//     );

//     res.json({ message: 'All notifications marked as read' });
//   } catch (error) {
//     console.error('Error marking all notifications as read:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete notification
// router.delete('/:notificationId', authMiddleware, async (req, res) => {
//   try {
//     const notification = await Notification.findOneAndDelete({
//       _id: req.params.notificationId,
//       recipient: req.user.id,
//     });

//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     res.json({ message: 'Notification deleted' });
//   } catch (error) {
//     console.error('Error deleting notification:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Clear all notifications
// router.delete('/clear-all', authMiddleware, async (req, res) => {
//   try {
//     await Notification.deleteMany({ recipient: req.user.id });

//     res.json({ message: 'All notifications cleared' });
//   } catch (error) {
//     console.error('Error clearing notifications:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Create notification (helper function used in connection routes)
export const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  connectionId = null,
}) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      type,
      message,
      connectionId,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// export default router;

import express from 'express';
import {
  getNotifications,
  // markAsRead,
  // markAllAsRead,
  // deleteNotification,
  // clearAllNotifications,
  // getUnreadCount
} from '../controllers/notificationController.js';
// import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
// router.use(authenticateUser);

// Get notifications with pagination
// router.get('/', getNotifications);
router.get('/:userId', getNotifications);

// Get unread count
// router.get('/unread-count', getUnreadCount);

// Mark all as read
// router.put('/read-all', markAllAsRead);

// Clear all notifications
// router.delete('/clear-all', clearAllNotifications);

// Single notification operations
// router.put('/:notificationId/read', markAsRead);
// router.delete('/:notificationId', deleteNotification);

export default router;