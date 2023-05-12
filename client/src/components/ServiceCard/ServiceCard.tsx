import { Avatar, Box, Card, CardBody, CardProps, Flex, Heading, Image, Stack, Tag, Text, Wrap } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useGetCompanyQuery } from '~/store/api/company-slice';
import { Service } from '~/types/service';
import styles from './service-card.styles';
import { AVATAR_PATH } from '~/consts/avatar';
import { DateFormatOptions } from '~/consts/service';
import { useState, useEffect } from 'react';
import Geocode from '~/consts/geocode';
import getFormatAddress from './format-address';

type Props = {
  service: Service;
  isTicket?: boolean;
} & CardProps;

const PriceFormatOptions = {
  style: 'currency',
  currency: 'KES',
} as const;

const ServiceCard = ({ service, isTicket = false, ...cardProps }: Props) => {
  const { data: company } = useGetCompanyQuery(service.companyId);
  const date = new Intl.DateTimeFormat('en-US', DateFormatOptions).format(new Date(service.date));
  const price = Number(service.price) ? new Intl.NumberFormat('en-US', PriceFormatOptions).format(service.price) : 'free';
  const serviceUrl = `/services/${service.id}`;

  const [address, setAddress] = useState('');

  useEffect(() => {
    Geocode.fromLatLng(service.latitude.toString(), service.longitude.toString()).then(
      (response) => {
        const address = getFormatAddress(response.results[0].address_components);
        setAddress(address);
      },
      (_error) => {
        setAddress('');
      },
    );
  }, []);

  return (
    <Card sx={styles.card} variant="outline" {...cardProps}>
      <ReactRouterLink to={serviceUrl}>
        <Flex w="100%" h="155px" overflow="hidden" alignItems="center" justifyContent="center">
          <Image
            sx={styles.img}
            src={AVATAR_PATH(service.picturePath)}
            fallbackSrc="https://via.placeholder.com/668x400?text=Poster"
            alt={service.name}
          />
        </Flex>
      </ReactRouterLink>

      <CardBody>
        <Stack spacing="2">
          <ReactRouterLink to={serviceUrl}>
            <Heading as="h3" noOfLines={2} fontSize="18px">
              {service.name}
            </Heading>
          </ReactRouterLink>

          <Wrap spacing="10px">
            <Tag sx={styles.tag}>{service.theme.name}</Tag>
            <Tag sx={styles.tag}>{service.format.name}</Tag>
          </Wrap>

          <Text sx={styles.date}>{date}</Text>

          {address && <Text sx={styles.address}>{address}</Text>}

          {!isTicket && (
            <Box sx={styles.price}>
              <Text>Tickets left: {service.ticketsAvailable}</Text>
              <Text>{price}</Text>
            </Box>
          )}

          <Box sx={styles.company} noOfLines={1}>
            By{' '}
            <ReactRouterLink to={`/companies/${company?.id}`}>
              <Avatar size="xs" ml="3px" name={company?.name} src={AVATAR_PATH(company?.picturePath)} />{' '}
              <Text as="span" fontWeight="medium">
                {company?.name}
              </Text>
            </ReactRouterLink>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ServiceCard;
