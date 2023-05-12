import { Box, Skeleton, SkeletonText } from '@chakra-ui/react';

const ServiceCardSkeleton = () => {
  return (
    <Box borderRadius="md" overflow="hidden">
      <Skeleton h="160px" />
      <SkeletonText mt="4" noOfLines={7} spacing="4" skeletonHeight="3" />
    </Box>
  );
};

export default ServiceCardSkeleton;
