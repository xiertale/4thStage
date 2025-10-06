import { getStudentDb } from '@/db/studentDb';

export async function GET(): Promise<Response> {
  const student = await getStudentDb();

  return new Response(JSON.stringify(student), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
