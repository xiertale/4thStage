import type GroupInterface from '@/types/GroupInterface';

export const getGroupsApi = async (): Promise<GroupInterface[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}groups`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const groups = await response.json() as GroupInterface[];
    return groups;
  } catch (err) {
    console.log('>>> getGroupsApi', err);
    return [] as GroupInterface[];
  }
};

export const addGroupApi = async (group: Omit<GroupInterface, 'id'>): Promise<GroupInterface> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(group),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const newGroup = await response.json() as GroupInterface;
    return newGroup;
  } catch (err) {
    console.log('>>> addGroupApi', err);
    throw err;
  }
};

export const deleteGroupApi = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}groups?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const result = await response.json() as { success: boolean };
    return result.success;
  } catch (err) {
    console.log('>>> deleteGroupApi', err);
    throw err;
  }
};