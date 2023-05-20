import { useState } from 'react';
import ServiceList from './ServiceList';
import ServiceFilters from './ServiceFilters';
import Container from '~/components/Container';
import { DateRange } from 'react-day-picker';

const Services = () => {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  return (
    <Container>
      <ServiceFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <ServiceList dateRange={dateRange} />
    </Container>
  );
};

export default Services;
