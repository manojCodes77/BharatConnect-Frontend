import { createSlice } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    // Normalized structure: { postId: { items: [], loading: false, loaded: false } }
    // Note: commentsCount comes from post data, not stored here
    byPostId: {},
  },
  reducers: {
    setCommentsLoading: (state, action) => {
      const { postId, loading } = action.payload;
      if (!state.byPostId[postId]) {
        state.byPostId[postId] = { items: [], loading: false, loaded: false };
      }
      state.byPostId[postId].loading = loading;
    },
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      state.byPostId[postId] = {
        items: comments,
        loading: false,
        loaded: true,
      };
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!state.byPostId[postId]) {
        state.byPostId[postId] = { items: [], loading: false, loaded: false };
      }
      state.byPostId[postId].items.push(comment);
    },
    clearComments: (state, action) => {
      const postId = action.payload;
      if (postId) {
        delete state.byPostId[postId];
      } else {
        state.byPostId = {};
      }
    },
  },
});

// Default state to return when postId has no comments - must be a stable reference
const defaultCommentState = { items: [], loading: false, loaded: false };

// Selectors
export const selectCommentsByPostId = (state, postId) => 
  state.comments.byPostId[postId] || defaultCommentState;

export const { setCommentsLoading, setComments, addComment, clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
