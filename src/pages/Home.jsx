import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags, onSwitchFilter } from '../redux/slices/posts';

export const Home = () => {
   const dispatch = useDispatch()
   const userData = useSelector(state => state.auth.data)
   const { posts, tags } = useSelector(state => state.posts)
   const [isNew, setIsNew] = useState(false)
   const [activeFilter, setActiveFilter] = useState(0)

   useEffect(() => {
      dispatch(fetchPosts())
      dispatch(fetchTags())
   }, [])

   const onFilter = (filterName) => {
      if (filterName === 'new' && activeFilter === 0) {
         dispatch(onSwitchFilter(filterName))
         setIsNew(prev => !prev)
      }
      if (filterName === 'new' && activeFilter === 1) {
         setActiveFilter(0)
      }

      if (filterName === 'popular' && activeFilter === 0) {
         dispatch(onSwitchFilter(filterName))
         setActiveFilter(1)
      }

   }


   let content

   if (posts.status === 'loading') {
      content = [...Array(5)].map((_, i) => (
         <Post key={i} isLoading={true} />
      ))
   }



   if (posts.status === 'loaded') {
      content = posts.items.map((post, i) => {
         return (
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
         )
      })
   }


   return (
      <>
         <Tabs style={{ marginBottom: 15 }} value={activeFilter} aria-label="basic tabs example">
            <Tab onClick={() => onFilter('new')} label={isNew ? "Старые" : "Новые"} />
            <Tab label="Популярные" onClick={() => onFilter('popular')} />
         </Tabs>
         <Grid container spacing={4}>
            <Grid xs={8} item>
               {content}
            </Grid>
            <Grid xs={4} item>
               <TagsBlock items={tags.items} isLoading={tags.status === "loading" && true} />
               <CommentsBlock
                  items={[
                     {
                        user: {
                           fullName: 'Вася Пупкин',
                           avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                        },
                        text: 'Это тестовый комментарий',
                     },
                     {
                        user: {
                           fullName: 'Иван Иванов',
                           avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                        },
                        text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                     },
                  ]}
                  isLoading={false}
               />
            </Grid>
         </Grid>
      </>
   );
};
