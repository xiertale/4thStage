'use client';

import { useState } from 'react';
import useGroups from '@/hooks/useGroups';
import type GroupInterface from '@/types/GroupInterface';
import styles from './Groups.module.scss';
import AddGroup, { type GroupFormFields } from './AddGroup/AddGroup';
import GroupItem from './GroupItem/GroupItem';

const Groups = (): React.ReactElement => {
  const { groups, addGroupMutate, deleteGroupMutate } = useGroups();
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  const onDeleteHandler = (groupId: number): void => {
    if (confirm('Удалить группу?')) {
      deleteGroupMutate(groupId);
    }
  };

  const onAddHandler = (groupFormField: GroupFormFields): void => {
    addGroupMutate({
      ...groupFormField,
      students: [],
    });
    setIsAddingGroup(false);
  };

  const onCancelAddHandler = (): void => {
    setIsAddingGroup(false);
  };

  return (
    <div className={styles.Groups}>
      <h1>Группы</h1>

      {!isAddingGroup ? (
        <button onClick={() => setIsAddingGroup(true)}>
          + Добавить группу
        </button>
      ) : (
        <div className={styles.addFormContainer}>
          <AddGroup onAdd={onAddHandler} onCancel={onCancelAddHandler} />
        </div>
      )}

      <div className={styles.groupsList}>
        {groups.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Нет доступных групп</p>
          </div>
        ) : (
          groups.map((group: GroupInterface) => (
            <GroupItem
              key={group.id}
              group={group}
              onDelete={onDeleteHandler}
            />
          ))
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          Всего групп: {groups.length}
        </div>
        <div className={styles.statItem}>
          Всего студентов: {groups.reduce((total, group) => total + (group.students?.length || 0), 0)}
        </div>
      </div>
    </div>
  );
};

export default Groups;