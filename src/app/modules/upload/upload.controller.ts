import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UploadServices } from "./upload.service";
import AppError from "../../errors/AppError";

const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No image file provided");
  }

  const result = await UploadServices.uploadImageToCloudinary(
    req.file as any,
    "facilities",
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image uploaded successfully",
    data: result,
  });
});

export const UploadControllers = {
  uploadImage,
};
