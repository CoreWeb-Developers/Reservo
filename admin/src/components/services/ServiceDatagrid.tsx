import { BooleanField, Datagrid, DateField, NumberField, ReferenceField, TextField } from 'react-admin';

const ServiceDatagrid = () => (
  <Datagrid rowClick="show">
    <TextField source="id" />
    <TextField source="name" />
    <NumberField source="price" />
    <ReferenceField label="Company" source="companyId" reference="companies">
      <TextField source="name" />
    </ReferenceField>
    <DateField source="date" showTime />
    <DateField source="publishDate" showTime />
    <BooleanField label="Public" source="isPublic" />
    <BooleanField label="Notifications" source="isNotificationsOn" />
  </Datagrid>
);

export default ServiceDatagrid;
