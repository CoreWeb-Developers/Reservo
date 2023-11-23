import {  Stack } from '@chakra-ui/react';
import { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
// import AsyncSelectFormat from '~/components/Select/AsyncSelectFormat';
// import AsyncSelectTheme from '~/components/Select/AsyncSelectTheme';
// import { SelectOptionData } from '~/types/select-option-data';
import ServiceDatesMenu from './ServiceDatesMenu';

type Props = {
  dateRange: DateRange | null;
  setDateRange: (val: DateRange | null) => void;
};

const ServiceFilters = ({dateRange, setDateRange }: Props) => {
  return (
    <Stack direction={{ base: 'column', lg: 'row' }} spacing="20px">
      {/* <InputGroup>
        <InputLeftAddon>Format</InputLeftAddon>
        <AsyncSelectFormat format={format} setFormat={setFormat} />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon>Theme</InputLeftAddon>
        <AsyncSelectTheme theme={theme} setTheme={setTheme} />
      </InputGroup> */}
      <ServiceDatesMenu dateRange={dateRange} setDateRange={setDateRange} />
    </Stack>
  );
};

export default ServiceFilters;
