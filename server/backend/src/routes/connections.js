// routes/connections.js
import express from "express";
import Connection from "../models/Connection.js";
import { Name as User } from "../models/Name.js";
import { createNotification } from "./notifications.js";
// import {protect as authMiddleware} from '../middleware/auth.js';

const router = express.Router();

// // Send connection request
// router.post('/connect/:userId',
//   // authMiddleware,
//   async (req, res) => {
//   try {
//     // console.log('body',req.body)
//     console.log("user",req.user)
//     // console.log("params",req.params)
//     const requesterId = req.user.id;
//     const recipientId = req.params.userId;

//     // Check if trying to connect with self
//     if (requesterId === recipientId) {
//       return res.status(400).json({
//         message: 'You cannot connect with yourself'
//       });
//     }

//     // Check if recipient exists
//     const recipient = await User.findById(recipientId);
//     if (!recipient) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if connection already exists
//     const existingConnection = await Connection.findOne({
//       $or: [
//         { requester: requesterId, recipient: recipientId },
//         { requester: recipientId, recipient: requesterId },
//       ],
//     });

//     if (existingConnection) {
//       const status = existingConnection.status;
//       if (status === 'pending') {
//         return res.status(400).json({
//           message: 'Connection request already pending'
//         });
//       } else if (status === 'accepted') {
//         return res.status(400).json({
//           message: 'Already connected'
//         });
//       }
//     }

//     // Create new connection request
//     const connection = new Connection({
//       requester: requesterId,
//       recipient: recipientId,
//     });

//     await connection.save();

//     // Create notification for recipient
//     const requester = await User.findById(requesterId).select('name username');
//     await createNotification({
//       recipient: recipientId,
//       sender: requesterId,
//       type: 'connection_request',
//       message: `${requester.name} (@${requester.username}) sent you a connection request`,
//       connectionId: connection._id,
//     });

//     // Populate user details
//     await connection.populate([
//       { path: 'requester', select: 'name username avatar' },
//       { path: 'recipient', select: 'name username avatar' },
//     ]);

//     res.status(201).json({
//       message: 'Connection request sent',
//       connection,
//     });
//   } catch (error) {
//     console.error('Error sending connection request:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Accept connection request
// router.put('/accept/:connectionId', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const connectionId = req.params.connectionId;

//     const connection = await Connection.findById(connectionId);

//     if (!connection) {
//       return res.status(404).json({ message: 'Connection request not found' });
//     }

//     // Check if user is the recipient
//     if (connection.recipient.toString() !== userId) {
//       return res.status(403).json({
//         message: 'You are not authorized to accept this request'
//       });
//     }

//     // Check if request is pending
//     if (connection.status !== 'pending') {
//       return res.status(400).json({
//         message: 'This request has already been processed'
//       });
//     }

//     connection.status = 'accepted';
//     await connection.save();

//     // Update notification if exists
//     await Notification.findOneAndUpdate(
//       {
//         connectionId: connection._id,
//         recipient: userId,
//         type: 'connection_request',
//       },
//       {
//         isActioned: true,
//         isRead: true,
//       }
//     );

//     // Notify the requester that their request was accepted
//     const recipient = await User.findById(userId).select('name username');
//     await createNotification({
//       recipient: connection.requester,
//       sender: userId,
//       type: 'connection_accepted',
//       message: `${recipient.name} (@${recipient.username}) accepted your connection request`,
//       connectionId: connection._id,
//     });

//     // Add users to each other's connections array
//     await User.findByIdAndUpdate(connection.requester, {
//       $addToSet: { connections: connection.recipient },
//     });

//     await User.findByIdAndUpdate(connection.recipient, {
//       $addToSet: { connections: connection.requester },
//     });

//     await connection.populate([
//       { path: 'requester', select: 'name username avatar' },
//       { path: 'recipient', select: 'name username avatar' },
//     ]);

//     res.json({
//       message: 'Connection request accepted',
//       connection,
//     });
//   } catch (error) {
//     console.error('Error accepting connection:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Reject connection request
// router.put('/reject/:connectionId', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const connectionId = req.params.connectionId;

//     const connection = await Connection.findById(connectionId);

//     if (!connection) {
//       return res.status(404).json({ message: 'Connection request not found' });
//     }

//     if (connection.recipient.toString() !== userId) {
//       return res.status(403).json({
//         message: 'You are not authorized to reject this request'
//       });
//     }

//     connection.status = 'rejected';
//     await connection.save();

//     res.json({
//       message: 'Connection request rejected',
//       connection,
//     });
//   } catch (error) {
//     console.error('Error rejecting connection:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get connection status between two users
// router.get('/status/:userId', authMiddleware, async (req, res) => {
//   try {
//     const currentUserId = req.user.id;
//     const targetUserId = req.params.userId;

//     const connection = await Connection.findOne({
//       $or: [
//         { requester: currentUserId, recipient: targetUserId },
//         { requester: targetUserId, recipient: currentUserId },
//       ],
//     }).populate([
//       { path: 'requester', select: 'name username avatar' },
//       { path: 'recipient', select: 'name username avatar' },
//     ]);

//     res.json({ connection });
//   } catch (error) {
//     console.error('Error getting connection status:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get user's connections
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { status } = req.query;

//     const query = {
//       $or: [
//         { requester: userId },
//         { recipient: userId },
//       ],
//     };

//     if (status) {
//       query.status = status;
//     }

//     const connections = await Connection.find(query)
//       .populate('requester', 'name username avatar')
//       .populate('recipient', 'name username avatar')
//       .sort({ createdAt: -1 });

//     res.json({ connections });
//   } catch (error) {
//     console.error('Error getting connections:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// routes/connections.js
router.post(
  "/connect",
  //  authMiddleware,
  async (req, res) => {
    try {
      const { recipientId, senderId } = req.body;
      const requesterId = senderId;
      // Verify sender is the authenticated user
      // if (req.user.id !== senderId) {
      //   return res.status(403).json({ message: 'Unauthorized' });
      // }

      // Check if trying to connect with self
      if (senderId === recipientId) {
        return res
          .status(400)
          .json({ message: "Cannot connect with yourself" });
      }

      // Check if recipient exists
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if connection already exists
      const existingConnection = await Connection.findOne({
        $or: [
          { requester: requesterId, recipient: recipientId },
          { requester: recipientId, recipient: requesterId },
        ],
      });

      if (existingConnection) {
        const status = existingConnection.status;
        if (status === "pending") {
          return res.status(400).json({
            message: "Connection request already pending",
          });
        } else if (status === "accepted") {
          return res.status(400).json({
            message: "Already connected",
          });
        }
      }

      // Rest of your logic...
      const connection = new Connection({
        requester: senderId,
        recipient: recipientId,
      });

      await connection.save();

      // Create notification for recipient
      const requester =
        await User.findById(requesterId).select("name username");
      await createNotification({
        recipient: recipientId,
        sender: requesterId,
        type: "connection_request",
        message: `${requester.name} (@${requester.username}) sent you a connection request`,
        connectionId: connection._id,
      });

      // Populate user details
      await connection.populate([
        { path: "requester", select: "name username avatar" },
        { path: "recipient", select: "name username avatar" },
      ]);

      res.status(201).json({
        message: "Connection request sent",
        connection,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// router.post('/connect/:userId', authMiddleware, async (req, res) => {
//   try {
//     const recipientId = req.params.userId;
//     const { senderId } = req.body;

//     // Verify sender
//     if (req.user.id !== senderId) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     // ... rest of logic
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
export default router;
