import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '~/components/Container';
import Loader from '~/components/Loader/Loader';
import PageAlert from '~/components/PageAlert/PageAlert';
import { useLazyGetCompanyQuery } from '~/store/api/company-slice';
import { useGetServiceQuery } from '~/store/api/service-slice';
import { Company } from '~/types/company';
import IError from '~/types/error';
import CompanyServicesCarousel from './Carousel/CompanyServicesCarousel';
import SimilarServicesCarousel from './Carousel/ServicesCarousel';
import Comments from './Comments/Comments';
import CompanyInfo from './Info/CompanyInfo';
import ServiceInfo from './Info/ServiceInfo';
import ServiceUpdateForm from '~/pages/ServiceForms/ServiceUpdate/ServiceUpdateForm';

const ServicePage = () => {
  const { id } = useParams();
  const { data: service, isLoading: isLoadingService, error } = useGetServiceQuery(Number(id));
  const [getCompany, { data: company, isLoading: isLoadingCompany }] = useLazyGetCompanyQuery();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (service && service.id) {
      getCompany(service.companyId);
    }
  }, [service]);

  if (isLoadingService || isLoadingCompany || ((!service || !company) && !error)) {
    return <Loader />;
  }

  if (error) {
    return <PageAlert status="error" message={(error as IError).data.message} />;
  }

  return (
    <>
      {isEdit ? (
        <ServiceUpdateForm service={service} setEdit={setIsEdit} />
      ) : (
        <Container pb="16">
          <ServiceInfo service={service} company={company as Company} setEdit={setIsEdit}></ServiceInfo>
          <CompanyInfo company={company as Company}></CompanyInfo>
          <Comments serviceId={service.id} />
          <SimilarServicesCarousel serviceId={service.id} serviceFormatId={service.formatId} serviceThemeId={service.themeId} />
          <CompanyServicesCarousel serviceId={service.id} companyId={service.companyId} />
        </Container>
      )}
    </>
  );
};

export default ServicePage;
