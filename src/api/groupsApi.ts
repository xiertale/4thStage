import type GroupInterface from '@/types/GroupInterface';

const API_BASE = process.env.NEXT_PUBLIC_API || '/api/';

export const getGroupsApi = async (): Promise<GroupInterface[]> => {
  try {
    const response = await fetch(`${API_BASE}groups`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const groups = await response.json() as GroupInterface[];
    return groups;
  }
  catch (err) {
    console.log('>>> getGroupsApi', err);
    return [] as GroupInterface[];
  }
};

export const addGroupApi = async (group: Omit<GroupInterface, 'id'>): Promise<GroupInterface> => {
  try {
    const response = await fetch(`${API_BASE}groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    return response.json() as Promise<GroupInterface>;
  }
  catch (err) {
    console.log('>>> addGroupApi', err);
    throw err;
  }
};

export const deleteGroupApi = async (groupId: number): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE}groups/${groupId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }

    return groupId;
  }
  catch (err) {
    console.log('>>> deleteGroupApi', err);
    return -1;
  }
};

// Дополнительные функции, если нужны
export const updateGroupApi = async (group: GroupInterface): Promise<GroupInterface> => {
  try {
    const response = await fetch(`${API_BASE}groups/${group.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    return response.json() as Promise<GroupInterface>;
  }
  catch (err) {
    console.log('>>> updateGroupApi', err);
    throw err;
  }
};

export const getGroupByIdApi = async (id: string): Promise<GroupInterface | null> => {
  try {
    const response = await fetch(`${API_BASE}groups/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  }
  catch (error) {
    console.error('Error fetching group:', error);
    return null;
  }
};