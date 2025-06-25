import axios from "axios";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import type {
  TPaymentData,
  TPaymentResponse,
  TPaymentVerification,
} from "./payment.interface";
import { Booking } from "../booking/booking.model";

const initiatePayment = async (
  paymentData: TPaymentData,
): Promise<TPaymentResponse> => {
  try {
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const paymentPayload = {
      store_id: config.ssl_store_id,
      store_passwd: config.ssl_store_pass,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${config.client_url}/payment/success?transactionId=${transactionId}`,
      fail_url: `${config.client_url}/payment/failed?transactionId=${transactionId}`,
      cancel_url: `${config.client_url}/payment/cancelled?transactionId=${transactionId}`,
      ipn_url: `${config.client_url}/api/payment/ipn`,
      shipping_method: "NO",
      product_name: "Sports Facility Booking",
      product_category: "Service",
      product_profile: "general",
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: paymentData.customerAddress,
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: paymentData.customerPhone,
      ship_name: paymentData.customerName,
      ship_add1: paymentData.customerAddress,
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "1000",
      ship_country: "Bangladesh",
    };

    const response = await axios.post(
      config.ssl_payment_url as string,
      paymentPayload,
    );

    if (response.data.status === "SUCCESS") {
      // Update booking with transaction ID
      await Booking.findByIdAndUpdate(paymentData.bookingId, {
        transactionId,
        paymentStatus: "pending",
      });

      return {
        success: true,
        paymentUrl: response.data.GatewayPageURL,
        transactionId,
        message: "Payment initiated successfully",
      };
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment initiation failed");
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment service error");
  }
};

const verifyPayment = async (
  transactionId: string,
): Promise<TPaymentVerification> => {
  try {
    const response = await axios.get(
      `${config.ssl_validation_url}?val_id=${transactionId}&store_id=${config.ssl_store_id}&store_passwd=${config.ssl_store_pass}&format=json`,
    );

    if (response.data.status === "VALID") {
      // Update booking payment status
      await Booking.findOneAndUpdate(
        { transactionId },
        { paymentStatus: "paid" },
      );

      return {
        transactionId,
        status: "success",
        amount: Number.parseFloat(response.data.amount),
      };
    } else {
      // Update booking payment status to failed
      await Booking.findOneAndUpdate(
        { transactionId },
        { paymentStatus: "failed" },
      );

      return {
        transactionId,
        status: "failed",
      };
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment verification failed");
  }
};

export const PaymentServices = {
  initiatePayment,
  verifyPayment,
};
