import { Box, Heading } from '@chakra-ui/react';
import { useGetServicesQuery } from '~/store/api/service-slice';
import { Service, ServicesParam } from '~/types/service';
import styles from '../service.styles';
import Carousel from './Carousel';
import CarouselNothingFound from './CarouselNothingFound';

type Props = {
  serviceId: number;
  companyId: number;
};

const CompanyServicesCarousel = ({ serviceId, companyId }: Props) => {
  const params: ServicesParam = {
    _sort: 'date',
    _order: 'ASC' as const,
    _start: 0,
    _end: 20,
    upcoming: true,
    companyId,
  };

  const { data, isFetching, isSuccess } = useGetServicesQuery(params);

  let services: Service[] | null = null;

  if (isSuccess) {
    services = data.services.filter((e) => e.id !== serviceId);
  }

  return (
    <Box py="40px" sx={{ ...styles.mainInfo, mx: !serviceId ? 'auto' : 0 }}>
      <Heading as="h3" fontSize="24px">
        Other company's services
      </Heading>
      {!services?.length && !isFetching ? <CarouselNothingFound /> : <Carousel isFetching={isFetching} services={services} />}
    </Box>
  );
};

export default CompanyServicesCarousel;
