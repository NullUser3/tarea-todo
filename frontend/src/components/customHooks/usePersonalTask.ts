import { z } from "zod";
import { apiClient, useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  reminderAt: z.string().datetime().optional().nullable(),
  listId: z.string().uuid().optional(),
  recurrenceRule: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
  nextRecurrence: z.string().datetime().optional().nullable(),
});

export type CreateTaskType = z.infer<typeof CreateTaskSchema>;
//////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
export const TaskResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string().datetime().nullable(),
  reminderAt: z.string().datetime().nullable(),
  listId: z.string().uuid().nullable(),
  listName: z.string().nullable(),
  recurrenceRule: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).nullable(),
  nextRecurrence: z.string().datetime().nullable(),
  position: z.number(),
  createdAt: z.string().datetime(),
  isCompleted: z.boolean(),
});

export type TaskResponseType = z.infer<typeof TaskResponseSchema>;
//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
export const EditTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  reminderAt: z.string().datetime().optional().nullable(),
  listId: z.string().uuid().optional(),
  recurrenceRule: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
  nextRecurrence: z.string().datetime().optional().nullable(),
  isCompleted: z.boolean().optional(),
});

export type EditTaskType = z.infer<typeof EditTaskSchema>;

export const usePersonalTask = () => {
  const { accessToken } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [tasks, setTasks] = useState<TaskResponseType[] | null>(null);
  const [allTasks, setAllTasks] = useState<TaskResponseType[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getPersonalTasks({ listId }: { listId: string }) {
    const response = await apiClient.post(
      "/api/task/getTasksFromList",
      { listId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Explicitly add the token
        },
      }
    );
    return response.data;
  }
  const getPersonalTasksMutation = useMutation({
    mutationFn: getPersonalTasks,
    onSuccess: (data) => {
      setTasks(data);
    },
    onError: (error) => {
      setError(error as Error);
    },
  });

  ///////////// create personal tasks /////////////////////////

  async function createPersonalTask(data: CreateTaskType) {
    const response = await apiClient.post(
      "/api/task/createPersonalTask",
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Explicitly add the token
        },
      }
    );
    return response.data;
  }

  const createTaskMutation = useMutation({
    mutationFn: createPersonalTask,
    onSuccess: (data) => {
      setTasks((prev) => [
        ...(prev ?? []),
        {
          id: data.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          reminderAt: data.reminderAt,
          listId: data.listId,
          listName: data.listName,
          recurrenceRule: data.recurrenceRule,
          nextRecurrence: data.nextRecurrence,
          position: data.position,
          createdAt: data.createdAt,
          isCompleted: data.isCompleted,
        },
      ]);
      setAllTasks((prev) => [
        ...(prev ?? []),
        {
          id: data.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          reminderAt: data.reminderAt,
          listId: data.listId,
          listName: data.listName,
          recurrenceRule: data.recurrenceRule,
          nextRecurrence: data.nextRecurrence,
          position: data.position,
          createdAt: data.createdAt,
          isCompleted: data.isCompleted,
        },
      ]);
    },
    onError: (error) => {
      console.log("error from api call:", error);
      setError(error as Error);
    },
  });

  ///////////// update task //////////////////////////
  const editTasks = async ({
    id,
    data,
  }: {
    id: string;
    data: EditTaskType;
  }) => {
    const response = await apiClient.put(`/api/task/updateTask/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Explicitly add the token
      },
    });

    return response.data;
  };

  const editTasksMutation = useMutation({
    mutationFn: editTasks,
    onSuccess: (updatedItem) => {
      setTasks((prev) => {
        if (!prev) return prev;

        return prev.map((items) =>
          items.id === updatedItem.id
            ? {
                ...items,
                title: updatedItem.title,
                description: updatedItem.description,
                dueDate: updatedItem.dueDate,
                reminderAt: updatedItem.reminderAt,
                listId: updatedItem.listId,
                recurrenceRule: updatedItem.recurrenceRule,
                nextRecurrence: updatedItem.nextRecurrence,
                isCompleted: updatedItem.isCompleted,
              }
            : items
        );
      });
      setAllTasks((prev) => {
        if (!prev) return prev;

        return prev.map((items) =>
          items.id === updatedItem.id
            ? {
                ...items,
                title: updatedItem.title,
                description: updatedItem.description,
                dueDate: updatedItem.dueDate,
                reminderAt: updatedItem.reminderAt,
                listId: updatedItem.listId,
                recurrenceRule: updatedItem.recurrenceRule,
                nextRecurrence: updatedItem.nextRecurrence,
                isCompleted: updatedItem.isCompleted,
              }
            : items
        );
      });
    },
    onError: (error) => {
      setError(error as Error);
    },
  });

  ///////////////////// task delete ///////////////////////////////

  const handleTaskDelete = async (id: string) => {
    try {
      setTasks((prev) => {
        if (!prev) return prev;
        return prev.filter((item) => item.id !== id);
      });
      setAllTasks((prev) => {
        if (!prev) return prev;
        return prev.filter((item) => item.id !== id);
      });
      await apiClient.delete(`/api/task/deleteTask/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  //////////////////////////////////////////////////////////
  const getAllTasks = async () => {
    const response = await apiClient.get("/api/task/getAllTasks", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data; // Update state with fetched tasks
  };

  const getTasksQuery = useQuery({
    queryKey: ["personalTasks"],
    queryFn: () => getAllTasks(),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (getTasksQuery.data) {
      setAllTasks(getTasksQuery.data);
    }
  }, [getTasksQuery.data]);

  return {
    allTasks,
    getTasksQuery,
    setAllTasks,
    isLoading,
    editTask: editTasksMutation.mutateAsync,
    editTaskError: editTasksMutation.error,
    handleTaskDelete,
    createPersonalTaskMutation: createTaskMutation.mutateAsync,
    createPersonalTaskError: createTaskMutation.error,
    tasks,
    setTasks,
    PersonalTasksResponse: getPersonalTasksMutation.data,
    PersonalTasksMutate: getPersonalTasksMutation.mutate,
  };
};
