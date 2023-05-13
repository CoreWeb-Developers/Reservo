import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Image,
    Icon,
    Text,
    VStack,
    HStack,
    TagLeftIcon,
    Tag,
    TagLabel,
    useDisclosure,
    Wrap,
  } from '@chakra-ui/react';
  import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
  import styles from '../service.styles';
  import { Service } from '~/types/service';
  import GoogleMap from '~/components/GoogleMap/GoogleMap';
  import { FALLBACK_POSTER, GET_DISPLAY_SERVICE } from '~/consts/service';
  import { useAppSelector } from '~/hooks/use-app-selector';
  import ServiceSubscribe from './ServiceSubscribe';
  import ServiceVisitors from './ServiceVisitors';
  import { useState, useEffect } from 'react';
  import Geocode from '~/consts/geocode';
  import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
  import type { Company } from '~/types/company';
  import ConfirmPopover from '~/components/ConfirmPopover/ConfirmPopover';
  import { useDeleteServiceMutation, useGetServicesQuery } from '~/store/api/service-slice';
  import useRequestHandler from '~/hooks/use-request-handler';
  import { useNavigate } from 'react-router-dom';
  import ServicePromoCodes from './ServicePromoCodes/ServicePromoCodes';
  
  type PropType = {
    service: Service;
    company: Company;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  };
  
  const ServiceInfo = ({ service, company, setEdit }: PropType) => {
    const { user } = useAppSelector((state) => state.profile);
    const serviceTitle = `${service.name} by ${company.name}`;
    const e = GET_DISPLAY_SERVICE(service);
    const tags = [e.format.name, e.theme.name];
  
    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  
    const navigate = useNavigate();
    const [deleteService, { isLoading: isDeleteLoading }] = useDeleteServiceMutation();
    const { onOpen: onOpenDelete, onClose: onCloseDelete, isOpen: isOpenDelete } = useDisclosure();
  
    const { handler: deleteHandler } = useRequestHandler<number>({
      f: deleteService,
      successMsg: "You've successfully deleted the service",
      successF: () => {
        navigate('/');
      },
    });
  
    const { data, isFetching: isVisitorFetching } = useGetServicesQuery({
      id: service.id,
      userId: Number(user.id),
    });
  
    const isVisitor = data?.services?.length !== 0;
  
    const isEnded = Number(new Date()) - Number(new Date(service.date)) > 0;
    const isPublished = Number(new Date()) - Number(new Date(service.publishDate)) > 0;
  
    const [address, setAddress] = useState('');
  
    useEffect(() => {
      Geocode.fromLatLng(service.latitude.toString(), service.longitude.toString()).then(
        (response) => {
          const address = response.results[0].formatted_address;
          setAddress(address);
        },
        (_error) => {
          setAddress('');
        },
      );
    }, []);
  
    const getTicketButtonText = () => {
      if (isVisitor) {
        return 'You already booked this service';
      }
      if (isEnded) {
        return 'Sales Ended';
      }
      if (!isPublished) {
        return 'Sales have not started';
      }
      return 'Book the service';
    };
  
    return (
      <Box>
        <Flex sx={styles.poster}>
          <Box sx={styles.blurBg(e.picturePath || FALLBACK_POSTER)}></Box>
          <Image
            sx={styles.image}
            src={e.picturePath}
            fallbackSrc={e.picturePath && e.id ? undefined : FALLBACK_POSTER}
            boxSize="full"
            objectFit="contain"
            alt="Service image"
          />
        </Flex>
        <Flex pt="8" justify="space-between" sx={styles.info}>
          <VStack spacing={4} align="flex-start" sx={styles.mainInfo}>
            <Text fontSize="lg">{e.shortDate}</Text>
            <Heading fontSize={{ base: '3xl', md: '5xl' }}>{serviceTitle.toUpperCase()}</Heading>
            <Text fontSize="xl">{e.description}</Text>
            <HStack spacing="4">
              {tags.map((t, i) => (
                <Tag size="lg" key={i} colorScheme="purple">
                  {t}
                </Tag>
              ))}
            </HStack>
          </VStack>
          <VStack spacing={4} sx={styles.price}>
            <Wrap spacing="4" w="100%" justify="flex-end">
              <Tag size="lg" variant="subtle" colorScheme={e.tickets ? 'blue' : 'red'} px="4" py="2">
                <TagLeftIcon boxSize="6" as={FiUsers} />
                <TagLabel pl="2">{e.availability}</TagLabel>
              </Tag>
              <ServiceVisitors service={service} />
            </Wrap>
            <Card p={{ base: '4', sm: '10' }} variant="filled" w="100%">
              <Flex flexDir="column" justify="center" w="100%">
                <Text fontSize="3xl" fontWeight="semibold" textAlign="center">
                  {e.price}
                </Text>
                <Button
                  isLoading={isVisitorFetching}
                  onClick={onFormOpen}
                  isDisabled={!e.tickets || isVisitor || isEnded || !isPublished}
                  size="lg"
                  colorScheme="blue"
                  mt="4"
                >
                  {getTicketButtonText()}
                </Button>
                <ServiceSubscribe isOpen={isFormOpen} onClose={onFormClose} service={service} />
              </Flex>
            </Card>
  
            {Number(user.id) === company.userId && (
              <HStack spacing={4} alignSelf="flex-end">
                {!!Number(service.price) && <ServicePromoCodes service={service} />}
                <Button onClick={() => setEdit(true)} leftIcon={<EditIcon />}>
                  Edit
                </Button>
                <ConfirmPopover
                  header="Are you sure you want to delete the service?"
                  trigger={
                    <Button
                      onClick={onOpenDelete}
                      leftIcon={<DeleteIcon />}
                      colorScheme="red"
                      isLoading={isDeleteLoading}
                    >
                      Delete
                    </Button>
                  }
                  onConfirm={() => {
                    deleteHandler(service.id);
                  }}
                  isOpen={isOpenDelete}
                  onClose={onCloseDelete}
                />
              </HStack>
            )}
          </VStack>
        </Flex>
        <Flex pt="8" flexDir="column" sx={styles.mainInfo}>
          <Flex sx={styles.dateNLocation}>
            <Card p={{ base: '4', sm: '6' }} variant="outline" minW="270px">
              <HStack spacing="6">
                <Icon color="tertiary" w="8" h="8" as={FiCalendar} />
                <VStack align="flex-start">
                  <Heading fontSize="2xl">Date and time</Heading>
                  <Text>{e.date}</Text>
                </VStack>
              </HStack>
            </Card>
            <Card sx={styles.location} variant="outline">
              <HStack spacing="6" align="center" h="100%">
                <Icon color="tertiary" w="8" h="8" as={FiMapPin} />
                <VStack align="flex-start">
                  <Heading fontSize="2xl">Location</Heading>
                  <Text>{address ? address : 'Check the map'}</Text>
                </VStack>
              </HStack>
            </Card>
          </Flex>
          <Flex pt="8" justify="center">
            <GoogleMap text={`${e.name}, ${address}`} lat={e.latitude} lng={e.longitude} />
          </Flex>
        </Flex>
      </Box>
    );
  };
  
  export default ServiceInfo;
  