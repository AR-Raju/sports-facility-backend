import QueryBuilder from "../../builder/QueryBuilder"
import type { TContact } from "./contact.interface"
import { Contact } from "./contact.model"

const createContactIntoDB = async (payload: TContact) => {
  const result = await Contact.create(payload)
  return result
}

const getAllContactsFromDB = async (query: Record<string, unknown>) => {
  const contactQuery = new QueryBuilder(Contact.find(), query).filter().sort().paginate().fields()

  const result = await contactQuery.modelQuery
  const total = await Contact.countDocuments()
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

const markContactAsReadIntoDB = async (id: string) => {
  const result = await Contact.findByIdAndUpdate(id, { isRead: true }, { new: true })
  return result
}

const deleteContactFromDB = async (id: string) => {
  const result = await Contact.findByIdAndDelete(id)
  return result
}

export const ContactServices = {
  createContactIntoDB,
  getAllContactsFromDB,
  markContactAsReadIntoDB,
  deleteContactFromDB,
}
