import express from 'express';
import {
  createService,
  deleteService,
  deletePoster,
  getManyServices,
  getOneServiceById,
  updateService,
  updatePoster,
} from '../controllers/services';
import { createSession } from '../controllers/payment';
import auth, { optionalAuth } from '../middleware/auth';
import { checkUserCompanyRights, checkUserServiceRights } from '../middleware/check-rights';
import boundary from '../utils/error-boundary';
import fileUpload from '../utils/file-upload';
import validate from '../utils/validation';
import {
  createSchema as createServiceSchema,
  ticketSchema,
  updateSchema,
} from '../validation/services';

const router = express.Router();

router.get('/', optionalAuth, boundary(getManyServices));
router.get('/:id', boundary(getOneServiceById));

router.use(auth);

router.post('/', validate(createServiceSchema), checkUserCompanyRights, boundary(createService));
router.put('/:id', checkUserServiceRights, validate(updateSchema), boundary(updateService));
router.delete('/:id', checkUserServiceRights, boundary(deleteService));
router.put(
  '/:id/poster',
  checkUserServiceRights,
  fileUpload.single('poster'),
  boundary(updatePoster),
);
router.delete('/:id/poster', checkUserServiceRights, boundary(deletePoster));

router.post('/:id/subscribe', validate(ticketSchema), boundary(createSession));

export default router;
