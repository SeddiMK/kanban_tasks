import { useEffect, useState } from "react";

export function useDebounce(value: string, delay: number): string {
   // 
   const [debouncedValue, setDebouncedValue] = useState(value);
   let awaiting = false;

   useEffect(() => {

      if (!awaiting) {
         const handler = setTimeout(() => {
            setDebouncedValue(value);
            awaiting = false;
         }, delay);

         awaiting = true;
         return () => {
            clearTimeout(handler);
         };
      }

   }, [value, delay]);

   return debouncedValue;
}