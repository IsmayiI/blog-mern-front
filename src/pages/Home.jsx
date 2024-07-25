import { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
   const dispatch = useDispatch()
   const userData = useSelector(state => state.auth.data)
   const { posts, tags } = useSelector(state => state.posts)

   useEffect(() => {
      dispatch(fetchPosts())
      dispatch(fetchTags())
   }, [])


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
               imageUrl={post.imageUrl}
               // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
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
         <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
            <Tab label="Новые" />
            <Tab label="Популярные" />
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
