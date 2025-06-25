import { Schema, model } from "mongoose";
import { booking_status_array } from "./booking.constant";
import { BookingModel, TBooking } from "./booking.interface";

const BookingSchema = new Schema<TBooking, BookingModel>({
  date: { 
    type: String, 
    required: [true, "Date is required"],
    match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"]
  },
  startTime: { 
    type: String, 
    required: [true, "Start time is required"],
    match: [/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"]
  },
  endTime: { 
    type: String, 
    required: [true, "End time is required"],
    match: [/^\d{2}:\d{2}$/, "End time must be in HH:MM format"]
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, "User is required"]
  },
  facility: { 
    type: Schema.Types.ObjectId, 
    ref: "Facility", 
    required: [true, "Facility is required"]
  },
  payableAmount: { 
    type: Number, 
    required: [true, "Payable amount is required"],
    min: [0, "Payable amount cannot be negative"]
  },
  isBooked: {
    type: String,
    enum: booking_status_array,
    required: [true, "Booking status is required"],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Check if booking exists
BookingSchema.statics.isBookingExists = async function (id: string) {
  return await this.findById(id);
};

// Check if time slot is available
BookingSchema.statics.isTimeSlotAvailable = async function (
  facilityId: string,
  date: string,
  startTime: string,
  endTime: string
) {
  const conflictingBooking = await this.findOne({
    facility: facilityId,
    date,
    isBooked: { $ne: 'canceled' },
    $or: [
      {
        $and: [
          { startTime: { $lte: startTime } },
          { endTime: { $gt: startTime } }
        ]
      },
      {
        $and: [
          { startTime: { $lt: endTime } },
          { endTime: { $gte: endTime } }
        ]
      },
      {
        $and: [
          { startTime: { $gte: startTime } },
          { endTime: { $lte: endTime } }
        ]
      }
    ]
  });

  return !conflictingBooking;
};

export const Booking = model<TBooking, BookingModel>("Booking", BookingSchema);
