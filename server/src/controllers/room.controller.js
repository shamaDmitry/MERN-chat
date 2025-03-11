import RoomMessage from "../models/roomMessage.model.js";
import Room from "../models/room.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("users", "fullName  profilePic");

    return res.status(200).json(rooms);
  } catch (error) {
    console.log("Error getting rooms:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const room = await Room.findById(roomId).populate("users", "-password");

    return res.status(200).json(room);
  } catch (error) {
    console.log("Error getting room:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const creator = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newRoom = new Room({
      name,
      users: [creator],
      creator,
    });

    await newRoom.save();

    return res.status(201).json(newRoom);
  } catch (error) {
    console.log("Error creating room:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await Room.findByIdAndUpdate(
      roomId,
      { $addToSet: { users: userId } },
      { new: true }
    );

    return res.status(200).json(room);
  } catch (error) {
    console.log("Error joining room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await Room.findByIdAndUpdate(
      roomId,
      { $pull: { users: userId } },
      { new: true }
    );

    return res.status(200).json(room);
  } catch (error) {
    console.log("Error leaving room:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendRoomMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message is required" });
    }

    let imageUrl = null;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new RoomMessage({
      room: roomId,
      sender: senderId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Emit to room members
    io.to(roomId).emit("newRoomMessage", newMessage);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error sending room message:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await RoomMessage.find({ roomId })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
