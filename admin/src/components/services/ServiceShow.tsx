import {
  BooleanField,
  ChipField,
  DateField,
  NumberField,
  Pagination,
  ReferenceField,
  ReferenceManyField,
  RichTextField,
  Show,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin';
import { PosterField } from '../customFields/PosterField';
import ServiceTitle from './ServiceTitle';
import CommentsDatagrid from '../comments/CommentsDatagrid';

const ServiceShow = () => (
  <Show title={<ServiceTitle />}>
    <TabbedShowLayout>
      <Tab label="Summary">
        <SimpleShowLayout>
          <NumberField source="id" />
          <TextField source="name" />
          <ReferenceField label="Company" source="companyId" reference="companies">
            <TextField source="name" />
          </ReferenceField>
          <NumberField source="price" />
          <NumberField source="slotsAvailable" />
          <NumberField source="latitude" />
          <NumberField source="longitude" />
          <DateField label="Publication date" source="publishDate" showTime />
          <DateField label="Date" source="date" showTime />
          <BooleanField label="Public" source="isPublic" />
          <BooleanField label="Notifications" source="isNotificationsOn" />
          <RichTextField source="description" />
          <PosterField source="picturePath" label="Poster" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Comments" path="comments">
        <ReferenceManyField reference="comments" target="ServiceId" pagination={<Pagination />} label={false}>
          <CommentsDatagrid />
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export default ServiceShow;
