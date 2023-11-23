import { Prisma } from '@prisma/client';
import { DateFormatOptions } from '../consts/default';
import logger from '../lib/logger';
import prisma from '../lib/prisma';
import ClientError from '../types/error';
import { DEFAULT_SORT_OPTIONS, getSortOptions, QueryParams } from '../utils/query-options';

const service = prisma.service;


type FilterAttributes = {
  id?: string | string[];
  companyId?: string | string[];
  userId?: string;
  upcoming?: boolean;
  notPublished?: boolean;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
};

const convertQueryParamToNumArr = (param: string | string[]): number[] => {
  return Array.isArray(param) ? param.map((item) => Number(item)) : [Number(param)];
};

export const getServiceDate = (initialDate: Date) => {
  const date = new Date(initialDate);
  return new Intl.DateTimeFormat('en-US', DateFormatOptions).format(date);
};

const ServiceService = {
  async findServiceIfExists(serviceId: number) {
    try {
      return await service.findUniqueOrThrow({
        where: { id: serviceId },
      });
    } catch (_e) {
      throw new ClientError("The Service doesn't exist!", 404);
    }
  },

  async isUsersQueryAllowed(serviceId: number, userId: number | undefined) {
    const e = await service.findFirst({
      where: {
        id: serviceId,
        OR: [
          {
            visitors: {
              some: {
                userId: userId || -1,
              },
            },
          },
          { isPublic: true },
        ],
      },
    });

    const isAllowed = e !== null;
    !isAllowed && logger.warn("You are not allowed to view the service's visitors");

    return isAllowed;
  },

  async checkUniqueServiceName(name: string, notId: number = 0) {
    const exists = await service.findFirst({
      where: {
        name,
        NOT: {
          id: notId,
        },
      },
    });
    if (exists) {
      throw new ClientError('The service with this name already exists.', 400);
    }
  },


  getServicesSortOptions(params: QueryParams, defaultSort: string): any {
    const { _sort, _order } = params;

    if (!_sort || !_order) {
      return DEFAULT_SORT_OPTIONS(defaultSort);
    }

    return getSortOptions(params, defaultSort);
  },

  getServicesWhereOptions(queryParams: FilterAttributes) {
    const where: Prisma.ServiceWhereInput = {};
    const {
      userId,
      id,
      companyId,
      q,
      upcoming,
      dateFrom,
      dateTo,
      notPublished,
    } = queryParams;

    if (id) {
      where.id = { in: convertQueryParamToNumArr(id) };
    }
    if (companyId) {
      where.companyId = Number(companyId);
    }
    if (userId) {
      where.visitors = {
        some: { userId: Number(userId) },
      };
    }
    if (q) {
      where.name = { contains: q };
    }
    if ((dateFrom && dateTo) || upcoming) {
      where.publishDate = {
        lte: new Date().toISOString(),
      };
    }
    if (dateFrom && dateTo) {
      where.date = {
        gte: new Date(dateFrom).toISOString(),
        lte: new Date(dateTo).toISOString(),
      };
    } else if (upcoming) {
      where.date = { gte: new Date().toISOString() };
    }
    if (notPublished) {
      where.publishDate = {
        gte: new Date().toISOString(),
      };
    }

    return where;
  },
};

export default ServiceService;
