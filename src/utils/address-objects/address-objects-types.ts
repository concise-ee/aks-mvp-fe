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
  searchString: string;
  countyId: number | null;
  municipalityId: number | null;
  createdAt: string | null;
}

export interface InAddress {
  [key: string]: string;
  ads_oid: string;
}

export interface InAadressResponse {
  addresses?: InAddress[];
  host: string;
}

export interface NewAccommodation {
  name: string | null;
  adsOid: string | null;
}

export interface ParsedInAddressResponse {
  value: string;
  label: string;
  coordinate: [number, number];
}
