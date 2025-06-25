import { Model, Types } from "mongoose";
import { BOOKING_STATUS } from "./booking.constant";

export interface TBooking {
  date: string; // ISO format date string (YYYY-MM-DD)
  startTime: string; // ISO format time string (HH:MM)
  endTime: string; // ISO format time string (HH:MM)
  user: Types.ObjectId; // Reference to the user who made the booking
  facility: Types.ObjectId; // Reference to the booked facility
  payableAmount: number; // Calculated amount payable for the booking
  isBooked: TBookingStatus; // Status of the booking
  paymentStatus: 'pending' | 'paid' | 'failed';
  transactionId?: string;
}

// Enum for booking status
export type TBookingStatus = keyof typeof BOOKING_STATUS;

export interface BookingModel extends Model<TBooking> {
  isBookingExists(id: string): Promise<TBooking | null>;
  isTimeSlotAvailable(
    facilityId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean>;
}
