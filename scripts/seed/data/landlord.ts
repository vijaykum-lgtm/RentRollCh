import type { DemoLandlord, DemoProperty } from "../lib/types";

export const landlord: DemoLandlord = {
  id: "landlord-1",
  name: "Anil Deshpande",
  phone: "+91 98221 34567",
  email: "anil.deshpande@example.com",
  upiId: "anildeshpande@okhdfcbank",
  businessName: "Deshpande Properties",
};

export const properties: DemoProperty[] = [
  {
    id: "property-kothrud",
    landlordId: landlord.id,
    name: "Kothrud Residency",
    address: "Plot 14, Paud Road, Kothrud, Pune 411038",
    numberOfUnits: 9,
  },
  {
    id: "property-baner",
    landlordId: landlord.id,
    name: "Baner Greenview",
    address: "Survey No. 62, Baner-Pashan Link Road, Baner, Pune 411045",
    numberOfUnits: 6,
  },
];
