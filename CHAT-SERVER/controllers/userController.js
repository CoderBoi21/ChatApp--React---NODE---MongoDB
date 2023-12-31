const User = require("../models/user");
const FriendRequest = require('../models/friendRequest');
const filterObj = require("../utils/filterObj");
const catchAsync = require("../utils/catchAsync");

exports.updateMe = async (req, res, next) => {

    const { user } = req;//can access user like this after protected middleware

    const filteredBody = filterObj(req.body,
        "firstName",
        "lastName",
        "about",
        "avatar",
    );

    const updated_user = await User.findByIdAndUpdate(user._id, filteredBody, {
        new: true,
        validateModifiedOnly: true,
    });

    res.status(200).json({
        status: "success",
        data: updated_user,
        message: "Profile Updated Successfully!",
    })

};

//Get users who are not our friends and exclude ourself
exports.getUsers = catchAsync(async (req, res, next) => {
    const all_users = await User.find({
        varified: true,
    }).select("firstName lastName _id");

    const this_user = req.user;

    const remaining_users = all_users.filter(
        (user) =>
            !this_user.friends.includes(user._id) &&
            user._id.toString() !== req.user._id.toString()
    );

    res.status(200).json({
        status: "success",
        data: remaining_users,
        message: "Users found successfully!",
    });
});

exports.getAllVerifiedUsers = catchAsync(async (req, res, next) => {
    const all_users = await User.find({
      verified: true,
    }).select("firstName lastName _id");
  
    const remaining_users = all_users.filter(
      (user) => user._id.toString() !== req.user._id.toString()
    );
  
    res.status(200).json({
      status: "success",
      data: remaining_users,
      message: "Users found successfully!",
    });
  });

exports.getRequests = catchAsync(async (req, res, next) => {
    const requests = await FriendRequest.find({ recipient: req.user._id })
        .populate("sender")
        .select("_id firstName lastName");

    res.status(200).json({
        status: "success",
        data: requests,
        message: "Requests found successfully!",
    });
});

exports.getFriends = catchAsync(async (req, res, next) => {
    const this_user = await User.findById(req.user._id).populate(
        "friends",
        "_id firstName lastName"
    );
    res.status(200).json({
        status: "success",
        data: this_user.friends,
        message: "Friends found successfully!",
    });
});