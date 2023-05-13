import { useState } from 'react';
import { Button, useDisclosure, VStack, Flex } from '@chakra-ui/react';
import { FiFrown } from 'react-icons/fi';
import { useGetPromoCodesQuery } from '~/store/api/promo-code-slice';
import DrawerWrapper from '~/components/Drawer/DrawerWrapper';
import Loader from '~/components/Loader/Loader';
import NothingFound from '../../NothingFound';
import Pagination from '~/components/Pagination/Pagination';
import PromoCodeCreate from '~/pages/ServicePage/Info/ServicePromoCodes/PromoCodeCreate/PromoCodeCreate';
import ServicePromoCode from './ServicePromoCode';
import type { Service } from '~/types/service';

type PropsType = {
  service: Service;
};

const ServicePromoCodes = ({ service }: PropsType) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [curPage, setCurPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isLoading, error } = useGetPromoCodesQuery({
    _start: (curPage - 1) * itemsPerPage,
    _end: curPage * itemsPerPage,
    serviceId: service.id,
  });

  return (
    <>
      <Button colorScheme="blue" variant="outline" isLoading={isLoading} onClick={onOpen} isDisabled={!!error}>
        View promo codes
      </Button>
      <DrawerWrapper isOpen={isOpen} onClose={onClose} title="Promo codes">
        <>
          <PromoCodeCreate service={service} />

          {isLoading ? (
            <Loader isFullScreen={false} />
          ) : data?.promoCodes?.length ? (
            <>
              <VStack spacing="4" py="4">
                {data?.promoCodes.map((promoCode) => (
                  <ServicePromoCode key={promoCode.id} promoCode={promoCode} />
                ))}
              </VStack>
              <Flex w="100%" alignItems="center" justifyContent="center" py="30px">
                {data.totalCount > itemsPerPage ? (
                  <Pagination
                    numberOfPages={Math.ceil((data?.totalCount as number) / itemsPerPage)}
                    curPage={curPage}
                    setCurPage={setCurPage}
                  />
                ) : null}
              </Flex>
            </>
          ) : (
            <NothingFound icon={FiFrown} message="There are no promo codes" />
          )}
        </>
      </DrawerWrapper>
    </>
  );
};

export default ServicePromoCodes;
