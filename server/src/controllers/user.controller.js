import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    return res.status(200).json(users);
  } catch (error) {
    console.log("error in get users for sidebar controller", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log("error in get user", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
