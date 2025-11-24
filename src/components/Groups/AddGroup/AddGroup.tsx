import { useForm, type SubmitHandler } from 'react-hook-form';
import styles from './AddGroup.module.scss';

export interface GroupFormFields {
  name: string;
  contacts: string;
}

interface Props {
  onAdd: (groupForm: GroupFormFields) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const AddGroup = ({ onAdd, onCancel, isModal = false }: Props): React.ReactElement => {
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
    <div className={`${styles.AddGroup} ${isModal ? styles.modal : ''}`}>
      <h2>Добавление группы</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <input
            placeholder="Название группы"
            {...register('name', { 
              required: 'Обязательное поле',
              minLength: {
                value: 2,
                message: 'Название должно содержать минимум 2 символа'
              }
            })}
            className={errors.name ? styles.error : ''}
          />
          {errors.name && <div className={styles.errorMessage}>{errors.name.message}</div>}
        </div>

        <div className={styles.formGroup}>
          <input
            placeholder="Контакты"
            {...register('contacts')}
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton}>
            Добавить группу
          </button>
          {isModal && (
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