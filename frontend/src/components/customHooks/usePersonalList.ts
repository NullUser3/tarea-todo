import { useEffect, useState } from "react";
import { z } from "zod";
import { apiClient, useAuth } from "../../context/AuthContext";
import { useMenu } from "../sidebar/List/MenuProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
export const listSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  color: z.string().regex(new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")),
  position: z.number(),
  taskCount: z.number(),
});

export type ListTypes = z.infer<typeof listSchema>;
////////////////////////////////////////

export const addListSchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")),
});

export type AddListTypes = z.infer<typeof addListSchema>;

export const usePersonalList = () => {
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<ListTypes[]>([]);
  const { accessToken } = useAuth();
  const { setOpenAdd, setOpenEdit } = useMenu();
  const navigate = useNavigate();

  async function getLists() {
    const response = await apiClient.get("/api/list/getPersonalLists", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Explicitly add the token
      },
    });
    return response.data;
  }
  const getListsQuery = useQuery({
    queryKey: ["personalLists"],
    queryFn: () => getLists(),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (getListsQuery.data) setItems(getListsQuery.data);
  }, [getListsQuery.data]);

  ///////////////////////////////////////////////////////////////

  async function addLists(data: AddListTypes) {
    try {
      const response = await apiClient.post(
        "/api/list/createPersonalList",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Explicitly add the token
          },
        }
      );
      setOpenAdd(false);
      setItems((prev) => [
        ...prev,
        {
          id: response.data.id,
          name: response.data.name,
          color: response.data.color,
          position: prev.length,
          taskCount: 0,
        },
      ]);
      return response.data;
    } catch (e) {
      setError(e as Error);
    }
  }

  //////////////////////////////////////////////////////////////////
  const editLists = async ({
    id,
    data,
  }: {
    id: string;
    data: AddListTypes;
  }) => {
    const response = await apiClient.put(
      `/api/list/editPersonalList/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Explicitly add the token
        },
      }
    );

    return response.data;
  };

  const editListsMutation = useMutation({
    mutationFn: editLists,
    onSuccess: (updatedItem) => {
      setOpenEdit(false);
      setItems((prev) =>
        prev.map((items) =>
          items.id === updatedItem.id
            ? {
                ...items, // Keep other properties
                name: updatedItem.name, // Update name
                color: updatedItem.color, // Update color
                // (No need to update position/taskCount unless changed)
              }
            : items
        )
      );
    },
    onError: (error) => {
      setError(error as Error);
    },
  });

  ////////////////////////////////////////////////////////////////
  const handleDelete = async (id: string) => {
    try {
      setItems((prev) => prev.filter((item) => item.id !== id)); // Optimistic UI
      await apiClient.delete(`api/list/deletePersonalList/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      navigate("/allTasks");
    } catch (err) {
      console.error("Delete failed", err);
      // Optionally refetch
    }
  };

  return {
    error,
    addLists,
    items,
    setItems,
    handleDelete,
    getListsCall: getListsQuery.data,
    loadingLists: getListsQuery.isLoading,
    editListCall: editListsMutation.mutate,
    editListsError: editListsMutation.error,
    editListsLoading: editListsMutation.isPending,
  };
};
