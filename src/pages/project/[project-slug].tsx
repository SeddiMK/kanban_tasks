import { KanbanPage } from '@/modules/KanbanPage/KanbanPage';
import { useRouter } from 'next/router';
import NavLayout from '@/modules/ProjectsPage/components/layout';

export default function ProjectRoute() {
   return <KanbanPage />;
}

ProjectRoute.getLayout = function getLayout(page: React.ReactNode) {
   return <NavLayout>{page}</NavLayout>;
};
