import { useQuery, UseQueryOptions } from "react-query";
import { snRequest } from "../../helpers/request";
import { ServiceNowEndpoint } from "../endpoint";
import { APIErrorResponse, ServiceNowUser } from "../types.interface";

export type GetUserQueryResponse = ServiceNowUser;
export type GetUserQueryOptions = UseQueryOptions<
  GetUserQueryFunc,
  APIErrorResponse,
  GetUserQueryResponse
>;
export type GetUserQueryFunc = () => GetUserQueryResponse;

export function useGetUserQuery(email: string, options?: GetUserQueryOptions) {
  return useQuery<GetUserQueryFunc, APIErrorResponse, GetUserQueryResponse>({
    queryKey: ["useGetUserQuery", email],
    queryFn: () =>
      snRequest
        .get(ServiceNowEndpoint.incident.listUser, {
          params: {
            sysparm_query: "email=" + email,
          },
        })
        .then((res) => res.data.result[0]),
    ...options,
  });
}
