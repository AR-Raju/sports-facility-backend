import { Model } from "mongoose";

export type TFacility = {
  name: string;
  description: string;
  pricePerHour: number;
  location: string;
  image?: string;
  isDeleted: boolean;
};

export interface FacilityModel extends Model<TFacility> {
  isFacilityExists(name: string): Promise<TFacility | null>;
}
