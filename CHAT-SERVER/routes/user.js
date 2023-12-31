const router = require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");


//POST creates a new resource at a server defined URI, while PATCH updates a part of an existing resource at a client defined URI.
router.patch("/update-me", authController.protect, userController.updateMe);

router.get("/get-users", authController.protect, userController.getUsers);
router.get("/get-friends", authController.protect, userController.getFriends);
router.get("/get-requests", authController.protect, userController.getRequests);

module.exports = router;