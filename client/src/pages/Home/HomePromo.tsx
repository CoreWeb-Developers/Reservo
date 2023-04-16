import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import Container from '~/components/Container';
import PromoWavesAnim from '~/components/SvgAnim/PromoWavesAnim';

const HomePromo = () => {
  return (
    <Box mb="60px">
      <Container>
        <Box bgColor="gray.100" borderRadius="20px" overflow="hidden">
          <Flex
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            pt={{ base: '40px', sm: '50px', md: '70px', lg: '100px' }}
            color="hover"
            px="40px"
            textAlign="center"
          >
            <Heading
              as="h1"
              textTransform="capitalize"
              fontSize={{ base: '28px', sm: '30px', lg: '36px' }}
              mb={{ base: '10px', sm: '0' }}
            >
              Boost Your Business with Our Freelancer & SMB Listing & Booking Platform!
            </Heading>
            <Text fontSize={{ base: '16px', sm: '18px', lg: '20px' }}>
            Showcase, Promote, and Book Services and Events with Ease!
            </Text>
          </Flex>
          <PromoWavesAnim width="100%" />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePromo;
