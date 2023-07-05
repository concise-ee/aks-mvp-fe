export interface Accommodation {
  name: string;
  id: number;
  activeAddress: string;
  addresses: Address[];
}

export interface Address {
  active: boolean;
  address: string;
  adsOid: string;
  centroidX: string;
  centroidY: string;
  createdAt: string;
}

export interface AccommodationFilter {
  countyId: number | null;
  municipalityId: number | null;
  createdAt: string | null;
}
