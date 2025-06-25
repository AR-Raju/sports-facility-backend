export const BOOKING_STATUS = {
  Confirmed: "confirmed",
  Unconfirmed: "unconfirmed",
  Canceled: "canceled",
} as const;

export const booking_status_array = ["confirmed", "unconfirmed", "canceled"];

export const BookingSearchableFields = ["date", "isBooked"];
