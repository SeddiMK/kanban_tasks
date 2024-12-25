import styles from './auth.module.scss';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetOAuthTokenMutation } from '@/api/appApi';
import { FormDataType, LoginRequest } from '@/api/data.types';
import { useCookies } from 'react-cookie';
import { ChangeEvent, FocusEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoaderIcon from '@public/icons/auth-loader.svg';

const schema: ZodType<FormDataType> = z
   .object({
      email: z.string().min(1, 'Нужно заполнить').min(3, 'Не меньше 3 символов').email('Неправильная почта'),
      password: z.string().min(1, 'Нужно заполнить'),
   })
   .required();

export default function AuthPage() {
   const [emailTyping, setEmailTyping] = useState('#f4f6f8');
   const [passwordTyping, setPasswTyping] = useState('#f4f6f8');

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormDataType>({
      resolver: zodResolver(schema),
   });

   const [login, { isLoading, isError, isSuccess }] = useGetOAuthTokenMutation();
   const [_, setCookie] = useCookies(['token-auth']);
   const router = useRouter();

   const onSubmit = async (formData: LoginRequest) => {
      const paylord = await login(formData);
      setCookie('token-auth', paylord.data?.token);

      setTimeout(() => router.replace('/project', { scroll: false }), 2000);
   };

   const { onBlur: onBlurEmail, onChange: onChangeEmail, name: nameEmail, ref: refEmail } = register('email');

   const { onBlur: onBlurPass, onChange: onChangePass, name: namePass, ref: refPass } = register('password');

   const onBlurHandler = (
      e: FocusEvent<HTMLInputElement, Element>,
      registrFunctionBlur: CallableFunction,
      setFunction: CallableFunction
   ) => {
      setFunction('#f4f6f8');
      return registrFunctionBlur(e);
   };

   const onChangeHandler = (
      e: ChangeEvent<HTMLInputElement>,
      registrFunctionChange: CallableFunction,
      setFunction: CallableFunction
   ) => {
      e.target.value.length > 0 ? setFunction('#fff') : setFunction('#f4f6f8');
      return registrFunctionChange(e);
   };

   return (
      <div className="wrapped">
         <div className={styles.auth}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
               <h2 className={styles.title}>Вход</h2>
               <div className={styles.input_box}>
                  <label className={styles.label} htmlFor="auth-email">
                     Электронная почта
                  </label>
                  <input
                     style={{
                        backgroundColor: errors.email?.type ? '#fff1f0' : emailTyping,
                     }}
                     id="auth-email"
                     className={styles.input}
                     placeholder="Электронная почта"
                     name={nameEmail}
                     onBlur={(e) => onBlurHandler(e, onBlurEmail, setEmailTyping)}
                     onChange={(e) => onChangeHandler(e, onChangeEmail, setEmailTyping)}
                     ref={refEmail}
                  />

                  <label className={styles.foremail} htmlFor="auth-email">
                     Электронная почта
                  </label>
               </div>
               {errors.email?.type ? (
                  <p className={styles.message_invalid}>{errors.email?.message}</p>
               ) : isError ? (
                  <p className={styles.auth_error}>Ошибка неправильно введен логин или пароль</p>
               ) : isSuccess ? (
                  <p className={styles.auth_success}>Успешно</p>
               ) : (
                  <></>
               )}
               <div className={styles.input_box}>
                  <label htmlFor="auth-password" className={styles.label}>
                     Пароль
                  </label>
                  <input
                     style={{
                        backgroundColor: errors.password?.type ? '#fff1f0' : passwordTyping,
                     }}
                     type="password"
                     className={styles.input}
                     placeholder="Пароль"
                     name={namePass}
                     onBlur={(e) => onBlurHandler(e, onBlurPass, setPasswTyping)}
                     onChange={(e) => onChangeHandler(e, onChangePass, setPasswTyping)}
                     ref={refPass}
                  />
                  <label className={styles.forpassword} htmlFor="auth-password">
                     Пароль
                  </label>
               </div>
               {errors.password?.type ? (
                  <p className={styles.message_invalid}>{errors.password?.message}</p>
               ) : isError ? (
                  <p className={styles.auth_error}>Ошибка неправильно введен логин или пароль</p>
               ) : isSuccess ? (
                  <p className={styles.auth_success}>Успешно</p>
               ) : (
                  <></>
               )}
               <button
                  type="submit"
                  className={styles.submit}
                  style={isLoading ? { paddingRight: 30 } : { paddingRight: 0 }}
               >
                  Войти
                  {isLoading ? <LoaderIcon className={styles.loader} /> : ''}
               </button>
            </form>
         </div>
      </div>
   );
}
