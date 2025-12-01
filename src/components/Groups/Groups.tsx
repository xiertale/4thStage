'use client';

import useGroups from '@/hooks/useGroups';
import type GroupInterface from '@/types/GroupInterface';
import styles from './Groups.module.scss';
import GroupItem from './GroupItem/GroupItem';
import AddGroup, { type FormFields } from './AddGroup/AddGroup';
import { v4 as uuidv4 } from 'uuid';

const Groups = (): React.ReactElement => {
  const {
    groups,
    deleteGroupMutate,
    addGroupMutate,
  } = useGroups();

  /**
   * Удаление группы - обработчик события нажатия "удалить"
   * @param groupId Ид группы
   */
  const onDeleteHandler = (groupId: number): void => {
    if (confirm('Удалить группу?')) {
      console.log('onDeleteHandler', groupId);
      debugger;

      deleteGroupMutate(groupId);
    }
  };

  /**
   * Добавление группы - обработчик события нажатия "добавить"
   * @param groupFormField Форма группы
   */
  const onAddHandler = (groupFormField: FormFields): void => {
    console.log('Добавление группы', groupFormField);
    debugger;

    addGroupMutate({
      id: -1,
      ...groupFormField,
      uuid: uuidv4(),
    });
  };

  return (
    <div className={styles.Groups}>
      <AddGroup onAdd={onAddHandler} />

      {groups.map((group: GroupInterface) => (
        <GroupItem
          key={group.id || group.uuid}
          group={group}
          onDelete={onDeleteHandler}
        />
      ))}
    </div>
  );
};

export default Groups;