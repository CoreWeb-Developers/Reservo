import { Button, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import DrawerWrapper from '~/components/Drawer/DrawerWrapper';
import PromoCodeCreateForm from './PromoCodeCreateFrom';
import { Service } from '~/types/service';

type PropsType = {
  service: Service;
};

const PromoCodeCreate = ({ service }: PropsType) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="blue" variant="outline" onClick={onOpen} leftIcon={<AddIcon />}>
        Create promo code
      </Button>
      <DrawerWrapper isOpen={isOpen} onClose={onClose} title="Create promo code">
        <PromoCodeCreateForm service={service} />
      </DrawerWrapper>
    </>
  );
};

export default PromoCodeCreate;
