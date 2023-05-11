import { List, TextInput } from 'react-admin';
import ServiceDatagrid from './ServiceDatagrid';

const filters = [<TextInput source="q" label="Search" alwaysOn />];

const ServiceList = () => (
  <List filters={filters}>
    <ServiceDatagrid />
  </List>
);

export default ServiceList;
