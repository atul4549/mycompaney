// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User1',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User1',
    required: true,
  },
  type: {
    type: String,
    enum: ['connection_request', 'connection_accepted', 'message', 'follow', 'like'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connection',
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isActioned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Index for faster queries
// notificationSchema.index({ recipient: 1, createdAt: -1 });
// notificationSchema.index({ recipient: 1, isRead: 1 });


// Indexes for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Auto-delete after 30 days

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;