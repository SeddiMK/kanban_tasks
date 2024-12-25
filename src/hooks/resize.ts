import { useEffect, useState } from "react";

export const useResize = () => {
   const [width, setWidth] = useState(globalThis.innerWidth);  //
   const [height, setHeight] = useState(globalThis.innerHeight);

   useEffect(() => {

      if (typeof window === 'undefined') { setWidth(0); }
      else {

         const handleResize = (e: UIEvent) => {
            setWidth((e.target as Window).innerWidth)
            setHeight((e.target as Window).innerHeight)
         };

         window.addEventListener('resize', handleResize);

         return () => {
            window.removeEventListener('resize', handleResize);
         };
      }

   }, []);

   return { width, height };
};