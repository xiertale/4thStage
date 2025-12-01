import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addGroupApi, deleteGroupApi, getGroupsApi } from '@/api/groupsApi';
import type GroupInterface from '@/types/GroupInterface';

interface GroupsHookInterface {
  groups: GroupInterface[];
  deleteGroupMutate: (groupId: number) => void;
  addGroupMutate: (group: GroupInterface) => void;
}

const useGroups = (): GroupsHookInterface => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroupsApi(),
    enabled: true,
  });

  /**
   * Мутация удаления группы
   */
  const deleteGroupMutate = useMutation({
    // вызов API delete
    mutationFn: async (groupId: number) => deleteGroupApi(groupId),
    // оптимистичная мутация (обновляем данные на клиенте до API запроса delete)
    onMutate: async (groupId: number) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      // получаем данные из TanStackQuery
      const previousGroups = queryClient.getQueryData<GroupInterface[]>(['groups']);
      let updatedGroups = [...(previousGroups ?? [])];

      if (!updatedGroups) return;

      // помечаем удаляемую запись
      updatedGroups = updatedGroups.map((group: GroupInterface) => ({
        ...group,
        ...(group.id === groupId ? { isDeleted: true } : {}),
      }));
      // обновляем данные в TanStackQuery
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      console.log('deleteGroupMutate onMutate', previousGroups, updatedGroups);
      debugger;

      return { previousGroups, updatedGroups };
    },
    onError: (err, variables, context) => {
      console.log('deleteGroupMutate err', err);
      debugger;
      queryClient.setQueryData<GroupInterface[]>(['groups'], context?.previousGroups);
    },
    // обновляем данные в случае успешного выполнения mutationFn: async (groupId: number) => deleteGroupApi(groupId),
    onSuccess: async (success, groupId, context) => {
      console.log('deleteGroupMutate onSuccess', groupId);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['groups'] });
      
      // вариант 1 - запрос всех записей
      // refetch();

      // вариант 2 - удаление конкретной записи
      if (!context?.previousGroups) {
        return;
      }
      const updatedGroups = context.previousGroups.filter((group: GroupInterface) => group.id !== groupId);
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      // обновляем кэш студентов так как обновились группы
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    // onSettled: (data, error, variables, context) => {
    //   // вызывается после выполнения запроса в случаи удачи или ошибке
    //   console.log('>> deleteGroupMutate onSettled', data, error, variables, context);
    // },
  });

  /**
   * Мутация добавления группы
   */
  const addGroupMutate = useMutation({
    mutationFn: async (group: GroupInterface) => addGroupApi(group),

    onMutate: async (group: GroupInterface) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      // получаем данные из TanStackQuery
      const previousGroups = queryClient.getQueryData<GroupInterface[]>(['groups']);
      const updatedGroups = [...(previousGroups ?? [])];

      if (!updatedGroups) return;

      // добавляем временную запись
      updatedGroups.push({
        ...group,
        isNew: true,
      });
      // обновляем данные в TanStackQuery
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      return { previousGroups, updatedGroups };
    },
    onError: (err, variables, context) => {
      console.log('>>> addGroupMutate err', err);
      queryClient.setQueryData<GroupInterface[]>(['groups'], context?.previousGroups);
    },
    // обновляем данные в случае успешного выполнения mutationFn: async (group: GroupInterface) => addGroupApi(group)
    onSuccess: async (newGroup, variables, context) => {
      refetch();
      // обновляем кэш студентов так как обновились группы
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // await queryClient.cancelQueries({ queryKey: ['groups'] });

      // if (!context?.previousGroups) {
      //   queryClient.setQueryData<GroupInterface[]>(['groups'], [newGroup]);
      //   return;
      // }

      // const updatedGroupsNew = context.updatedGroups.map((group: GroupInterface) => ({
      //   ...(group.uuid === newGroup.uuid ? newGroup : group),
      // }));
      // queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroupsNew);
    },
  });

  return {
    groups: data ?? [],
    deleteGroupMutate: deleteGroupMutate.mutate,
    addGroupMutate: addGroupMutate.mutate,
  };
};

export default useGroups;