import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Booking } from "../booking/booking.model";
import { BOOKING_STATUS } from "../booking/booking.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserInfoDB = async (payload: TUser) => {
  // Check if user already exists
  const existingUser = await User.isUserExistsByEmail(payload.email);
  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email!",
    );
  }

  const result = await User.create(payload);
  return result;
};

const getUserBookings = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const bookingQuery = new QueryBuilder(
    Booking.find({ user: userId }).populate("facility"),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bookingQuery.modelQuery;
  const total = await Booking.countDocuments({ user: userId });
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const cancelUserBooking = async (bookingId: string, userId: string) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
  }

  if (booking.isBooked === BOOKING_STATUS.Canceled) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking is already cancelled!");
  }

  const result = await Booking.findByIdAndUpdate(
    bookingId,
    { isBooked: BOOKING_STATUS.Canceled },
    { new: true },
  ).populate("facility");

  return result;
};

export const UserServices = {
  createUserInfoDB,
  getUserBookings,
  cancelUserBooking,
};
