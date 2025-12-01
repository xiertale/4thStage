import sqlite3 from 'sqlite3';
import type GroupInterface from '@/types/GroupInterface';

sqlite3.verbose();

export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const groups = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM `group`'; // Обратные кавычки, если `group` - зарезервированное слово
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      resolve(rows);
      db.close();
    });
  });

  return groups as GroupInterface[];
};

export const addGroupDb = async (group: Omit<GroupInterface, 'id'>): Promise<GroupInterface> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const newGroup = await new Promise((resolve, reject) => {
    const sql = 'INSERT INTO `group` (name, description) VALUES (?, ?)';
    db.run(sql, [group.name, group.description || null], function (err) {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      
      // Получаем ID вставленной записи
      const insertedId = this.lastID;
      
      // Теперь получаем полную запись
      const selectSql = 'SELECT * FROM `group` WHERE id = ?';
      db.get(selectSql, [insertedId], (selectErr, row) => {
        if (selectErr) {
          reject(selectErr);
          db.close();
          return;
        }
        resolve(row);
        db.close();
      });
    });
  });

  return newGroup as GroupInterface;
};

export const deleteGroupDb = async (groupId: number): Promise<boolean> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const result = await new Promise<boolean>((resolve, reject) => {
    const sql = 'DELETE FROM `group` WHERE id = ?';
    db.run(sql, [groupId], function (err) {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      
      // Если affectedRows > 0, значит удаление успешно
      resolve(this.changes > 0);
      db.close();
    });
  });

  return result;
};