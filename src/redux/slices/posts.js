
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
   const { data } = await axios.get('/posts')
   return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
   const { data } = await axios.get('/tags')
   return data
})


export const fetchDeletePost = createAsyncThunk('posts/fetchDeletePost', async (id) => await axios.delete(`/posts/${id}`))

const initialState = {
   posts: {
      items: [],
      filterItems: [],
      tagItems: [],
      comments: [],
      status: 'loading'
   },
   tags: {
      items: [],
      status: 'loading'
   },
   comments: {
      items: [],
      status: 'loading'
   }
}

const postsSlice = createSlice({
   name: 'posts',
   initialState,
   reducers: {
      onFilterNewPosts: (state) => {
         state.posts.filterItems = [...state.posts.items].reverse()
      },
      onFilterOldPosts: (state) => {
         state.posts.filterItems = state.posts.items
      },
      onFilterPopularPosts: (state) => {
         state.posts.filterItems = [...state.posts.items].sort((a, b) => b.viewsCount - a.viewsCount)
      },
      onFilterTagPosts: (state, action) => {
         state.posts.tagItems = state.posts.items.filter(post => post.tags.includes(action.payload))
      },
      addPostCommentsCount: (state, action) => {
         state.posts.items = state.posts.items.map(post => ({ ...post, commentsCount: action.payload }))
      }
   },
   extraReducers: {
      // Posts
      [fetchPosts.pending]: (state) => {
         state.posts.items = []
         state.posts.status = 'loading'
      },
      [fetchPosts.fulfilled]: (state, action) => {
         state.posts.items = action.payload
         state.posts.filterItems = []
         state.posts.status = 'loaded'
      },
      [fetchPosts.rejected]: (state) => {
         state.posts.items = []
         state.posts.status = 'error'
      },

      // Tags
      [fetchTags.pending]: (state) => {
         state.tags.items = []
         state.tags.status = 'loading'
      },
      [fetchTags.fulfilled]: (state, action) => {
         state.tags.items = action.payload
         state.tags.status = 'loaded'
      },
      [fetchTags.rejected]: (state) => {
         state.tags.items = []
         state.tags.status = 'error'
      },

      // Delete Post
      [fetchDeletePost.pending]: (state, action) => {
         state.posts.items = state.posts.items.filter(post => post._id !== action.meta.arg)
      },
   }
})

export const postsReducer = postsSlice.reducer
export const { onFilterNewPosts, onFilterOldPosts, onFilterPopularPosts, onFilterTagPosts, addPostCommentsCount } = postsSlice.actions