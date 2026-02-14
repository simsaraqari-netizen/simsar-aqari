
export enum PropertyType {
  APARTMENT = 'شقة',
  VILLA = 'فيلا',
  FLOOR = 'دور',
  HOUSE = 'بيت',
  LAND = 'أرض',
  COMMERCIAL = 'تجاري',
  CHALET = 'شاليه',
  BUILDING = 'عمارة',
  FARM = 'مزرعة'
}

export enum ListingType {
  RENT = 'للإيجار',
  SALE = 'للبيع',
  EXCHANGE = 'للبدل'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  companyId: string;
  assignedCredits: number;
  usedCredits: number;
}

export interface Company {
  id: string;
  name: string;
  totalCredits: number;
  usedCredits: number;
  packageType: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: string;
  governorate: string;
  location: string;
  type: PropertyType;
  listingType: ListingType;
  rooms: number;
  bathrooms: number;
  space: number;
  images: string[];
  postedAt: Date;
  whatsapp: string;
  companyName?: string;
  featured?: boolean;
  postedBy: string; // User ID
}

export interface FilterState {
  searchQuery: string;
  listingTypes: ListingType[];
  propertyTypes: PropertyType[];
  minPrice: number;
  maxPrice: number;
  minRooms: number;
  governorates: string[];
  areas: string[];
}
