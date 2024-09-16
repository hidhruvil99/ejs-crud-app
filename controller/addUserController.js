const userModel = require('../model/userModel'); // Import user model

const addUserController = async (req, res) => {
    const { username, email, phone } = req.body;
    const userProfile = req.file ? req.file.filename : null;

    try {
        // Check if a user with the same email or phone exists
        const existingUser = await userModel.findOne({
            $or: [{ email }, { phone }]
        });
        if (existingUser) {
            // console.log("====================");
            return res.status(400).json({ message: "Email or phone number already exists." });
        }

        // Create a new user
        const newUser = await userModel.create({
            username,
            email,
            phone,
            userProfile
        });
        // console.log(userProfile);
        res.status(201).json({ message: "User added successfully", newUser });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {addUserController};
