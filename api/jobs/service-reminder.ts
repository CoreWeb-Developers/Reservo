import { User } from '@prisma/client';
import { CronJob } from 'cron';
import { HOURS_BEFORE_SERVICE } from '../consts/default';
import templates from '../consts/email';
import prisma from '../lib/prisma';
import { Email } from '../services';
import { getServiceDate } from '../services/service';
import { compareDates } from '../utils/compare-dates';
import subtractHours from '../utils/subtract-hours';

const scheduleServiceReminder = (tickDate: Date, serviceId: number) => {
  new CronJob(
    tickDate,
    async () => {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: { visitors: { include: { user: true } }, company: true },
      });

      if (!service || !service.visitors.length) {
        return;
      }

      const { date: serviceDate, name: serviceName } = service;
      const visitors = service.visitors.map((visitor) => visitor.user);

      const sendRemindersDate = subtractHours(serviceDate, HOURS_BEFORE_SERVICE);

      if (!compareDates(tickDate, sendRemindersDate)) {
        sendReminders(serviceName, getServiceDate(serviceDate), serviceId, visitors);
      }
    },
    null,
    true,
  );
};

const sendReminders = async (
  serviceName: string,
  serviceDate: string,
  serviceId: number,
  visitors: User[],
) => {
  visitors.forEach((visitor) => {
    Email.sendMail(visitor.email, templates.SERVICE_REMINDER, {
      serviceName,
      serviceDate,
      hoursBeforeService: HOURS_BEFORE_SERVICE,
      serviceId,
    });
  });
};

export { scheduleServiceReminder };
