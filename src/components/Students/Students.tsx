'use client';

import useGroups from '@/hooks/userStudents';
import type GroupInterface from '@/types/StudentInterface';
import styles from './Student.module.scss';
import StudentInterface from '@/types/StudentInterface';

const Students = (): React.ReactElement => {
  const { students } = useGroups();

  return (
    <div className={styles.Groups}>
      {students.map((student: StudentInterface) => (
        <h2 key={student.id}>
          {student.last_name}
        </h2>
      ))}
    </div>
  );
};

export default Students;
