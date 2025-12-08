import { Group } from './entity/Group.entity';
import AppDataSource, { ensureInitialized } from './AppDataSource';
import type GroupInterface from '@/types/GroupInterface';
import sqlite3 from 'sqlite3';
sqlite3.verbose();

/**
 * Получение групп
 * @returns  Promise<GroupInterface[]>
 */
export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  await ensureInitialized();
  const groupRepository = AppDataSource.getRepository(Group);
  return await groupRepository.find({
    relations: ['students'],
  });
};

/**
 * Добавление группы
 * @returns  Promise<GroupInterface>
 */
export const addGroupDb = async (groupFields: Omit<GroupInterface, 'id'>): Promise<GroupInterface> => {
  await ensureInitialized();
  const groupRepository = AppDataSource.getRepository(Group);
  const group = new Group();
  const newGroup = await groupRepository.save({
    ...group,
    ...groupFields,
  });

  return newGroup;
};
export const deleteGroupDb = async (id: number): Promise<boolean> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web-orm.db');
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM groups WHERE id = ?', [id], function (err) {
      db.close();
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};
