import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Facility } from "../facility/facility.model";
import { BOOKING_STATUS, BookingSearchableFields } from "./booking.constant";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const createBookingIntoDB = async (
  userId: string,
  payload: Partial<TBooking>,
) => {
  const { startTime, endTime, facility, date } = payload;

  // Check if the facility exists
  const isFacilityExists = await Facility.findById(facility);
  if (!isFacilityExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Facility doesn't exist for this booking",
    );
  }

  // Check if the time slot is available
  const isAvailable = await Booking.isTimeSlotAvailable(
    facility as string,
    date as string,
    startTime as string,
    endTime as string,
  );

  if (!isAvailable) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Time slot is not available for booking",
    );
  }

  const { pricePerHour } = isFacilityExists;

  // Calculate duration and payable amount
  const startDateTime = new Date(`1970-01-01T${startTime}:00`);
  const endDateTime = new Date(`1970-01-01T${endTime}:00`);
  const durationInHours =
    (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

  if (durationInHours <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End time must be after start time",
    );
  }

  const payableAmount = durationInHours * pricePerHour;

  const bookingData = {
    ...payload,
    user: userId,
    payableAmount,
    isBooked: BOOKING_STATUS.Confirmed,
    paymentStatus: "pending",
  };

  const result = await Booking.create(bookingData);
  const populatedResult = await Booking.findById(result._id)
    .populate("facility")
    .populate("user", "-password");

  return populatedResult;
};

const getAllBookingsByAdminFromDB = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    Booking.find().populate("facility").populate("user", "-password"),
    query,
  )
    .search(BookingSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bookingQuery.modelQuery;
  const total = await Booking.countDocuments();
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

const createAllDaySlots = (slotDuration: number = 2) => {
  const startHour = 6; // Start from 6 AM
  const endHour = 22; // End at 10 PM
  const allSlots = [];

  for (let hour = startHour; hour < endHour; hour += slotDuration) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endTime = `${(hour + slotDuration).toString().padStart(2, "0")}:00`;
    allSlots.push({ startTime, endTime });
  }

  return allSlots;
};

const checkAvailabilityIntoDB = async (date: string, facilityId?: string) => {
  const allSlots = createAllDaySlots(2);

  const query: any = {
    date: { $eq: date },
    isBooked: { $ne: BOOKING_STATUS.Canceled },
  };

  if (facilityId) {
    query.facility = facilityId;
  }

  const resultBookings = await Booking.find(query);

  const bookedSlots = resultBookings.map((booking) => ({
    startTime: booking.startTime,
    endTime: booking.endTime,
  }));

  const availableSlots = allSlots.filter((slot) => {
    return !bookedSlots.some(
      (bookedSlot) =>
        slot.startTime === bookedSlot.startTime &&
        slot.endTime === bookedSlot.endTime,
    );
  });

  return availableSlots;
};

const cancelBookingFromDB = async (id: string) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
  }

  if (booking.isBooked === BOOKING_STATUS.Canceled) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking is already cancelled!");
  }

  const result = await Booking.findByIdAndUpdate(
    id,
    { isBooked: BOOKING_STATUS.Canceled },
    { new: true },
  )
    .populate("facility")
    .populate("user", "-password");

  return result;
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsByAdminFromDB,
  checkAvailabilityIntoDB,
  cancelBookingFromDB,
};
