import { Button, FormControl, FormLabel, Input, Switch, VStack } from '@chakra-ui/react';
import { useCheckoutForServiceMutation } from '~/store/api/service-slice';
import useCustomToast from '~/hooks/use-custom-toast';
import DrawerWrapper from '~/components/Drawer/DrawerWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ISubscribe, subscribeSchema } from '~/validation/service';
import { Service } from '~/types/service';
import { STRIPE_API_KEY } from '~/consts/service';
import { loadStripe } from '@stripe/stripe-js';

type PropsType = {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
};

const ServiceSubscribe = ({ service: { id, price }, isOpen, onClose }: PropsType) => {
  price = Number(price);
  const [subscribe, { isLoading }] = useCheckoutForServiceMutation();

  const { register, handleSubmit } = useForm<ISubscribe>({
    resolver: zodResolver(subscribeSchema),
  });

  const { toast } = useCustomToast();
  const onSubmit = async (data: ISubscribe) => {
    try {
      const result = await subscribe({ ...data, id }).unwrap();
      if (!price && result.sessionId === -1) {
        toast('You are successfully subscribed to the service', 'success');
        return;
      }
      const stripe = await loadStripe(STRIPE_API_KEY);
      const sessionId = String(result.sessionId);
      toast('You are being redirected to the checkout page.', 'info');
      await stripe?.redirectToCheckout({ sessionId });
    } catch (err: any) {
      toast(err.message || err.data.message, 'error');
    }
  };

  return (
    <DrawerWrapper title="Service subscription" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={8}>
          <FormControl display="flex" alignItems="center">
            <VStack spacing={4} align="flex-start">
              <FormLabel htmlFor="is-visible" mb="0">
                Do you want to be visible as an attendee?
              </FormLabel>
              <Switch id="is-visible" {...register('isVisible')} />
            </VStack>
          </FormControl>
          {!!price && (
            <FormControl display="flex" alignItems="center">
              <VStack spacing={4} align="flex-start">
                <FormLabel htmlFor="promo-code" mb="0">
                  Your promo code
                </FormLabel>
                <Input id="promo-code" {...register('promoCode')} />
              </VStack>
            </FormControl>
          )}
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Subscribe to an service
          </Button>
        </VStack>
      </form>
    </DrawerWrapper>
  );
};

export default ServiceSubscribe;
