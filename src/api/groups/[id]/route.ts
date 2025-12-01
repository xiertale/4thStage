import { NextRequest, NextResponse } from 'next/server';
import { getGroupsDb, addGroupDb, deleteGroupDb } from '@/db/groupDb';

// GET /api/groups
export async function GET(request: NextRequest) {
  try {
    const groups = await getGroupsDb();
    return NextResponse.json(groups);
  } catch (error) {
    console.error('GET groups error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST /api/groups
export async function POST(request: NextRequest) {
  try {
    const groupData = await request.json();
    
    // Валидация
    if (!groupData.name || !groupData.name.trim()) {
      return NextResponse.json({ error: 'Название группы обязательно' }, { status: 400 });
    }
    
    const newGroup = await addGroupDb(groupData);
    return NextResponse.json(newGroup);
  } catch (error) {
    console.error('POST groups error:', error);
    return NextResponse.json({ error: 'Ошибка создания группы' }, { status: 500 });
  }
}

// DELETE /api/groups
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = Number(searchParams.get('id'));
    
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Некорректный ID группы' }, { status: 400 });
    }
    
    const success = await deleteGroupDb(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('DELETE groups error:', error);
    return NextResponse.json({ error: 'Ошибка удаления группы' }, { status: 500 });
  }
}