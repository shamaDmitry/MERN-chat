import Room from "../models/room.model.js";

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
