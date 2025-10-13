'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useStudents from '@/hooks/useStudents';
import StudentInterface from '@/types/StudentInterface';

interface AddStudentFormData {
  first_name: string;
  last_name: string;
  middle_name: string;
  group_id: number;
}

const AddStudent = (): React.ReactElement => {
  const { addStudent, isAdding } = useStudents();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddStudentFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      middle_name: '',
      group_id: 0,
    },
  });

  const onSubmit = async (data: AddStudentFormData) => {
    try {
      setError(null);
      await addStudent(data);
      reset();
      setIsFormVisible(false);
    } catch (err) {
      setError('Ошибка при добавлении студента');
      console.error('Error adding student:', err);
    }
  };

  if (!isFormVisible) {
    return (
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <button
          onClick={() => setIsFormVisible(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#008CBA', // светло-синий
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            fontWeight: 'bold',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#005f73'; // темно-синий
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#008CBA';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Добавить студента
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>
      <h3 style={{ marginBottom: '20px', fontSize: '30px', fontWeight: 'bold' }}>Добавить нового студента</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/** Имя */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="first_name" style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
            Имя *
          </label>
          <input
            {...register('first_name', { required: 'Имя обязательно' })}
            type="text"
            id="first_name"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#008CBA')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#ccc')}
          />
          {errors.first_name && (
            <span style={{ color: 'red', fontSize: '12px' }}>
              {errors.first_name.message}
            </span>
          )}
        </div>

        {/** Фамилия */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="last_name" style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
            Фамилия *
          </label>
          <input
            {...register('last_name', { required: 'Фам            имя обязательно' })}
            type="text"
            id="last_name"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#008CBA')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#ccc')}
          />
          {errors.last_name && (
            <span style={{ color: 'red', fontSize: '12px' }}>
              {errors.last_name.message}
            </span>
          )}
        </div>

        {/** Отчество */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="middle_name" style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
            Отчество
          </label>
          <input
            {...register('middle_name')}
            type="text"
            id="middle_name"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#008CBA')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#ccc')}
          />
        </div>

        {/** ID группы */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="group_id" style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
            ID группы *
          </label>
          <input
            {...register('group_id', { required: 'ID группы обязателен', valueAsNumber: true })}
            type="number"
            id="group_id"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#008CBA')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#ccc')}
          />
          {errors.group_id && (
            <span style={{ color: 'red', fontSize: '12px' }}>
              {errors.group_id.message}
            </span>
          )}
        </div>

        {/** Ошибка добавления */}
        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        {/** Кнопки отправки и отмены */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={isAdding}
            style={{
              padding: '12px 24px',
              backgroundColor: isAdding ? '#ccc' : '#2d90d1ff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isAdding ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s, transform 0.3s',
              fontWeight: 'bold',
            }}
            onMouseOver={(e) => !isAdding && (e.currentTarget.style.backgroundColor = '#218838')}
            onMouseOut={(e) => !isAdding && (e.currentTarget.style.backgroundColor = '#28a745')}
          >
            {isAdding ? 'Добавление...' : 'Добавить'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsFormVisible(false);
              reset();
              setError(null);
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              fontWeight: 'bold',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#5a6268')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;

