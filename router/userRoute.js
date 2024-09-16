const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");


const {
  userController,
  getUsersConroller,
  getUserByIdController,
  addOrUpdateUserController,
  deleteUserController
} = require("../controller/userControl");

const { addUserController } = require("../controller/addUserController");
const {updateUserController} = require("../controller/updateUserController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null,Date.now() +path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.use(express.static(path.join(__dirname, 'public')));
router.use('/uploads', express.static('uploads')); 

router.get("/", userController);

router.get("/getUsers", getUsersConroller);

router.get("/getUser/:id", getUserByIdController);

// router.post("/addOrUpdateUser",upload.single('userProfile'), addOrUpdateUserController);
router.post("/addUser",upload.single('userProfile'), addUserController);
router.put("/updateUser",upload.single('userProfile'), updateUserController);

router.delete("/deleteUser/:id",deleteUserController);

module.exports = router;
