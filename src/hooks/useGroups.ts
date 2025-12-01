import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getGroupsApi, addGroupApi, deleteGroupApi } from '@/api/groupsApi';
import type GroupInterface from '@/types/GroupInterface';

interface GroupsHookInterface {
  groups: GroupInterface[];
  addGroupMutate: (group: Omit<GroupInterface, 'id'>) => void;
  deleteGroupMutate: (groupId: number) => void;
  isAdding: boolean;
  isDeleting: boolean;
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
  const addGroupMutation = useMutation({
    mutationFn: async (group: Omit<GroupInterface, 'id'>) => addGroupApi(group),
    
    onMutate: async (newGroup: Omit<GroupInterface, 'id'>) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      
      const previousGroups = queryClient.getQueryData<GroupInterface[]>(['groups']);
      const updatedGroups = [...(previousGroups ?? [])];

      // Временно добавляем группу с временным ID
      const temporaryGroup: GroupInterface = {
        ...newGroup,
        id: Date.now(),
        students: [],
      };
      
      updatedGroups.push(temporaryGroup);
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      return { previousGroups, temporaryGroup };
    },
    
    onError: (err, variables, context) => {
      console.error('Error adding group:', err);
      queryClient.setQueryData<GroupInterface[]>(['groups'], context?.previousGroups);
    },
    
    onSuccess: (newGroup: GroupInterface, variables, context) => {
      if (context?.temporaryGroup) {
        queryClient.setQueryData<GroupInterface[]>(['groups'], (oldGroups = []) => 
          oldGroups.map(group => 
            group.id === context.temporaryGroup.id ? newGroup : group
          )
        );
      }
    },
  });

  /**
   * Мутация удаления группы
   */
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: number) => deleteGroupApi(groupId),
    
    onMutate: async (groupId: number) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      
      const previousGroups = queryClient.getQueryData<GroupInterface[]>(['groups']);
      let updatedGroups = [...(previousGroups ?? [])];

      if (!updatedGroups) return;

      updatedGroups = updatedGroups.map((group: GroupInterface) => ({
        ...group,
        ...(group.id === groupId ? { isDeleting: true } : {}),
      }));
      
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      return { previousGroups };
    },
    
    onError: (err, variables, context) => {
      console.error('Error deleting group:', err);
      queryClient.setQueryData<GroupInterface[]>(['groups'], context?.previousGroups);
    },
    
    onSuccess: async (groupId, variables, context) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      
      if (!context?.previousGroups) {
        return;
      }
      
      const updatedGroups = context.previousGroups.filter((group: GroupInterface) => group.id !== groupId);
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      // Инвалидируем кэш студентов
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    groups: data ?? [],
    addGroupMutate: addGroupMutation.mutate,
    deleteGroupMutate: deleteGroupMutation.mutate,
    isAdding: addGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
};

export default useGroups;