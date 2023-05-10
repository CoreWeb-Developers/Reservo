import { Request, Response } from 'express';
import { scheduleCompanySubscribersNotification } from '../jobs/company-subscribers-notification';
import prisma from '../lib/prisma';
import ServiceService from '../services/service';
import { compareDates } from '../utils/compare-dates';
import { getPageOptions } from '../utils/query-options';
import Avatar from '../services/avatar';
import { scheduleEventReminder } from '../jobs/event-reminder';
import subtractHours from '../utils/subtract-hours';
import { HOURS_BEFORE_EVENT } from '../consts/default';
import wait from '../utils/wait';
import ClientError from '../types/error';
import CompanyService from '../services/company';

const service = prisma.service;

const createService = async (req: Request, res: Response) => {
  const data = req.body;
  const { publishDate, date } = data;

  if (data.price !== 0) {
    const stripeId = await CompanyService.isStripeConnected(Number(data.companyId));
    await CompanyService.checkAccountOrThrow(stripeId);
  }

  await Promise.all([
    ServiceService.checkUniqueEventName(data.name),
    ServiceService.checkEventFormatExists(data.formatId),
    ServiceService.checkEventThemeExists(data.themeId),
  ]);

  const newService = await service.create({
    data,
    include: { format: true, theme: true },
  });

  scheduleCompanySubscribersNotification(new Date(publishDate), newService.id);
  scheduleEventReminder(subtractHours(date, HOURS_BEFORE_EVENT), newService.id);

  res.status(201).json(newService);
};

const getOneServiceById = async (req: Request, res: Response) => {
  const serviceId: number = Number(req.params.id);

  const service = await ServiceService.findEventIfExists(serviceId);

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
      include: { format: true, theme: true },
    }),
    service.count({ where }),
  ]);

  await wait(2000);

  res.setHeader('X-Total-Count', count);
  res.status(200).json(services);
};

const updateService = async (req: Request, res: Response) => {
  const data = req.body;
  const { publishDate, date } = data;
  const serviceId = Number(req.params.id);

  const [oldEvent] = await Promise.all([
    ServiceService.findServiceIfExists(serviceId),
    ServiceService.checkUniqueEventName(data.name, serviceId),
    ServiceService.checkEventFormatExists(data.formatId),
    ServiceService.checkEventThemeExists(data.themeId),
  ]);

  const updatedService = await service.update({
    where: { id: serviceId },
    data,
    include: { format: true, theme: true },
  });

  if (compareDates(new Date(publishDate), oldEvent.publishDate)) {
    scheduleCompanySubscribersNotification(new Date(publishDate), serviceId);
  }

  if (compareDates(new Date(date), oldService.date)) {
    scheduleEventReminder(subtractHours(date, HOURS_BEFORE_EVENT), eventId);
  }

  res.json(updatedService);
};

const deleteService = async (req: Request, res: Response) => {
  const serviceId = Number(req.params.id);

  const toUpdate = await service.findUnique({ where: { id: serviceId } });
  await Avatar.removeFrom(toUpdate);

  const deletedService = await service.delete({
    where: { id: serviceId },
    include: { format: true, theme: true },
  });

  res.json(deletedService);
};

const updatePoster = async (req: Request, res: Response) => {
  const serviceId = Number(req.params.id);
  const picturePath = (req.file as Express.Multer.File).filename;

  const toUpdate = await service.findUnique({ where: { id: serviceId } });
  await Avatar.removeFrom(toUpdate);

  const updatedEvent = await service.update({
    where: {
      id: serviceId,
    },
    data: {
      picturePath,
    },
    include: { format: true, theme: true },
  });

  res.json(updatedEvent);
};

const deletePoster = async (req: Request, res: Response) => {
  const serviceId = Number(req.params.id);

  const toUpdate = await service.findUnique({ where: { id: serviceId } });
  await Avatar.removeFrom(toUpdate);

  const updatedService = await service.update({
    where: {
      id: serviceId,
    },
    data: {
      picturePath: null,
    },
    include: { format: true, theme: true },
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
