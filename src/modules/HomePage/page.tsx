import Image from 'next/image';
import Snow from '@public/media/snow.svg';
import Link from 'next/link';
import styles from './Home.module.scss';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MainPage() {
   const [token, _, removeCookie] = useCookies(['token-auth']);
   const [inOut, setInOut] = useState(!!token['token-auth']);
   const [LogInLogOutButton, setBtnContent] = useState('Войти');
   const [mainBtn, setMainBtn] = useState('Войти');
   const [mainLink, setMainLink] = useState('/auth');
   const router = useRouter();

   useEffect(() => {
      if (token['token-auth']) {
         setInOut(true);
         setBtnContent('Выйти');
         setMainBtn('Перейти к проектам');
         setMainLink('/project');
         // setBtnLink('#');
      }
   }, [inOut]);

   const logOut = () => {
      removeCookie('token-auth');
      globalThis.document.cookie = '';
      location.reload();
      setInOut(false);
   };

   return (
      <div className={`wrapped ${styles.bkg}`}>
         <Snow className={styles.snow} />
         <header className={styles.header}>
            <Image src="/mainlogo.svg" alt="logo" width={159} height={43} priority={true} />
            <button className={styles.link} onClick={() => (inOut ? logOut() : router.push('/auth'))}>
               {LogInLogOutButton}
            </button>
         </header>
         <main className={styles.main}>
            <div className={styles.main_box}>
               <p className={styles.main_info}>Добро пожаловать на главную страницу планировщика задач Kanban!</p>
               <p className={styles.main_info}>
                  Чтобы начать работать в Kanban доске нажмите на кнопку "войти" и введите свой логин и пароль если еще
                  этого не сделали.
               </p>
               <p className={styles.main_info}>
                  Если вы уже зарегистрированы, то можете начать работу, нажав на кнопку "перейти к проектам".
               </p>
               <Link className={styles.link} href={mainLink}>
                  {mainBtn}
               </Link>
            </div>
         </main>
         <footer className={styles.footer}>
            <p className="developer">Андрей Леншмидт</p>
            <p className="developer">Александр Саншайн</p>
            <p className="developer">Максим Егоров</p>
         </footer>
      </div>
   );
}
