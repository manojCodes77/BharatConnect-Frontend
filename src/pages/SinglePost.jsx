import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";
import { getPostById } from "../utils/api";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPostById(id);
        if (response && response._id) {
          setPost(response);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
            {error || "Post not found"}
          </h2>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-black px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black/90"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isMyPost = user?._id === post.authorId?._id;

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <div className="max-w-[600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-black/70 transition hover:bg-black/5"
        >
          ← Back
        </button>
        <PostCard post={post} isMyPost={isMyPost} />
      </div>
    </div>
  );
};

export default SinglePost;
