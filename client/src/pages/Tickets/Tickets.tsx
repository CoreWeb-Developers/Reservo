import Container from '~/components/Container';
import { useAppSelector } from '~/hooks/use-app-selector';
import ServiceList from '../Home/Services/ServiceList';

const Tickets = () => {
  const { user } = useAppSelector((state) => state.profile);

  return (
    <Container>
      <ServiceList dateRange={null} userId={Number(user.id)} />
    </Container>
  );
};

export default Tickets;
