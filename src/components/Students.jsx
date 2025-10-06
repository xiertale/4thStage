// src/components/Students.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Функция для выполнения запроса к API
const fetchStudents = async () => {
  const response = await fetch('/api/students');
  if (!response.ok) {
    throw new Error('Ошибка при загрузке списка студентов');
  }
  return response.json();
};

function Students() {
  // Использование useQuery для получения данных
  const {
    data: students,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['students'], // Уникальный ключ запроса[citation:3][citation:8]
    queryFn: fetchStudents, // Функция для получения данных
  });

  // Состояние загрузки
  if (isLoading) {
    return <div>Загрузка списка студентов...</div>;
  }

  // Состояние ошибки
  if (isError) {
    return <div>Ошибка: {error.message}</div>;
  }

  // Вывод данных
  return (
    <div>
      <h1>Список студентов</h1>
      <ul>
        {students?.map((student) => (
          <li key={student.id}>
            {student.last_name} {student.first_name} {student.middle_name} (Группа: {student.groupId})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Students;