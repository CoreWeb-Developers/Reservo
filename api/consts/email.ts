const templates = {
  EMAIL_CONFIRM: {
    subject: 'Please confirm your email',
    file: 'email-confirm.pug',
  },
  PASSWORD_CONFIRM: {
    subject: 'Please confirm your password reset',
    file: 'password-confirm.pug',
  },
  EVENT_PUBLISHED: {
    subject: 'A new event that might be interesting to you',
    file: 'event-published.pug',
  },
  SERVICE_PUBLISHED: {
    subject: 'A new service that might be interesting to you',
    file: 'event-published.pug',
  },
  NEW_EVENT_VISITOR: {
    subject: 'A new user has subscribed to your event',
    file: 'new-visitor-notification.pug',
  },
  NEW_SERVICE_VISITOR: {
    subject: 'A new user has subscribed to your service',
    file: 'new-visitor-notification.pug',
  },
  EVENT_SUBSCRIPTION: {
    subject: 'You have subscribed to an event',
    file: 'event-subscription.pug',
  },
  SERVICE_SUBSCRIPTION: {
    subject: 'You have subscribed to an service',
    file: 'service-subscription.pug',
  },
  EVENT_REMINDER: {
    subject: 'Your event will start soon',
    file: 'event-reminder.pug',
  },
  SERVICE_REMINDER: {
    subject: 'Your service will start soon',
    file: 'service-reminder.pug',
  },

};

export default templates;
