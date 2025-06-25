import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../builder/QueryBuilder";
import { FacilitySearchableFields } from "./facility.constant";
import { TFacility } from "./facility.interface";
import { Facility } from "./facility.model";

const createFacilityIntoDB = async (payload: TFacility) => {
  if (await Facility.isFacilityExists(payload.name)) {
    throw new AppError(httpStatus.CONFLICT, "Facility already exists!");
  }
  const result = await Facility.create(payload);
  return result;
};

const getAllFacilityFromDB = async (query: Record<string, unknown>) => {
  const facilityQuery = new QueryBuilder(Facility.find(), query)
    .search(FacilitySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facilityQuery.modelQuery;
  const total = await Facility.countDocuments({ isDeleted: { $ne: true } });
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getFacilityByIdFromDB = async (id: string) => {
  const result = await Facility.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Facility not found!");
  }
  return result;
};

const getAdminFacilitiesFromDB = async (query: Record<string, unknown>) => {
  // Admin can see all facilities including deleted ones
  const facilityQuery = new QueryBuilder(
    Facility.find().select("+isDeleted"),
    query,
  )
    .search(FacilitySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facilityQuery.modelQuery;
  const total = await Facility.countDocuments();
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateFacilityIntoDB = async (
  id: string,
  payload: Partial<TFacility>,
) => {
  const facility = await Facility.findById(id);
  if (!facility) {
    throw new AppError(httpStatus.NOT_FOUND, "Facility not found!");
  }

  const result = await Facility.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteFacilityFromDB = async (id: string) => {
  const facility = await Facility.findById(id);
  if (!facility) {
    throw new AppError(httpStatus.NOT_FOUND, "Facility not found!");
  }

  const result = await Facility.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

export const FacilityServices = {
  createFacilityIntoDB,
  updateFacilityIntoDB,
  deleteFacilityFromDB,
  getAllFacilityFromDB,
  getFacilityByIdFromDB,
  getAdminFacilitiesFromDB,
};
