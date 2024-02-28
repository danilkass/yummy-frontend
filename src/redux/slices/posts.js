import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPost = createAsyncThunk("post/fetchPost", async () => {
  const { data } = await axios.get("/post?limit=0");
  return data;
});

export const fetchRemovePost = createAsyncThunk("post/fetchRemovePost", async (id) => {
  await axios.delete(`/post/${id}`);
  return id; // Возвращаем только id удаленного поста
});

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.pending, (state) => {
        state.posts.items = [];
        state.posts.status = "loading";
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.posts.items = action.payload.posts;
        state.posts.status = "loaded";
      })
      .addCase(fetchPost.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = "error";
      })
      .addCase(fetchRemovePost.pending, (state, action) => {
        const postId = action.meta.arg; // Получаем id удаленного поста из payload
        state.posts.items = state.posts.items.filter((obj) => obj.post._id !== postId);
      });
  },
});

export const postsReducer = postsSlice.reducer;
