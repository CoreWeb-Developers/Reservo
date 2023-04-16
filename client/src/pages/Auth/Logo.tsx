import { Heading } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { LOGO_FONT } from '~/consts/components';

const Logo = () => {
  return (
    <Heading fontSize="50px" color="secondary" mb="40px" fontFamily={LOGO_FONT}>
      <ReactRouterLink to="/">Reservo</ReactRouterLink>
    </Heading>
  );
};

export default Logo;
