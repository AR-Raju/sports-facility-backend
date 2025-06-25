import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { ContactServices } from "./contact.service"

const createContact = catchAsync(async (req, res, next) => {
  const result = await ContactServices.createContactIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Contact message sent successfully",
    data: result,
  })
})

const getAllContacts = catchAsync(async (req, res, next) => {
  const result = await ContactServices.getAllContactsFromDB(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contacts retrieved successfully",
    data: result.data,
    meta: result.meta,
  })
})

const markContactAsRead = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const result = await ContactServices.markContactAsReadIntoDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact marked as read successfully",
    data: result,
  })
})

const deleteContact = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const result = await ContactServices.deleteContactFromDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact deleted successfully",
    data: result,
  })
})

export const ContactControllers = {
  createContact,
  getAllContacts,
  markContactAsRead,
  deleteContact,
}
