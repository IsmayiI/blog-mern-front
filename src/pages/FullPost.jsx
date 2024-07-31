import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import { addPostCommentsCount, fetchPostComments } from "../redux/slices/posts";
import { useDispatch } from "react-redux";

export const FullPost = () => {
   const dispatch = useDispatch()
   const [post, setPost] = useState()
   const [comments, setComments] = useState([])
   const [isLoading, setIsLoading] = useState(true)

   const params = useParams()

   const fetchPost = async () => {
      try {
         const { data: postData } = await axios.get(`posts/${params.id}`)
         const { data: commentData } = await axios.get(`/comments/${params.id}`)
         setPost(postData)
         setComments(commentData)
         setIsLoading(false)
      } catch (err) {
         console.warn(err)
      }
   }



   useEffect(() => {
      fetchPost()
   }, [])

   useEffect(() => {
      dispatch(addPostCommentsCount(comments.length))
   }, [comments.length])

   if (isLoading) {
      return <Post isLoading={true} />
   }

   return (
      <>
         <Post
            id={post._id}
            title={post.title}
            imageUrl={post.imageUrl && `http://localhost:4444${post.imageUrl}`}
            user={post.user}
            createdAt={post.createdAt}
            viewsCount={post.viewsCount}
            commentsCount={comments.length}
            tags={post.tags}
            isFullPost
         >
            <p>
               {post.text}
            </p>
         </Post>
         <CommentsBlock
            items={comments}
            isLoading={false}
         >
            <Index postId={params.id} setComments={setComments} />
         </CommentsBlock>
         {/* <CommentsBlock
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
         </CommentsBlock> */}
      </>
   );
};
