import Notification from '../models/Notification.js';
import Connection from '../models/Connection.js';
import {Name as User} from '../models/Name.js';

// // Helper function to populate sender details
// const populateSender = (query) => {
//   return query.populate('sender', '_id name username avatar headline');
// };

// Get notifications with pagination and filtering
export const getNotifications = async (req, res) => {
  try {
    const recipient = req.params.userId;
    const notifications = await Notification.find({ recipient })
      .populate('sender', 'name username avatar headline')
      .populate('connectionId')
      .sort({ createdAt: -1 });
    //     const page = parseInt(req.query.page) || 1;
    //     const limit = parseInt(req.query.limit) || 20;
    //     const skip = (page - 1) * limit;
    //     const { type } = req.query;

    //     // Build filter
    //     const filter = { recipient: req.user._id };
    //     if (type) {
    //       filter.type = type;
    //     }

    //     // Get total count and unread count
    //     const [totalNotifications, unreadCount, notifications] = await Promise.all([
    //       Notification.countDocuments(filter),
    //       Notification.countDocuments({ ...filter, isRead: false }),
    //       populateSender(
    //         Notification.find(filter)
    //           .sort({ createdAt: -1 })
    //           .skip(skip)
    //           .limit(limit)
    //       )
    //     ]);

    //     // Populate connection details for connection-related notifications
    //     const notificationsWithDetails = await Promise.all(
    //       notifications.map(async (notification) => {
    //         const notifObj = notification.toObject();

    //         if (notification.connectionId &&
    //             (notification.type === 'connection_request' ||
    //              notification.type === 'connection_accepted')) {
    //           const connection = await Connection.findById(notification.connectionId)
    //             .select('status');
    //           notifObj.connectionId = connection;
    //         }

    //         return notifObj;
    //       })
    //     );

    //     const pagination = {
    //       current: page,
    //       total: Math.ceil(totalNotifications / limit),
    //       totalNotifications,
    //       unreadCount
    //     };

        return res.status(200).json({
          success: true,
          notifications
    // : notificationsWithDetails,
    //       pagination
        });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// // Mark single notification as read
// export const markAsRead = async (req, res) => {
//   try {
//     const { notificationId } = req.params;

//     const notification = await Notification.findOne({
//       _id: notificationId,
//       recipient: req.user._id
//     });

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     if (!notification.isRead) {
//       notification.isRead = true;
//       await notification.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Notification marked as read'
//     });
//   } catch (error) {
//     console.error('Error marking notification as read:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark notification as read',
//       error: error.message
//     });
//   }
// };

// // Mark all notifications as read
// export const markAllAsRead = async (req, res) => {
//   try {
//     await Notification.updateMany(
//       { recipient: req.user._id, isRead: false },
//       { isRead: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'All notifications marked as read'
//     });
//   } catch (error) {
//     console.error('Error marking all as read:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark all notifications as read',
//       error: error.message
//     });
//   }
// };

// // Delete single notification
// export const deleteNotification = async (req, res) => {
//   try {
//     const { notificationId } = req.params;

//     const notification = await Notification.findOneAndDelete({
//       _id: notificationId,
//       recipient: req.user._id
//     });

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Notification deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting notification:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete notification',
//       error: error.message
//     });
//   }
// };

// // Clear all notifications for user
// export const clearAllNotifications = async (req, res) => {
//   try {
//     await Notification.deleteMany({ recipient: req.user._id });

//     res.status(200).json({
//       success: true,
//       message: 'All notifications cleared successfully'
//     });
//   } catch (error) {
//     console.error('Error clearing notifications:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to clear notifications',
//       error: error.message
//     });
//   }
// };

// // Get unread count
// export const getUnreadCount = async (req, res) => {
//   try {
//     const unreadCount = await Notification.countDocuments({
//       recipient: req.user._id,
//       isRead: false
//     });

//     res.status(200).json({
//       success: true,
//       unreadCount
//     });
//   } catch (error) {
//     console.error('Error getting unread count:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get unread count',
//       error: error.message
//     });
//   }
// };

// // Create notification (helper function used by other controllers)
// export const createNotification = async (notificationData) => {
//   try {
//     const notification = new Notification(notificationData);
//     await notification.save();

//     // Populate sender details for real-time updates
//     const populatedNotification = await populateSender(
//       Notification.findById(notification._id)
//     );

//     return populatedNotification;
//   } catch (error) {
//     console.error('Error creating notification:', error);
//     throw error;
//   }
// };

// // Bulk create notifications (for features like follow, etc.)
// export const bulkCreateNotifications = async (notificationsData) => {
//   try {
//     const notifications = await Notification.insertMany(notificationsData);

//     // Populate all notifications
//     const populatedNotifications = await Promise.all(
//       notifications.map(async (notif) => {
//         return await populateSender(Notification.findById(notif._id));
//       })
//     );

//     return populatedNotifications;
//   } catch (error) {
//     console.error('Error bulk creating notifications:', error);
//     throw error;
//   }
// };

// // Delete notifications by reference (when connection is deleted, etc.)
// export const deleteNotificationsByReference = async (referenceId, referenceType) => {
//   try {
//     let filter = {};

//     if (referenceType === 'connection') {
//       filter = { connectionId: referenceId };
//     } else if (referenceType === 'user') {
//       filter = { $or: [{ sender: referenceId }, { recipient: referenceId }] };
//     }

//     const result = await Notification.deleteMany(filter);
//     return result;
//   } catch (error) {
//     console.error('Error deleting notifications by reference:', error);
//     throw error;
//   }
// };
