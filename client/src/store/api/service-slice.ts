import { SubscriptionResponse, Service, ServicesParam, ServicesResponse } from '~/types/service';
import type { ISubscribe, ICreate, IUpdate } from '~/validation/service';
import { apiSlice } from './api-slice';

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<ServicesResponse, ServicesParam>({
      query: (queryParams) => ({
        url: `/services`,
        params: { ...queryParams },
      }),
      transformResponse(services: Service[], meta: any) {
        return { services, totalCount: Number(meta.response.headers.get('X-Total-Count')) };
      },
      providesTags: (result) => {
        const services = result?.services || [];
        return ['Service', ...services.map(({ id }) => ({ type: 'Service' as const, id }))];
      },
    }),
    getService: builder.query<Service, number>({
      query: (id) => `/services/${id}`,
      providesTags: (_result, _error, arg) => [{ type: 'Service' as const, id: arg }],
    }),
    createService: builder.mutation<Service, ICreate>({
      query: (body) => ({
        url: '/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation<Service, IUpdate & Pick<Service, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Service', id: arg.id }],
    }),
    deleteService: builder.mutation<Service, number>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['Service'],
    }),
    updateServicePoster: builder.mutation<Service, { form: FormData } & Pick<Service, 'id'>>({
      query: ({ id, form }) => ({
        url: `/services/${id}/poster`,
        method: 'PUT',
        body: form,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Service', id: arg.id }],
    }),
    deleteServicePoster: builder.mutation<void, number>({
      query: (id) => ({
        url: `/services/${id}/poster`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Service', id: arg }],
    }),
    checkoutForService: builder.mutation<SubscriptionResponse, ISubscribe & { id: number }>({
      query: ({ isVisible, promoCode, id }) => ({
        url: `/services/${id}/subscribe`,
        method: 'POST',
        body: { isVisible, promoCode },
      }),
      invalidatesTags: (_result, _error, arg) => [
        'Service',
        { type: 'Service' as const, id: arg.id },
        { type: 'ServiceSubscribers' as const, id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetServiceQuery,
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useUpdateServicePosterMutation,
  useDeleteServicePosterMutation,
  useCheckoutForServiceMutation,
} = extendedApiSlice;
