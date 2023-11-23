import ServiceCreate from './ServiceCreate';
import ServiceEdit from './ServiceEdit';
import ServiceList from './ServiceList';
import ServiceShow from './ServiceShow';

const resource = {
  list: ServiceList,
  show: ServiceShow,
  create: ServiceCreate,
  edit: ServiceEdit,
};

export default resource;
