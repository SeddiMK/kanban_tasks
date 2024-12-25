import styles from '@/modules/HomePage/Home.module.scss';
import { useRouter } from 'next/router';

export default function NotFound() {
   const router = useRouter();
   return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
         <div className={styles.main} style={{ flexDirection: 'column' }}>
            <h1 style={{ fontSize: '48px', padding: '40px' }}>404 Not found</h1>
            <button className={styles.link} onClick={() => router.replace('/')}>
               На главную
            </button>
         </div>
      </div>
   );
}
