import type GroupInterface from '@/types/GroupInterface';
import styles from './GroupItem.module.scss';

interface GroupItemProps {
  group: GroupInterface;
  onDelete: (groupId: number) => void;
}

const GroupItem = ({ group, onDelete }: GroupItemProps): React.ReactElement => {
  const handleDelete = (): void => {
    onDelete(group.id);
  };

  return (
    <div className={styles.GroupItem} style={{ opacity: group.isDeleted ? 0.5 : 1 }}>
      <div className={styles.content}>
        <h3 className={styles.title}>{group.name}</h3>
        {group.description && <p className={styles.description}>{group.description}</p>}
        <div className={styles.info}>
          <span>ID: {group.id}</span>
          {group.uuid && <span>UUID: {group.uuid}</span>}
        </div>
      </div>
      <button 
        className={styles.deleteButton} 
        onClick={handleDelete}
        disabled={group.isDeleted}
      >
        Удалить
      </button>
    </div>
  );
};

export default GroupItem;