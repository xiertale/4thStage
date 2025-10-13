import sqlite3 from 'sqlite3';
import type StudentInterface from '@/types/StudentInterface';

sqlite3.verbose();

export const getStudentDb = async (): Promise<StudentInterface[]> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const students = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM student';
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

  return students as StudentInterface[];
};

export const deleteStudentDb = async (studentId: number): Promise<void> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  await new Promise<void>((resolve, reject) => {
    const sql = 'DELETE FROM student WHERE id = ?';
    db.run(sql, [studentId], function (err) {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      resolve();
      db.close();
    });
  });
};
