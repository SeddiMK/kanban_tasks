/**
 * @example - let func = debounce(() => console.log(123), 1000);
 * @param func 
 * @param delay 
 * @returns 
 */
export function debounce<V, F extends (route: string, validator: V) => R, R>(func: F, delay: number): F {

   let inAwaiting = false;
   let lastResult: R;

   function debounedFunc (route: string, validator: V) {
      if (!inAwaiting) {

         let result: R = func(route, validator);

         inAwaiting = true;
         setTimeout(() => inAwaiting = false, delay);

         return lastResult = result;
      }
      else {
         return lastResult;
      }
   };

   return debounedFunc as F;
}


/**
 * @example - let func = debounce(() => console.log(123), 1000);
 * @param func 
 * @param delay 
 * @returns 
 */
export function debounceX<F extends (route: string, validator: V) => R, V, R>(func: F, delay: number): F {

   let inAwaiting = false;
   let lastResult: R;
   let lastArgs: [string, V]

   function debounedFunc(route: string, validator: V) {
      if (!inAwaiting) {

         let result: R = func(route, validator);

         inAwaiting = true;
         setTimeout(() => {

            inAwaiting = false
            if (lastArgs)
               func(route, validator)
         }, delay);

         return lastResult = result;
      }
      else {
         // кэшируем последние аргументы
         lastArgs = [route, validator];
         return lastResult;
      }
   };

   return debounedFunc as F;
}

