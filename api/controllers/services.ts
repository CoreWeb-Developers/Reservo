import { Request, Response } from 'express';
import { scheduleCompanySubscribersNotification } from '../jobs/company-subscribers-notification';
import prisma from '../lib/prisma';
import ServiceService from '../services/service';
import { compareDates } from '../utils/compare-dates';
import { getPageOptions } from '../utils/query-options';
import Avatar from '../services/avatar';
import { scheduleServiceReminder } from '../jobs/service-reminder';
import subtractHours from '../utils/subtract-hours';
import { HOURS_BEFORE_SERVICE } from '../consts/default';
import wait from '../utils/wait';
import ClientError from '../types/error';
import CompanyService from '../services/company';
import { Service, Prisma } from '@prisma/client';

const service = prisma.service;

const createService = async (req: Request, res: Response) => {
  const data = req.body;
  const { publishDate, date } = data;

  if (data.price !== 0) {
    const stripeId = await CompanyService.isStripeConnected(Number(data.companyId));
    await CompanyService.checkAccountOrThrow(stripeId);
  }

  await Promise.all([
    ServiceService.checkUniqueServiceName(data.name, 0),
  ]);

  const newService = await service.create({
    data: data as Prisma.ServiceCreateInput, // Cast data to the correct type
  });

  scheduleCompanySubscribersNotification(new Date(publishDate), newService.id);
  scheduleServiceReminder(subtractHours(date, HOURS_BEFORE_SERVICE), newService.id);

  res.status(201).json(newService);
};

const getOneServiceById = async (req: Request, res: Response) => {
  const serviceId: number = Number(req.params.id);

  const service = await ServiceService.findServiceIfExists(serviceId);

  res.status(200).json(service);
};

const getManyServices = async (req: Request, res: Response) => {
  if (req.query.userId && req.user?.id !== Number(req.query.userId)) {
    throw new ClientError('You cannot view these services', 403);
  }

  const where = ServiceService.getServicesWhereOptions(req.query);
  const sort = ServiceService.getServicesSortOptions(req.query, 'id');
  const pagination = getPageOptions(req.query);

  const [services, count] = await prisma.$transaction([
    service.findMany({
      where,
      ...pagination,
      ...sort,
    }),
    service.count({ where }),
  ]);

  res.setHeader('X-Total-Count', count);
  res.status(200).json(services);
};

const updateService = async (req: Request, res: Response) => {
  const data = req.body;
  const { publishDate, date } = data;
  const serviceId = Number(req.params.id);

  const [oldService] = await Promise.all([
    ServiceService.findServiceIfExists(serviceId),
    ServiceService.checkUniqueServiceName(data.name, serviceId),
  ]);

  const updatedService = await service.update({
    where: { id: serviceId },
    data: data as Prisma.ServiceUpdateInput, // Cast data to the correct type
  });

  if (compareDates(new Date(publishDate), oldService.publishDate)) {
    scheduleCompanySubscribersNotification(new Date(publishDate), serviceId);
  }

  if (compareDates(new Date(date), oldService.date)) {
    scheduleServiceReminder(subtractHours(date, HOURS_BEFORE_SERVICE), serviceId);
  }

  res.json(updatedService);
};

const deleteService = async (req: Request, res: Response) => {
  const serviceId = Number(req.params.id);

 

  const deletedService = await service.delete({
    where: { id: serviceId },
  });

  res.json(deletedService);
};

const updatePoster = async (req: Request, res: Response) => {
  const serviceId = Number(req.params.id);
  const picturePath = (req.file as Express.Multer.File).filename;


  const updatedService = await service.update({
    where: {
      id: serviceId,
    },
    data: {
      picturePath,
    },
  });

  res.json(updatedService);
};

const deletePoster = async (req: Request, res: Response) => {
  const serviceId = Number(req.params.id);



  const updatedService = await service.update({
    where: {
      id: serviceId,
    },
    data: {
      picturePath: null,
    },
  });

  res.json(updatedService);
};

export {
  createService,
  getOneServiceById,
  getManyServices,
  updateService,
  deleteService,
  updatePoster,
  deletePoster,
};
