/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUsers = catchAsync(async (req, res, next) => {
  const result = await AuthServices.loginUsers(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    token: result.accessToken,
    data: result.user,
  });
});

const logoutUser = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

const getMe = catchAsync(async (req, res, next) => {
  const result = await AuthServices.getMe(req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

export const AuthControllers = {
  loginUsers,
  logoutUser,
  getMe,
};
