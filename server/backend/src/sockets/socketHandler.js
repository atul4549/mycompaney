import User from "../models/User.js";

const userSockets = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("user_online", async (userId) => {
      try {
        userSockets.set(userId, socket.id);

        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: new Date(),
        });

        socket.join(userId);

        io.emit("user_status_change", {
          userId,
          isOnline: true,
        });

        console.log(`User ${userId} is online`);
      } catch (error) {
        console.error("Error setting user online:", error);
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const { receiverId, message, sender } = data;
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", {
            ...message,
            sender,
          });
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("typing_start", ({ receiverId, senderName }) => {
      const receiverSocketId = userSockets.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", {
          userId: socket.id,
          name: senderName,
          isTyping: true,
        });
      }
    });

    socket.on("typing_stop", ({ receiverId }) => {
      const receiverSocketId = userSockets.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", {
          userId: socket.id,
          isTyping: false,
        });
      }
    });

    socket.on("mark_as_read", async ({ messageId, senderId }) => {
      const senderSocketId = userSockets.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("message_read", { messageId });
      }
    });

    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);
      let disconnectedUserId = null;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        await User.findByIdAndUpdate(disconnectedUserId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        io.emit("user_status_change", {
          userId: disconnectedUserId,
          isOnline: false,
          lastSeen: new Date(),
        });

        console.log(`User ${disconnectedUserId} is offline`);
      }
    });
  });
};

export default socketHandler;
