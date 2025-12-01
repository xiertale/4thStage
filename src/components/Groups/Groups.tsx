'use client';

import { useState } from 'react';
import useGroups from '@/hooks/useGroups';
import type GroupInterface from '@/types/GroupInterface';
import styles from './Groups.module.scss';
import AddGroup, { type GroupFormFields } from './AddGroup/AddGroup';
import GroupItem from './GroupItem/GroupItem';

const Groups = (): React.ReactElement => {
  const {
    groups,
    addGroupMutate,
    deleteGroupMutate,
    isAdding,
    isDeleting,
  } = useGroups();

  const [isAddingGroup, setIsAddingGroup] = useState(false);

  /**
   * Удаление группы - обработчик события нажатия "удалить"
   * @param groupId Ид группы
   */
  const onDeleteHandler = (groupId: number): void => {
    if (confirm('Вы уверены, что хотите удалить эту группу?')) {
      console.log('Удаление группы с ID:', groupId);
      deleteGroupMutate(groupId);
    }
  };

  /**
   * Добавление группы - обработчик события нажатия "добавить"
   * @param groupFormField Форма группы
   */
  const onAddHandler = (groupFormField: GroupFormFields): void => {
    console.log('Добавление группы:', groupFormField);
    
    addGroupMutate({
      ...groupFormField,
      students: [],
    });
    
    setIsAddingGroup(false);
  };

  /**
   * Отмена добавления группы
   */
  const onCancelAddHandler = (): void => {
    setIsAddingGroup(false);
  };

  return (
    <div className={styles.Groups}>
      <div className={styles.header}>
        <h1 className={styles.title}>Группы</h1>
        <p className={styles.subtitle}>Всего групп: {groups.length}</p>
      </div>

      <div className={styles.actions}>
        {!isAddingGroup ? (
          <button 
            className={styles.addButton}
            onClick={() => setIsAddingGroup(true)}
            disabled={isAdding}
          >
            {isAdding ? 'Добавление...' : '+ Добавить группу'}
          </button>
        ) : (
          <div className={styles.addFormContainer}>
            <AddGroup 
              onAdd={onAddHandler} 
              onCancel={onCancelAddHandler}
            />
          </div>
        )}
      </div>

      {isDeleting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingText}>Удаление группы...</div>
        </div>
      )}

      {groups.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Нет доступных групп</p>
          <p>Добавьте первую группу, нажав кнопку "Добавить группу"</p>
        </div>
      ) : (
        <div className={styles.groupsList}>
          {groups.map((group: GroupInterface) => (
            <GroupItem
              key={group.id}
              group={group}
              onDelete={onDeleteHandler}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Всего групп:</span>
          <span className={styles.statValue}>{groups.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Всего студентов:</span>
          <span className={styles.statValue}>
            {groups.reduce((total, group) => total + (group.students?.length || 0), 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Groups;