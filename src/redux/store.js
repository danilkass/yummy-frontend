import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import searchReducer from "./slices/searchQuery";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    searchQuery: searchReducer,
  },
});

export default store;
