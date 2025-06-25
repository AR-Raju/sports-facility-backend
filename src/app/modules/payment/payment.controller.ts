import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const initiatePayment = catchAsync(async (req, res, next) => {
  const result = await PaymentServices.initiatePayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res, next) => {
  const { transactionId } = req.params;
  const result = await PaymentServices.verifyPayment(transactionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment verified successfully",
    data: result,
  });
});

const handlePaymentIPN = catchAsync(async (req, res, next) => {
  // Handle Instant Payment Notification from SSLCommerz
  const { tran_id, status } = req.body;

  if (status === "VALID") {
    await PaymentServices.verifyPayment(tran_id);
  }

  res.status(200).send("OK");
});

export const PaymentControllers = {
  initiatePayment,
  verifyPayment,
  handlePaymentIPN,
};
