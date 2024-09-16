const userModel = require('../model/userModel'); // Import user model

const updateUserController = async (req, res) => {
    const { userId, username, email, phone } = req.body;
    const userProfile = req.file ? req.file.filename : null;

    try {
        // Find the user by ID and update their details
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the updated email or phone number already exists in another user
        const existingUser = await userModel.findOne({
            $or: [{ email }, { phone }],
            _id: { $ne: userId }
        });

        if (existingUser) {
            return res.status(409).json({ message: "Email or phone number already exists." });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        if (userProfile) {
            user.userProfile = userProfile;
        }
        // console.log(userProfile);
        await user.save();

        res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {updateUserController};
