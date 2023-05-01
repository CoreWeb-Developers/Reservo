import { Image } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

const Logo = () => {
  return (
    <ReactRouterLink to="/">
      <Image src="/public/assets/reservo_1.png" alt="Logo" maxW="120px" />
    </ReactRouterLink>
  );
};

export default Logo;
