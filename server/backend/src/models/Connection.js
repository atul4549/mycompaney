// models/Connection.js
import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate connections
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Update timestamp on save
connectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Connection = mongoose.model('Connection', connectionSchema);
export default Connection;