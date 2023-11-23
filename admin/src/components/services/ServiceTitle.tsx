import { useRecordContext } from 'react-admin';

const ServiceTitle = () => {
  const record = useRecordContext();
  return <span>Service {record ? `: ${record.name}` : ''}</span>;
};

export default ServiceTitle;
