// src/db/groupDb.ts
import sqlite3 from 'sqlite3';
import type GroupInterface from '@/types/GroupInterface';
sqlite3.verbose();

// 1. Функция для получения ВСЕХ групп
export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM groups', [], (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows as GroupInterface[]);
    });
  });
};

// 2. Функция для получения ОДНОЙ группы по ID (если нужна в [id]/route.ts)
export const getGroupByIdDb = async (id: number): Promise<GroupInterface | null> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM groups WHERE id = ?', [id], (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row ? (row as GroupInterface) : null);
    });
  });
};

// 3. Функция для добавления группы (уже должна быть)
export const addGroupDb = async (group: Omit<GroupInterface, 'id'>): Promise<GroupInterface> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO groups (name, description) VALUES (?, ?)';
    db.run(sql, [group.name, group.description || null], function (err) {
      if (err) {
        db.close();
        reject(err);
        return;
      }
      const selectSql = 'SELECT * FROM groups WHERE id = ?';
      db.get(selectSql, [this.lastID], (selectErr, row) => {
        db.close();
        if (selectErr) reject(selectErr);
        else resolve(row as GroupInterface);
      });
    });
  });
};

// 4. Функция для удаления группы по ID
export const deleteGroupDb = async (id: number): Promise<boolean> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM groups WHERE id = ?', [id], function (err) {
      db.close();
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};