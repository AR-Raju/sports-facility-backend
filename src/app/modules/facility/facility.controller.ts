import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { checkDataAndRespond } from "../../utils/utils";
import { FacilityServices } from "./facility.service";

const createFacility = catchAsync(async (req, res, next) => {
  const result = await FacilityServices.createFacilityIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Facility added successfully",
    data: result,
  });
});

const getAllFacilties = catchAsync(async (req, res, next) => {
  const result = await FacilityServices.getAllFacilityFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Facilities retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getFacilityById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await FacilityServices.getFacilityByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Facility retrieved successfully",
    data: result,
  });
});

const updateFacility = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await FacilityServices.updateFacilityIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Facility updated successfully",
    data: result,
  });
});

const deleteFacility = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await FacilityServices.deleteFacilityFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Facility deleted successfully",
    data: result,
  });
});

// Admin specific controllers
const getAdminFacilities = catchAsync(async (req, res, next) => {
  const result = await FacilityServices.getAdminFacilitiesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin facilities retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const FacilityControllers = {
  createFacility,
  updateFacility,
  deleteFacility,
  getAllFacilties,
  getFacilityById,
  getAdminFacilities,
};
