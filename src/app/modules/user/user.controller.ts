import { RequestHandler } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser: RequestHandler = catchAsync(async (req, res, next) => {
  const userData = { ...req.body, role: "user" };
  const result = await UserServices.createUserInfoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const createAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const adminData = { ...req.body, role: "admin" };
  const result = await UserServices.createUserInfoDB(adminData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin registered successfully",
    data: result,
  });
});

const getUserBookings = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await UserServices.getUserBookings(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User bookings retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const cancelUserBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Booking ID is required",
      data: null,
    });
  }
  const userId = req.user.id;
  const result = await UserServices.cancelUserBooking(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking cancelled successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  createAdmin,
  getUserBookings,
  cancelUserBooking,
};
