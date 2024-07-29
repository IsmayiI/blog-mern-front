import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios'

export const AddPost = () => {
   const { id } = useParams()
   const navigate = useNavigate()
   const isAuth = useSelector(state => !!state.auth.data)
   const [isLoading, setLoading] = useState(false)
   const [text, setText] = useState('')
   const [title, setTitle] = useState('')
   const [tags, setTags] = useState([])
   const [imageUrl, setImageUrl] = useState('')
   const inputFileRef = useRef(null)

   const isEditing = !!id

   const handleChangeFile = async (event) => {
      try {
         const formData = new FormData()
         const file = event.target.files[0]
         formData.append('image', file)
         const { data } = await axios.post('/upload', formData)
         setImageUrl(data.url)
      } catch (err) {
         console.warn(err);
         alert('Ошибка при загрузке файла')
      }
   }

   const onClickRemoveImage = () => {
      setImageUrl('')
   }

   const onChange = useCallback((value) => {
      setText(value);
   }, []);

   const onSubmit = async () => {
      try {
         setLoading(true)

         const fields = {
            text,
            title,
            tags,
            imageUrl
         }

         let _id

         if (isEditing) {
            await axios.patch(`/posts/${id}`, fields)
            _id = id
         }
         else {
            const { data } = await axios.post('/posts', fields)
            _id = data._id
         }

         navigate(`/posts/${_id}`)

      } catch (err) {
         console.warn(err)
         console.log('Ошибка при создании статьи')
      }

      setLoading(false)
   }

   useEffect(() => {
      if (id) {
         axios.get(`/posts/${id}`).then(({ data }) => {
            setTitle(data.title)
            setText(data.text)
            setTags(data.tags)
            setImageUrl(data.imageUrl)
         })
      }
   }, [])

   const options = useMemo(
      () => ({
         spellChecker: false,
         maxHeight: '400px',
         autofocus: true,
         placeholder: 'Введите текст...',
         status: false,
         autosave: {
            enabled: true,
            delay: 1000,
         },
      }),
      [],
   )


   if (!window.localStorage.getItem('token') && !isAuth) {
      return <Navigate to="/" />
   }




   return (
      <Paper style={{ padding: 30 }}>
         <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
            Загрузить превью
         </Button>
         <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
         {imageUrl && (
            <>
               <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                  Удалить
               </Button>
               <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
            </>
         )}
         <br />
         <br />
         <TextField
            classes={{ root: styles.title }}
            variant="standard"
            placeholder="Заголовок статьи..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
         />
         <TextField
            classes={{ root: styles.tags }}
            variant="standard"
            placeholder="Тэги"
            value={tags}
            onChange={(e) => setTags(e.target.value.split(','))}
            fullWidth />
         <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
         <div className={styles.buttons}>
            <Button onClick={onSubmit} size="large" variant="contained">
               {isEditing ? 'Сохранить' : 'Опубликовать'}
            </Button>
            <a href="/">
               <Button size="large">Отмена</Button>
            </a>
         </div>
      </Paper>
   );
};
