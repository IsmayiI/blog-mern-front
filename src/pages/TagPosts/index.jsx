import styles from './TagPosts.module.scss'
import { useParams } from "react-router-dom"
import Grid from '@mui/material/Grid';
import { Post } from '../../components/Post'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPosts, onFilterTagPosts } from '../../redux/slices/posts';

export const TagPosts = () => {
   const { tag } = useParams()
   const dispatch = useDispatch()
   const userData = useSelector(state => state.auth.data)
   const { posts } = useSelector(state => state.posts)

   useEffect(() => {
      const fetchData = async () => {
         await dispatch(fetchPosts())
         dispatch(onFilterTagPosts(tag))
      }

      fetchData()
   }, [])


   return (
      <div className={styles.tag}>
         <h2>#{tag}</h2>
         <Grid xs={8} item>
            {
               posts.tagItems.map(post => (
                  <Post
                     key={post._id}
                     id={post._id}
                     title={post.title}
                     imageUrl={post.imageUrl && `http://localhost:4444${post.imageUrl}`}
                     user={post.user}
                     createdAt={post.createdAt}
                     viewsCount={post.viewsCount}
                     commentsCount={3}
                     tags={post.tags}
                     isEditable={userData?._id === post.user._id}
                  />
               ))
            }
         </Grid>

      </div>
   )
}

