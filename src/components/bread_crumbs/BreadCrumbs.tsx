import Link from 'next/link';
import style from './bread-crumbs.module.css';

type LinkData = {
   text: string;
   url: string;
};

export function BreadCrumbs({ crumbs }: { crumbs: LinkData[] }) {
   return (
      <div className={style.bread_crumbs}>
         {crumbs.map((crumb, i) => {
            if (!i) return <Link key={i} href={crumb.url}>{crumb.text}</Link>;
            else
               return (
                  <span key={i} style={{display: 'contents'}}>
                     <span>/</span>
                     <Link href={crumb.url}>{crumb.text}</Link>
                  </span>
               )
         })}
      </div>
   );
}
