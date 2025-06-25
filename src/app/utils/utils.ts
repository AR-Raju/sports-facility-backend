import { Response } from "express";
import { TResponse } from "./sendResponse";

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const checkDataAndRespond = (
  res: Response,
  data: any[],
  message: string = "No Data Found"
) => {
  if (!data || data.length === 0) {
    const response: TResponse<[]> = {
      success: false,
      statusCode: 404,
      message,
      data: [],
    };
    return res.status(404).json(response);
  }
  return null;
};
