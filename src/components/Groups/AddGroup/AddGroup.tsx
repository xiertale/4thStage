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
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GroupFormFields>();

  const onSubmit: SubmitHandler<GroupFormFields> = (groupForm) => {
    onAdd(groupForm);
    if (!isModal) {
      reset();
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <div className={`${styles.AddGroup} ${isModal ? styles.modal : ''}`}>
      <h2 className={styles.title}>Новая группа</h2>
      
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Название группы *
            <input
              placeholder="Например: 2207а1"
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              {...register('name', { 
                required: 'Обязательное поле',
                minLength: {
                  value: 2,
                  message: 'Название должно содержать минимум 2 символа'
                },
                maxLength: {
                  value: 50,
                  message: 'Название не должно превышать 50 символов'
                }
              })}
            />
          </label>
          {errors.name && <div className={styles.errorMessage}>{errors.name.message}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Контакты
            <input
              placeholder="Например: group@college.ru"
              className={styles.input}
              {...register('contacts', {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Введите корректный email'
                }
              })}
            />
          </label>
          {errors.contacts && <div className={styles.errorMessage}>{errors.contacts.message}</div>}
        </div>

        <div className={styles.buttons}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Добавление...
              </>
            ) : 'Добавить группу'}
          </button>
          {onCancel && (
            <button 
              type="button" 
              onClick={handleCancel} 
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddGroup;