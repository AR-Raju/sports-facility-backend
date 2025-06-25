import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getAdminStats = catchAsync(async (req, res, next) => {
  const result = await AdminServices.getAdminStatsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin stats retrieved successfully",
    data: result,
  });
});

const getDashboardData = catchAsync(async (req, res, next) => {
  const result = await AdminServices.getDashboardDataFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard data retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const result = await AdminServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const AdminControllers = {
  getAdminStats,
  getDashboardData,
  getAllUsers,
};
