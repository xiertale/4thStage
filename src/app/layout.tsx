import { dehydrate } from '@tanstack/react-query';

import TanStackQuery from '@/containers/TanStackQuery';
import queryClient from '@/api/reactQueryClient';
import { getGroupsApi } from '@/api/groupsApi';
import type GroupInterface from '@/types/GroupInterface';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import Main from '@/components/layout/Main/Main';
import StudentInterface from '@/types/StudentInterface';
import type { Metadata } from 'next';
import { getStudentsApi } from '@/api/studentApi';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Вэб разработка ВКИ - Next.js шаблон',
  description: 'Шаблон для веб-разработки с использованием Next.js, React Hook Form, Yup, SCSS, Eslint, TanStack Query (React Query)',
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>): Promise<React.ReactElement> => {
  let groups: GroupInterface[];

  // выполняется на сервере - загрузка групп
  await queryClient.prefetchQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      groups = await getGroupsApi();
      console.log('Groups', groups);
      return groups;
    },
  });

  let students: StudentInterface[];

  // выполняется на сервере - загрузка студентов
  await queryClient.prefetchQuery({
    queryKey: ['students'],
    queryFn: async () => {
      students = await getStudentsApi();
      console.log('students', students);
      return students;
    },
  });


  const state = dehydrate(queryClient, { shouldDehydrateQuery: () => true });

  return (
    <TanStackQuery state={state}>
      <html lang="ru">
        <body>
          <Header />
          <Main>
            <>{children}</>
          </Main>
          <Footer />
        </body>
      </html>
    </TanStackQuery>
  );
};

export default RootLayout;
