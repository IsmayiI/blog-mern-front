import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout } from '../../redux/slices/auth';

export const Header = () => {
   const dispatch = useDispatch()
   const isAuth = useSelector(state => !!state.auth.data)
   const fullName = useSelector(state => state.auth.data?.fullName)
   let firstName = ''

   if (fullName) {
      [firstName] = fullName.split(" ");
   }


   const onClickLogout = () => {
      if (window.confirm('Вы действительно хотите выйти?')) {
         dispatch(logout())
         window.localStorage.removeItem('token')
      }
   };

   return (
      <div className={styles.root}>
         <Container maxWidth="lg">
            <div className={styles.inner}>
               <Link className={styles.logo} to="/">
                  <div>{firstName} БЛОГ</div>
               </Link>
               <div className={styles.buttons}>
                  {isAuth ? (
                     <>
                        <Link to="/add-post">
                           <Button variant="contained">Написать статью</Button>
                        </Link>
                        <Button onClick={onClickLogout} variant="contained" color="error">
                           Выйти
                        </Button>
                     </>
                  ) : (
                     <>
                        <Link to="/login">
                           <Button variant="outlined">Войти</Button>
                        </Link>
                        <Link to="/register">
                           <Button variant="contained">Создать аккаунт</Button>
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </Container>
      </div>
   );
};
