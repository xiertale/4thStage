import type GroupInterface from '@/types/GroupInterface';
import styles from './GroupItem.module.scss';

interface Props {
  group: GroupInterface;
  onDelete: (groupId: number) => void;
  isDeleting?: boolean;
}

const GroupItem = ({ group, onDelete, isDeleting }: Props): React.ReactElement => {
  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onDelete(group.id);
  };

  return (
    <div className={`${styles.GroupItem} ${isDeleting ? styles.deleting : ''}`}>
      <div className={styles.groupHeader}>
        <div className={styles.groupInfo}>
          <h3 className={styles.groupName}>{group.name}</h3>
          {group.contacts && (
            <div className={styles.groupContacts}>
              <span className={styles.contactLabel}>Контакты:</span>
              <span className={styles.contactValue}>{group.contacts}</span>
            </div>
          )}
        </div>
        
        <button 
          className={styles.deleteButton}
          onClick={handleDelete}
          title="Удалить группу"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className={styles.deleteSpinner}></span>
          ) : (
            '×'
          )}
        </button>
      </div>
      
      <div className={styles.studentsSection}>
        <div className={styles.studentsCount}>
          <span className={styles.countLabel}>Студентов в группе:</span>
          <span className={styles.countValue}>{group.students?.length || 0}</span>
        </div>
        
        {group.students && group.students.length > 0 && (
          <div className={styles.studentsList}>
            <h4 className={styles.studentsTitle}>Список студентов:</h4>
            <ul className={styles.students}>
              {group.students.slice(0, 5).map(student => (
                <li key={student.id} className={styles.studentItem}>
                  <span className={styles.studentName}>
                    {student.lastName} {student.firstName} {student.middleName}
                  </span>
                  <span className={styles.studentContacts}>
                    {student.contacts}
                  </span>
                </li>
              ))}
              {group.students.length > 5 && (
                <li className={styles.moreStudents}>
                  и ещё {group.students.length - 5} студентов...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      <div className={styles.groupFooter}>
        <span className={styles.groupId}>ID: {group.id}</span>
        <span className={styles.studentsBadge}>
          {group.students?.length || 0} студ.
        </span>
      </div>
    </div>
  );
};

export default GroupItem;