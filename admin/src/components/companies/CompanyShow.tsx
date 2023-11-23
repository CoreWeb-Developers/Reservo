import {
  ReferenceManyField,
  Pagination,
  NumberField,
  EmailField,
  ReferenceField,
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
} from 'react-admin';
import CompanyTitle from './CompanyTitle';
import { AvatarField } from '../customFields/AvatarField';
import EventDatagrid from '../events/EventDatagrid';
import ServiceDatagrid from '../services/ServiceDatagrid';

const CompanyShow = () => (
  <Show title={<CompanyTitle />}>
    <TabbedShowLayout>
      <Tab label="Summary">
        <TextField source="id" />
        <TextField source="name" />
        <EmailField source="email" />
        <AvatarField source="picturePath" label="Avatar" />
        <NumberField source="latitude" />
        <NumberField source="longitude" />
        <ReferenceField source="userId" reference="users">
          <TextField source="login" />
        </ReferenceField>
      </Tab>
      <Tab label="Events">
        <ReferenceManyField reference="events" target="companyId" pagination={<Pagination />} label={false}>
          <EventDatagrid />
        </ReferenceManyField>
      </Tab>
      <Tab label="Services">
        <ReferenceManyField reference="services" target="companyId" pagination={<Pagination />} label={false}>
          <ServiceDatagrid />
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export default CompanyShow;
