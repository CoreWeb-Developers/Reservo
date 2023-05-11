import { useState } from 'react';
import ServiceList from './ServiceList';
import ServiceFilters from './ServiceFilters';
import { SelectOptionData } from '~/types/select-option-data';
import Container from '~/components/Container';
import { DateRange } from 'react-day-picker';

const Events = () => {
  const [format, setFormat] = useState<SelectOptionData | null>(null);
  const [theme, setTheme] = useState<SelectOptionData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  return (
    <Container>
      <ServiceFilters
        format={format}
        setFormat={setFormat}
        theme={theme}
        setTheme={setTheme}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <ServiceList formatId={format?.id} themeId={theme?.id} dateRange={dateRange} />
    </Container>
  );
};

export default Events;
