import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchRegister } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
   const dispatch = useDispatch()
   const isAuth = useSelector(state => !!state.auth.data)

   const { register, handleSubmit, formState: { errors, isValid } } = useForm({
      defaultValues: {
         fullName: '',
         email: '',
         password: ''
      },
      mode: 'onChange'
   })

   const onSubmit = async (values) => {
      const data = await dispatch(fetchRegister(values))
      if (data.error) {
         return alert(`Hе удалось зарегестрироваться. ${data.payload}`)
      }

      if ('token' in data.payload) {
         window.localStorage.setItem('token', data.payload.token)
      }
   }

   if (isAuth) {
      return <Navigate to="/" />
   }

   return (
      <Paper classes={{ root: styles.root }}>
         <Typography classes={{ root: styles.title }} variant="h5">
            Создание аккаунта
         </Typography>
         <div className={styles.avatar}>
            <Avatar sx={{ width: 100, height: 100 }} />
         </div>
         <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
               className={styles.field}
               label="Полное имя"
               error={Boolean(errors.fullName?.message)}
               helperText={errors.fullName?.message}
               {...register('fullName', { required: 'Укажите полное имя' })}
               fullWidth />
            <TextField
               type='email'
               className={styles.field}
               label="E-Mail"
               error={Boolean(errors.email?.message)}
               helperText={errors.email?.message}
               {...register('email', { required: 'Укажите почту' })}
               fullWidth />
            <TextField
               type="password"
               className={styles.field}
               label="Пароль"
               error={Boolean(errors.password?.message)}
               helperText={errors.password?.message}
               {...register('password', { required: 'Укажите пароль' })}
               fullWidth />
            <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
               Зарегистрироваться
            </Button>
         </form>
      </Paper>
   );
};
