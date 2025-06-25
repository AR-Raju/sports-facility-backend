export interface TUploadResponse {
  url: string;
  public_id?: string;
  secure_url?: string;
}

export interface TImageUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
