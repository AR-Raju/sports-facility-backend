export interface TPaymentData {
  bookingId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
}

export interface TPaymentResponse {
  success: boolean
  paymentUrl?: string
  transactionId?: string
  message: string
}

export interface TPaymentVerification {
  transactionId: string
  status: "success" | "failed" | "pending"
  amount?: number
}
