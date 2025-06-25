import { v2 as cloudinary } from "cloudinary";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import type { TImageUpload, TUploadResponse } from "./upload.interface";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const uploadImageToCloudinary = async (
  file: TImageUpload,
  folder = "sports-booking",
): Promise<TUploadResponse> => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            transformation: [
              { width: 800, height: 600, crop: "limit" },
              { quality: "auto" },
              { format: "webp" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(
                new AppError(httpStatus.BAD_REQUEST, "Image upload failed"),
              );
            } else if (result) {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                secure_url: result.secure_url,
              });
            }
          },
        )
        .end(file.buffer);
    });
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image upload failed");
  }
};

const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image deletion failed");
  }
};

export const UploadServices = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
