import type GroupInterface from '@/types/GroupInterface';
import styles from './GroupItem.module.scss';

interface Props {
  group: GroupInterface;
  onDelete: (groupId: number) => void;
}

const GroupItem = ({ group, onDelete }: Props): React.ReactElement => {
  const handleDelete = (): void => {
    onDelete(group.id);
  };

  return (
    <div className={styles.GroupItem}>
      <div className={styles.groupHeader}>
        <h3 className={styles.groupName}>{group.name}</h3>
        <button 
          className={styles.deleteButton}
          onClick={handleDelete}
          title="Удалить группу"
        >
          ×
        </button>
      </div>
      
      {group.contacts && (
        <div className={styles.contacts}>
          <strong>Контакты:</strong> {group.contacts}
        </div>
      )}
      
      <div className={styles.studentsInfo}>
        <strong>Студентов:</strong> {group.students?.length || 0}
      </div>
      
      {group.students && group.students.length > 0 && (
        <div className={styles.studentsList}>
          <strong>Студенты:</strong>
          <ul>
            {group.students.map(student => (
              <li key={student.id}>
                {student.lastName} {student.firstName} {student.middleName}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className={styles.groupFooter}>
        <span>ID: {group.id}</span>
        <span>{group.students?.length || 0} студ.</span>
      </div>
    </div>
  );
};

export default GroupItem;