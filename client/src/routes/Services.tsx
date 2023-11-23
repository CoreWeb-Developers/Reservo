import { Route, Routes, Navigate } from 'react-router-dom';
import ServicePage from '~/pages/ServicePage/ServicePage';
import ServiceCreateForm from '~/pages/ServiceForms/ServiceCreate/ServiceCreateForm';
import ProtectedRoute from '~/components/ProtectedRoute/ProtectedRoute';
import NotFound from '~/pages/NotFound/NotFound';

const ServiceRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="/" />} />
    <Route path="/:id" element={<ServicePage />}></Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/create" element={<ServiceCreateForm />} />
    </Route>
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default ServiceRoutes;
