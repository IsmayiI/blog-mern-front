import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";

export const FullPost = () => {
   const [post, setPost] = useState()
   const [isLoading, setIsLoading] = useState(true)

   const params = useParams()

   const fetchPost = async () => {
      try {
         const { data } = await axios.get(`posts/${params.id}`)
         setPost(data)
         setIsLoading(false)
      } catch (err) {
         console.warn(err)
      }
   }

   useEffect(() => {
      fetchPost()
   }, [])

   if (isLoading) {
      return <Post isLoading={true} />
   }


   return (
      <>
         <Post
            id={post._id}
            title={post.title}
            imageUrl={post.imageUrl}
            // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
            user={post.user}
            createdAt={post.createdAt}
            viewsCount={post.viewsCount}
            commentsCount={3}
            tags={post.tags}
            isFullPost
         >
            <p>
               {post.text}
            </p>
         </Post>
         <CommentsBlock
            items={[
               {
                  user: {
                     fullName: "Вася Пупкин",
                     avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                  },
                  text: "Это тестовый комментарий 555555",
               },
               {
                  user: {
                     fullName: "Иван Иванов",
                     avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                  },
                  text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
               },
            ]}
            isLoading={false}
         >
            <Index />
         </CommentsBlock>
      </>
   );
};
