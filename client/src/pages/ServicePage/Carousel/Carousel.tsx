import { ReactNode } from 'react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import ServiceCard from '~/components/ServiceCard/ServiceCard';
import ServiceCardSkeleton from '~/components/ServiceCard/ServiceCardSkeleton';
import { Service } from '~/types/service';

type Props = {
  isFetching: boolean;
  events: Service[] | null;
};

const Carousel = ({ isFetching, events }: Props) => {
  let content: ReactNode;
  if (isFetching) {
    content = (
      <>
        <SwiperSlide>
          <ServiceCardSkeleton />
        </SwiperSlide>
        <SwiperSlide>
          <ServiceCardSkeleton />
        </SwiperSlide>
        <SwiperSlide>
          <ServiceCardSkeleton />
        </SwiperSlide>
      </>
    );
  } else if (events) {
    content = events.map((e) => (
      <SwiperSlide key={e.id}>
        <ServiceCard event={e} />
      </SwiperSlide>
    ));
  }

  return (
    <Swiper
      // navigation={true}
      modules={[Navigation, Pagination]}
      cssMode={true}
      pagination={{
        clickable: true,
      }}
      breakpoints={{
        300: {
          spaceBetween: 30,
          slidesPerView: 1,
        },
        680: {
          spaceBetween: 30,
          slidesPerView: 2,
        },
        1280: {
          spaceBetween: 20,
          slidesPerView: 3,
        },
      }}
    >
      {content}
    </Swiper>
  );
};

export default Carousel;
