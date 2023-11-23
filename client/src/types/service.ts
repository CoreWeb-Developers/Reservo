import { Order } from './order';

export type Service = {
  id: number;
  name: string;
  description: string;
  picturePath: string;
  latitude: number;
  longitude: number;
  price: number;
  slotsAvailable: number;
  date: string;
  publishDate: string;
  isPublic: boolean;
  isNotificationsOn: boolean;
  companyId: number;
};

export type ServicesResponse = {
  services: Service[];
  totalCount: number;
};

export type ServicesParam = {
  _start?: number;
  _end?: number;
  _sort?: string;
  _order?: Order;
  id?: number;
  upcoming?: boolean;
  notPublished?: boolean;
  companyId?: number;
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
};

export type SubscriptionResponse = {
  sessionId: number;
};
