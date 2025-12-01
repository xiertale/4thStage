import { useState } from 'react';
import styles from './AddGroup.module.scss';

export type FormFields = {
  name: string;
  description?: string;
};

interface AddGroupProps {
  onAdd: (groupFormField: FormFields) => void;
}

const AddGroup = ({ onAdd }: AddGroupProps): React.ReactElement => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Введите название группы');
      return;
    }

    onAdd({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <form className={styles.AddGroup} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Название группы"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Описание (необязательно)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Добавить группу</button>
    </form>
  );
};

export default AddGroup;