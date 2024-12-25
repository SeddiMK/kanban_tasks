import { getCookie } from './cookies';

export const prepareHeaders = (headers: Headers, { getState }: { getState: unknown }) => {
   // 
   const token = getCookie('token-auth');

   if (token) {
      headers.set('Authorization', `Bearer ${token}`)
   }
   return headers
}