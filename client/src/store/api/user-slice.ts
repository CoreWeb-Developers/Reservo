import { User, UsersParam, UsersResponse, Service } from '~/types/user';
import { apiSlice } from './api-slice';

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, arg) => [{ type: 'User' as const, id: arg }],
    }),
    getUsers: builder.query<UsersResponse, UsersParam>({
      query: (params) => ({
        url: '/users',
        params,
      }),
      transformResponse(users: User[], meta: any) {
        return { users, totalCount: Number(meta.response.headers.get('X-Total-Count')) };
      },
      providesTags: (_result, _err, arg) => {
        const { eventId, companyId, serviceId } = arg;
        const type =
          (eventId && ('EventSubscribers' as const)) ||
          (companyId && ('CompanySubscribers' as const)) ||
          (serviceId && ('ServiceSubscribers' as const)) ||
          ('User' as const);
        const tag = {
          id: eventId || companyId || serviceId,
          type,
        };
        return [type, tag];
      },
    }),
    getService: builder.query<Service, number>({
      query: (id) => `/services/${id}`,
      providesTags: (_result, _error, arg) => [{ type: 'Service' as const, id: arg }],
    }),
  }),
});

export const { useGetUserQuery, useGetUsersQuery, useGetServiceQuery } = extendedApiSlice;
