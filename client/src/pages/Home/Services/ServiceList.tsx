import { Flex, SimpleGrid, SlideFade } from '@chakra-ui/react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import ServiceCard from '~/components/ServiceCard/ServiceCard';
import ServiceCardSkeleton from '~/components/ServiceCard/ServiceCardSkeleton';
import Pagination from '~/components/Pagination/Pagination';
import { useGetServicesQuery } from '~/store/api/service-slice';
import { ServicesParam } from '~/types/service';
import NothingFound from './NothingFound';

type Props = {
  q?: string;
  userId?: number;
  companyId?: number;
  itemsPerPage?: number;
  dateRange: DateRange | null;
  notPublished?: boolean;
};

const ServiceList = ({
  userId,
  companyId,
  q,
  dateRange,
  itemsPerPage = 8,
  notPublished = false,
}: Props) => {
  const [curPage, setCurPage] = useState(1);

  const params: ServicesParam = {
    _sort: 'date',
    _order: 'ASC' as const,
    _start: (curPage - 1) * itemsPerPage,
    _end: curPage * itemsPerPage,
    upcoming: true,
    notPublished: notPublished ? notPublished : undefined,
  };
  userId ? (params.userId = userId) : null;
  companyId ? (params.companyId = companyId) : null;
  q ? (params.q = q) : null;
  if (dateRange?.from && dateRange?.to) {
    params.dateFrom = dateRange.from.toISOString();
    params.dateTo = dateRange.to.toISOString();
  }

  const { data, isFetching } = useGetServicesQuery(params);

  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing={{ base: '20px', md: '30px' }} py="40px">
        {isFetching ? (
          <>
            {Array(itemsPerPage)
              .fill('')
              .map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
          </>
        ) : data?.services.length ? (
          data?.services.map((service) => (
            <SlideFade key={service.id} offsetY="30px" in={true}>
              <ServiceCard isTicket={!!userId} service={service} h="100%" />
            </SlideFade>
          ))
        ) : (
          <SlideFade offsetY="30px" in={true}>
            <NothingFound />
          </SlideFade>
        )}
      </SimpleGrid>
      <Flex w="100%" alignItems="center" justifyContent="center" pb="40px">
        {data?.services.length ? (
          <Pagination
            numberOfPages={Math.ceil((data?.totalCount as number) / itemsPerPage)}
            curPage={curPage}
            setCurPage={setCurPage}
          />
        ) : null}
      </Flex>
    </>
  );
};

export default ServiceList;
