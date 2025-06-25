export interface TAdminStats {
  totalUsers: number;
  totalFacilities: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: any[];
  monthlyRevenue: any[];
}

export interface TDashboardData {
  stats: TAdminStats;
  recentActivities: any[];
}
