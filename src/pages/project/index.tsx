import { ProjectPage } from '@/modules/ProjectsPage/ProjectPage';
import Layout from '@/modules/ProjectsPage/components/layout';

export default function ProjectRoute() {
   return <ProjectPage />;
}

ProjectRoute.getLayout = function getLayout(page: React.ReactNode) {
   return <Layout>{page}</Layout>;
};
