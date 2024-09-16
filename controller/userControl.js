const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const path = require("path");
const fs = require("fs");

const userController = async (req, res) => {
  // page = 1;
  // limit = 5;
  // const count = await userModel.countDocuments({});
  // const users = await userModel
  // .find({})
  // .skip((page - 1) * limit)
  // .limit(limit * 1)
  // .exec();
  // search = "";
  // console.log(users);

    res.render("index", {
      // users: users,
      // totalPages: Math.ceil(count / limit),
      // currentPage: parseInt(page),
      // search: search,
      // limit: limit
    });
    // res.render("main");
  }
 



const getUsersConroller = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  try {
    const searchCriteria = {
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(search) ? search : null },
        { username: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const users = await userModel
      .find(search ? searchCriteria : {})
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .exec();

    const count = await userModel.countDocuments(search ? searchCriteria : {});

    // res.render("index", {
    //   users: users,
    //   totalPages: Math.ceil(count / limit),
    //   currentPage: parseInt(page),
    // });

    res.json({
      users: users,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
};

const getUserByIdController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.json(user);
    // console.log(user);
  } catch (err) {
    res.status(500).send("Error fetching user");
  }
};

const deleteUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imagePath = path.join(__dirname, "../uploads/", user.userProfile);

    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting the image file:", err);
          return res
            .status(300)
            .json({ message: "Error deleting the image file" });
        }
        // console.log("Image file deleted successfully");
      });
    }

    await userModel.findByIdAndDelete(req.params.id);
    res.json({
      message: "User and profile image deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
};

module.exports = {
  userController,
  getUsersConroller,
  getUserByIdController,
  deleteUserController,
};

// const addOrUpdateUserController = async (req, res) => {
//   // console.log("File received:", req.file);
//   const { userId, username, email, phone } = req.body;
//   const userProfile = req.file ? req.file.filename : null;
//   // console.log(userProfile);
//   try {
//     const existingUser = await userModel.findOne({
//       $or: [{ email }, { phone }],
//       ...(userId ? { _id: { $ne: userId } } : {}),
//     });

//     if (existingUser) {
//       return res
//         .status(409)
//         .json({ message: "Email or phone number already exists." });
//     }

//     if (userId) {
//       await userModel.findByIdAndUpdate(userId, {
//         username,
//         userProfile,
//         email,
//         phone,
//       });
//       res.json({ message: "User updated successfully" });
//     } else {
//       // const newuserModel = new userModel({
//       //   username,
//       //   userProfile,
//       //   email,
//       //   phone,
//       const nextUserId = await getNextSequence("userId");

//       const newuserModel = new userModel({
//         userId: nextUserId,
//         username,
//         userProfile,
//         email,
//         phone,
//       });
//       await newuserModel.save();
//       res.json({ message: "User added successfully" });
//     }
//   } catch (err) {
//     res.status(500).send("Error adding or updating user");
//   }
// };
