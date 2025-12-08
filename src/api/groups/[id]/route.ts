// src/app/api/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGroupsDb, addGroupDb, deleteGroupDb } from '@/db/groupDb'; // Убедитесь, что функции существуют

// 1. Обработчик GET (для получения списка групп)
export async function GET(request: NextRequest) {
  try {
    const groups = await getGroupsDb();
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Ошибка GET /api/groups:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Простая валидация
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Название группы обязательно' }, { status: 400 });
    }
    const newGroup = await addGroupDb(body); // Вызываем функцию для работы с БД
    return NextResponse.json(newGroup, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Ошибка POST /api/groups:', error);
    return NextResponse.json({ error: 'Ошибка при создании группы' }, { status: 500 });
  }
}

// 3. Обработчик DELETE (для удаления группы)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Не передан ID группы' }, { status: 400 });
    }
    const success = await deleteGroupDb(parseInt(id));
    if (!success) {
      return NextResponse.json({ error: 'Группа не найдена' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка DELETE /api/groups:', error);
    return NextResponse.json({ error: 'Ошибка при удалении группы' }, { status: 500 });
  }
}