import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getGroupsApi, addGroupApi } from '@/api/groupsApi';
import type GroupInterface from '@/types/GroupInterface';

interface GroupsHookInterface {
  groups: GroupInterface[];
  addGroupMutate: (group: Omit<GroupInterface, 'id'>) => void;
}

const useGroups = (): GroupsHookInterface => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroupsApi(),
    enabled: true,
  });

  /**
   * Мутация добавления группы
   */
  const addGroupMutate = useMutation({
    mutationFn: async (group: Omit<GroupInterface, 'id'>) => addGroupApi(group),
    
    onMutate: async (newGroup: Omit<GroupInterface, 'id'>) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      
      const previousGroups = queryClient.getQueryData<GroupInterface[]>(['groups']);
      const updatedGroups = [...(previousGroups ?? [])];

      // Временно добавляем группу с временным ID
      const temporaryGroup: GroupInterface = {
        ...newGroup,
        id: Date.now(), // Временный ID, будет заменен на сервере
        students: [],
      };
      
      updatedGroups.push(temporaryGroup);
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      return { previousGroups, temporaryGroup };
    },
    
    onError: (err, variables, context) => {
      // В случае ошибки возвращаем предыдущие данные
      queryClient.setQueryData<GroupInterface[]>(['groups'], context?.previousGroups);
    },
    
    onSuccess: (newGroup: GroupInterface, variables, context) => {
      // Обновляем данные, заменяя временную группу на группу с реальным ID
      if (context?.temporaryGroup) {
        queryClient.setQueryData<GroupInterface[]>(['groups'], (oldGroups = []) => 
          oldGroups.map(group => 
            group.id === context.temporaryGroup.id ? newGroup : group
          )
        );
      }
    },
  });

  return {
    groups: data ?? [],
    addGroupMutate: addGroupMutate.mutate,
  };
};

export default useGroups;