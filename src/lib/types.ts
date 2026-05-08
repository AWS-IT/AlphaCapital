export type RealEstateObject = {
  id: number;
  title: string;
  image: string;
  shortDescription: string;
  price: string;
  deliveryDate: string;
  floors: string;
  commercialFloors: string;
  parking: string;
  description: string;
  hot: boolean;
  latitude: number | null;
  longitude: number | null;
};

export type AdminOverrides = {
  hotIds: number[];
  hotOrder: number[];
  customTexts: Record<string, { title?: string; shortDescription?: string }>;
  updatedAt: string;
};

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
  objectId?: number | null;
  objectTitle?: string | null;
};
