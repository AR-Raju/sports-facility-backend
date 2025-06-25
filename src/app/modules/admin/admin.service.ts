import { User } from "../user/user.model"
import { Facility } from "../facility/facility.model"
import { Booking } from "../booking/booking.model"
import type { TAdminStats, TDashboardData } from "./admin.interface"

const getAdminStatsFromDB = async (): Promise<TAdminStats> => {
  const totalUsers = await User.countDocuments({ role: "user" })
  const totalFacilities = await Facility.countDocuments({ isDeleted: false })
  const totalBookings = await Booking.countDocuments()

  // Calculate total revenue
  const revenueResult = await Booking.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$payableAmount" } } },
  ])
  const totalRevenue = revenueResult[0]?.total || 0

  // Get recent bookings
  const recentBookings = await Booking.find()
    .populate("user", "name email")
    .populate("facility", "name")
    .sort({ createdAt: -1 })
    .limit(5)

  // Get monthly revenue for the last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const monthlyRevenue = await Booking.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$payableAmount" },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ])

  return {
    totalUsers,
    totalFacilities,
    totalBookings,
    totalRevenue,
    recentBookings,
    monthlyRevenue,
  }
}

const getDashboardDataFromDB = async (): Promise<TDashboardData> => {
  const stats = await getAdminStatsFromDB()

  // Get recent activities (bookings, new users, etc.)
  const recentActivities = await Booking.find()
    .populate("user", "name")
    .populate("facility", "name")
    .sort({ createdAt: -1 })
    .limit(10)

  return {
    stats,
    recentActivities,
  }
}

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

  const total = await User.countDocuments({ role: "user" })

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export const AdminServices = {
  getAdminStatsFromDB,
  getDashboardDataFromDB,
  getAllUsersFromDB,
}
