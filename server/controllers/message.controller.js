import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userId },
        { senderId: userId, receiverId: senderId },
      ],
    });

    // Mark messages as read when they are fetched
    await Message.updateMany(
      {
        senderId: userId,
        receiverId: senderId,
        read: false,
      },
      { read: true }
    );

    // Emit socket event to notify sender that messages are read
    const senderSocketId = getReceiverSocketId(userId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", { receiverId: senderId });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.log("error in get messages controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { userId: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);

      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      read: false,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      // Emit the new message to the receiver
      io.to(receiverSocketId).emit("receiveMessage", newMessage);

      // Get unread count for receiver and emit it
      const unreadCount = await Message.countDocuments({
        receiverId,
        read: false,
      });
      io.to(receiverSocketId).emit("unreadCountUpdate", { unreadCount });
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in send message controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get unread messages count per user
    const unreadMessages = await Message.aggregate([
      {
        $match: {
          receiverId: userId,
          read: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to a more usable format
    const unreadCounts = unreadMessages.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    return res.status(200).json({ unreadCounts });
  } catch (error) {
    console.log("error in get unread count controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
