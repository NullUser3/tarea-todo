import { useQuery } from "@tanstack/react-query";
import { apiClient, useAuth } from "../../context/AuthContext";
import { ListTypes } from "./usePersonalList";
import { useNavigate } from "react-router-dom";
export const useGetPersonalList = (id: string | undefined) => {
  const navgiate = useNavigate();
  const { accessToken } = useAuth();
  async function getList(id: string): Promise<ListTypes> {
    const response = await apiClient.get(`/api/list/getPersonalList/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Explicitly add the token
      },
    });
    return response.data;
  }

  const getListQuery = useQuery({
    queryKey: ["personalList", id],
    queryFn: () => {
      if (!id) {
        navgiate("/");
        return Promise.reject(new Error("redirected"));
      }
      return getList(id);
    },
    enabled: !!accessToken && !!id,
  });

  return {
    data: getListQuery.data,
    isLoading: getListQuery.isLoading,
    isError: getListQuery.isError,
    error: getListQuery.error,
    refetch: getListQuery.refetch,
  };
};
