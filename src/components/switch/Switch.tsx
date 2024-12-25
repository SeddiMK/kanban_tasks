import style from './switch.module.css';
import { useReducer } from 'react';

type Props = {
   onChange: (v: boolean) => boolean;
   /**
    * @description initial value
    */
   checked?: boolean;
   size?: number;
   // colorScheme?: {
   //    back: string;
   //    ball: string;
   // };
};

export function Switch({ onChange, checked = false, size = 16 }: Props) {
   
   // , colorScheme = { back: '#3787EB', ball: '#FFFFFF' }

   const [isChecked, switchChecked] = useReducer((v) =>  !v, checked);

   function onSwitch(e: React.MouseEvent) {
      switchChecked()
      if (onChange) return onChange(!isChecked);
   }

   return (
      <div
         className={[style.container, isChecked ? style.active : ''].join(' ')}
         onClick={onSwitch}
         style={{ width: `${size * 2}px`, height: `${size}px`, borderRadius: `${size * 2}px` }}
      >
         <div className={style.ball} style={{ width: `${size * 0.7}px`, height: `${size * 0.7}px` }}></div>
      </div>
   );
}
