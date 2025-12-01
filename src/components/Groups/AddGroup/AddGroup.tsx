import { useForm, type SubmitHandler } from 'react-hook-form';
import styles from './AddGroup.module.scss';

export interface GroupFormFields {
  name: string;
  contacts: string;
}

interface Props {
  onAdd: (groupForm: GroupFormFields) => void;
  onCancel?: () => void;
}

const AddGroup = ({ onAdd, onCancel }: Props): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GroupFormFields>();

  const onSubmit: SubmitHandler<GroupFormFields> = (groupForm) => {
    onAdd(groupForm);
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <div className={styles.AddGroup}>
      <h2>Добавление группы</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Название группы"
          {...register('name', { 
            required: 'Обязательное поле',
            minLength: {
              value: 2,
              message: 'Минимум 2 символа'
            }
          })}
          className={errors.name ? styles.error : ''}
        />
        {errors.name && <div className={styles.errorMessage}>{errors.name.message}</div>}

        <input
          placeholder="Контакты"
          {...register('contacts')}
        />

        <div className={styles.buttons}>
          <input type="submit" value="Добавить группу" className={styles.submitButton} />
          {onCancel && (
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddGroup;