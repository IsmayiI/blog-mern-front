import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import axios from "../../axios";
import { useSelector } from "react-redux";

export const Index = ({ postId, setComments }) => {

   const { data: user } = useSelector(state => state.auth)

   const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
      defaultValues: {
         text: ''
      },
      mode: 'onChange'
   })

   const createComment = async (values) => {
      const params = { ...values, postId }
      const { data: comment } = await axios.post('/comments', params)
      setComments(prevComments => [...prevComments, { ...comment, user }])
      reset()
   }

   return (
      <form onSubmit={handleSubmit(createComment)}>
         <div className={styles.root}>
            <Avatar
               classes={{ root: styles.avatar }}
               src={''}
            />
            <div className={styles.form}>
               <TextField
                  label="Написать комментарий"
                  variant="outlined"
                  maxRows={10}
                  error={Boolean(errors.text?.message)}
                  helperText={errors.text?.message}
                  {...register('text', { required: 'добавьте комментарий' })}
                  multiline
                  fullWidth
               />
               <Button disabled={!isValid} type="submit" variant="contained">Отправить</Button>
            </div>
         </div>
      </form>
   );
};
