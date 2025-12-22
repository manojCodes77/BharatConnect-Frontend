import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { deletePost as deletePostAPI, updatePost as updatePostAPI, likePost as likePostAPI, commentPost as commentPostAPI, savePost as savePostAPI, sharePost as sharePostAPI, getComments as getCommentsAPI } from "../utils/api";
import { deletePost, updatePost, updatePostInteraction } from "../store/postsSlice";
import { MAX_FILE_SIZE, MAX_IMAGES_PER_POST } from "../utils/constants";
import { FaComment, FaShare, FaEllipsisH, FaEdit, FaTrash, FaHeart, FaBookmark, FaImage, FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import ImageSlideshow from "./ImageSlideshow";

const PostCard = ({ post, isMyPost = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editData, setEditData] = useState({
    title: post.title,
    content: post.content,
  });
  // Image editing state
  const [existingImages, setExistingImages] = useState(post.images || []);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  // Initialize liked/saved from post props (comes from backend)
  const [liked, setLiked] = useState(post.isLikedByCurrentUser || false);
  const [saved, setSaved] = useState(post.isSavedByCurrentUser || false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount || 0);
  const [localCommentsCount, setLocalCommentsCount] = useState(
    post.commentsCount || 0
  );
  const [localSharesCount, setLocalSharesCount] = useState(
    post.sharesCount || 0
  );
  const [localComments, setLocalComments] = useState(post.comments || []);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handlePostClick = () => {
    navigate(`/post/${post._id}`);
  };

  // Load comments from API when toggling comments section
  const handleToggleComments = async () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);

    // Load comments if opening and not already loaded
    if (newShowComments && !commentsLoaded && !loadingComments) {
      setLoadingComments(true);
      try {
        const response = await getCommentsAPI(post._id);
        if (response.success) {
          setLocalComments(response.comments || []);
          setLocalCommentsCount(response.commentsCount || 0);
          setCommentsLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const formatDate = (date) => {
    const postDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    const options = { year: "numeric", month: "short", day: "numeric" };
    return postDate.toLocaleDateString(undefined, options);
  };

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      if (
        window.confirm(
          "Please sign in to interact with posts. Go to sign in page?"
        )
      ) {
        navigate("/sign-in");
      }
      return;
    }
    callback();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setLoading(true);
        const response = await deletePostAPI(post._id);
        if (response.success) {
          dispatch(deletePost(post._id));
          toast.success('Post deleted successfully');
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
        toast.error("Failed to delete post");
      } finally {
        setLoading(false);
      }
    }
  };

  // Image editing handlers
  const handleToggleImageDeletion = (imageId) => {
    setImagesToDelete((prev) => {
      if (prev.includes(imageId)) {
        // Unmark for deletion
        return prev.filter((id) => id !== imageId);
      } else {
        // Mark for deletion
        return [...prev, imageId];
      }
    });
  };

  const isImageMarkedForDeletion = (imageId) => {
    return imagesToDelete.includes(imageId);
  };

  // Helper to get image ID (handles both _id and id)
  const getImageId = (image) => image._id || image.id;

  const handleNewImageSelect = (e) => {
    const files = Array.from(e.target.files);
    // Count existing images that are NOT marked for deletion
    const remainingExistingImages = existingImages.filter(img => !imagesToDelete.includes(getImageId(img))).length;
    const totalImages = remainingExistingImages + newImages.length + files.length;

    if (totalImages > MAX_IMAGES_PER_POST) {
      toast.warning(`You can only have up to ${MAX_IMAGES_PER_POST} images per post`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      toast.error(`File(s) too large (max 5MB): ${fileNames}`);
      return;
    }

    setNewImages((prev) => [...prev, ...files]);

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetEditState = () => {
    setIsEditing(false);
    setEditData({ title: post.title, content: post.content });
    setExistingImages(post.images || []);
    setImagesToDelete([]);
    setNewImages([]);
    setNewImagePreviews([]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editData.title || !editData.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append('title', editData.title);
      submitData.append('content', editData.content);

      // Add image IDs to delete
      if (imagesToDelete.length > 0) {
        imagesToDelete.forEach((id) => {
          submitData.append('deleteImageIds', id);
        });
      }

      // Add new images
      newImages.forEach((image) => {
        submitData.append('images', image);
      });

      const response = await updatePostAPI(post._id, submitData);
      if (response.success) {
        // Update local state with response data
        const updatedImages = response.post.images || [];
        setExistingImages(updatedImages);

        dispatch(
          updatePost({
            ...post,
            title: response.post.title,
            content: response.post.content,
            images: updatedImages,
            imagesCount: response.post.imagesCount,
            updatedAt: response.post.updatedAt,
          })
        );
        toast.success('Post updated successfully');
        resetEditState();
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error(error.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    requireAuth(async () => {
      try {
        const newLiked = !liked;
        setLiked(newLiked);
        setLocalLikesCount((prev) =>
          newLiked ? prev + 1 : Math.max(0, prev - 1)
        );

        const response = await likePostAPI(post._id);
        if (response.success) {
          setLocalLikesCount(response.likesCount);
          dispatch(
            updatePostInteraction({
              postId: post._id,
              updates: { likesCount: response.likesCount },
            })
          );
        }
      } catch (error) {
        console.error("Failed to like post:", error);
        setLiked(!liked);
        setLocalLikesCount(post.likesCount || 0);
      }
    });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    requireAuth(async () => {
      try {
        const response = await commentPostAPI(post._id, commentText);
        if (response.success) {
          setLocalComments((prev) => [...prev, response.comment]);
          setLocalCommentsCount(response.commentsCount);
          setCommentText("");
          toast.success('Comment posted');
          dispatch(
            updatePostInteraction({
              postId: post._id,
              updates: {
                comments: [...localComments, response.comment],
                commentsCount: response.commentsCount,
              },
            })
          );
        }
      } catch (error) {
        console.error("Failed to comment:", error);
        toast.error("Failed to post comment");
      }
    });
  };

  const handleSave = async () => {
    requireAuth(async () => {
      try {
        const newSaved = !saved;
        setSaved(newSaved);

        const response = await savePostAPI(post._id);
        if (response.success) {
          // Optionally show success message
          toast.success(response.message || (newSaved ? "Post saved" : "Post unsaved"));
        }
      } catch (error) {
        console.error("Failed to save post:", error);
        setSaved(!saved);
      }
    });
  };

  const handleShare = async () => {
    requireAuth(async () => {
      try {
        // Copy link to clipboard
        const postUrl = `${window.location.origin}/post/${post._id}`;
        await navigator.clipboard.writeText(postUrl);

        // Increment share count
        const response = await sharePostAPI(post._id);
        if (response.success) {
          setLocalSharesCount(response.sharesCount);
          dispatch(
            updatePostInteraction({
              postId: post._id,
              updates: { sharesCount: response.sharesCount },
            })
          );
          toast.success("Link copied to clipboard!");
        }
      } catch (error) {
        console.error("Failed to share post:", error);
        toast.error("Failed to share post");
      }
    });
  };

  // Helper to highlight @mentions
  const highlightMentions = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={index} className="text-orange-600 font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Image Slideshow Modal */}
      {showSlideshow && post.images && post.images.length > 0 && (
        <ImageSlideshow
          images={post.images}
          initialIndex={selectedImageIndex}
          onClose={() => setShowSlideshow(false)}
        />
      )}

      <article className="bg-white border border-black/8 rounded-2xl sm:rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] mb-4 sm:mb-6 overflow-hidden">
        <div className="h-1 bg-linear-to-r from-orange-500 via-orange-400 to-orange-600" />
        <div className="p-4 sm:p-6">
          <header className="mb-4 sm:mb-5 flex items-start justify-between gap-2 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <span className="relative inline-flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 text-base sm:text-lg font-bold text-white shadow-lg shadow-orange-500/30">
                {post.authorId?.name?.charAt(0).toUpperCase() || "U"}
                <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-white bg-emerald-400" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-black truncate">
                  {post.authorId?.name || "Unknown User"}
                </h3>
                <p className="mt-1 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-black/40">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            {isMyPost && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-full border border-black/10 p-1.5 sm:p-2 text-black/40 transition hover:border-orange-400/60 hover:text-black"
                  aria-haspopup="menu"
                  aria-expanded={showMenu}
                >
                  <FaEllipsisH className="text-sm sm:text-base" />
                </button>

                {showMenu && (
                  <div
                    className="absolute right-0 mt-2 sm:mt-3 w-44 sm:w-48 overflow-hidden rounded-xl sm:rounded-2xl border border-black/5 bg-white shadow-xl z-10"
                    role="menu"
                  >
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-black/70 transition hover:bg-orange-500/5"
                    >
                      <FaEdit className="text-orange-500" />
                      <span>Edit story</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex w-full items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <FaTrash />
                      <span>{loading ? "Deleting..." : "Remove"}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </header>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-lg font-semibold text-black/80 transition focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(255,107,44,0.18)]"
              />
              <textarea
                value={editData.content}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
                rows="4"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/70 transition focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(255,107,44,0.18)]"
              ></textarea>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-black/50">Current Images (click to mark for removal)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {existingImages.map((image, index) => {
                      const imageId = getImageId(image);
                      const isMarked = isImageMarkedForDeletion(imageId);
                      return (
                        <div
                          key={imageId || `existing-${index}`}
                          className="relative cursor-pointer group"
                          onClick={() => handleToggleImageDeletion(imageId)}
                        >
                          <img
                            src={image.url}
                            alt="Post image"
                            className={`w-full h-24 object-cover rounded-xl border-2 transition-all ${isMarked
                                ? "border-red-400 opacity-50 grayscale"
                                : "border-black/10 group-hover:border-orange-300"
                              }`}
                          />
                          {/* Toggle indicator */}
                          <div
                            className={`absolute inset-0 rounded-xl flex items-center justify-center transition-all ${isMarked
                                ? "bg-red-500/30"
                                : "bg-black/0 group-hover:bg-black/10"
                              }`}
                          >
                            <div
                              className={`rounded-full p-2 transition-all ${isMarked
                                  ? "bg-red-500 text-white"
                                  : "bg-white/80 text-black/40 opacity-0 group-hover:opacity-100"
                                }`}
                            >
                              {isMarked ? (
                                <FaPlus className="text-sm" title="Click to restore" />
                              ) : (
                                <FaMinus className="text-sm" title="Click to remove" />
                              )}
                            </div>
                          </div>
                          {/* Badge */}
                          {isMarked && (
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                              Will delete
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New Image Previews */}
              {newImagePreviews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-black/50">New Images</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl border border-green-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                          title="Remove image"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {/* Add Image Button */}
                {(existingImages.filter(img => !imagesToDelete.includes(getImageId(img))).length + newImages.length) < 5 && (
                  <label className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-black/60 transition hover:border-orange-400/60 hover:bg-orange-500/5 hover:text-black cursor-pointer">
                    <FaImage className="text-orange-500" />
                    <span>Add images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewImageSelect}
                      className="hidden"
                    />
                  </label>
                )}

                <div className="flex-1" />

                <button
                  type="button"
                  onClick={resetEditState}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/60 transition hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black/90 disabled:translate-y-0 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          ) : (
            <div onClick={handlePostClick} className="space-y-2 sm:space-y-3 cursor-pointer">
              <h2 className="text-lg sm:text-xl font-semibold text-black wrap-break-word">{post.title}</h2>
              <p className="text-sm leading-relaxed text-black/70 whitespace-pre-wrap wrap-break-word">
                {post.content}
              </p>

              {/* Display Post Images */}
              {post.images && post.images.length > 0 && (
                <div className="-mx-4 sm:-mx-6 mt-3">
                  {/* Single Image */}
                  {post.images.length === 1 && (
                    <div
                      className="relative overflow-hidden cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(0);
                        setShowSlideshow(true);
                      }}
                    >
                      <img
                        src={post.images[0].url}
                        alt="Post image"
                        className="w-full object-cover group-hover:opacity-95 transition-opacity duration-200"
                        style={{ maxHeight: '500px' }}
                      />
                      {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                     */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold">
                          View
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Two Images */}
                  {post.images.length === 2 && (
                    <div className="grid grid-cols-2 gap-0.5">
                      {post.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative overflow-hidden cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(index);
                            setShowSlideshow(true);
                          }}
                        >
                          <img
                            src={image.url}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-200"
                            style={{ height: '280px' }}
                          />
                          {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" /> */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold">
                              View
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Three Images */}
                  {post.images.length === 3 && (
                    <div className="grid grid-cols-2 gap-0.5">
                      <div
                        className="relative overflow-hidden cursor-pointer group row-span-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(0);
                          setShowSlideshow(true);
                        }}
                      >
                        <img
                          src={post.images[0].url}
                          alt="Post image 1"
                          className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-200"
                          style={{ height: '100%', minHeight: '280px' }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                      </div>
                      {post.images.slice(1, 3).map((image, index) => (
                        <div
                          key={index + 1}
                          className="relative overflow-hidden cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(index + 1);
                            setShowSlideshow(true);
                          }}
                        >
                          <img
                            src={image.url}
                            alt={`Post image ${index + 2}`}
                            className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-200"
                            style={{ height: '140px' }}
                          />
                          {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                           */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold">
                              View
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Four Images */}
                  {post.images.length === 4 && (
                    <div className="grid grid-cols-2 gap-0.5">
                      {post.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative overflow-hidden cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(index);
                            setShowSlideshow(true);
                          }}
                        >
                          <img
                            src={image.url}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-200"
                            style={{ height: '200px' }}
                          />
                          {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" /> */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold">
                              View
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Five or More Images */}
                  {post.images.length >= 5 && (
                    <div className="grid grid-cols-2 gap-0.5">
                      {post.images.slice(0, 4).map((image, index) => (
                        <div
                          key={index}
                          className="relative overflow-hidden cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(index);
                            setShowSlideshow(true);
                          }}
                        >
                          <img
                            src={image.url}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-200"
                            style={{ height: '200px' }}
                          />
                          {index === 3 && post.images.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-3xl font-bold">
                                +{post.images.length - 4}
                              </span>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="border-t border-black/5 bg-black/5">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-black/50">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition ${liked ? "bg-orange-500/10 text-orange-600" : "hover:bg-black/5"
                }`}
            >
              <FaHeart className={`text-xs sm:text-sm ${liked ? "text-orange-500" : ""}`} />
              <span>{localLikesCount > 0 ? `${localLikesCount}` : "Like"}</span>
            </button>
            <button
              onClick={handleToggleComments}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition hover:bg-black/5"
            >
              <FaComment className="text-xs sm:text-sm" />
              <span>
                {localCommentsCount > 0 ? `${localCommentsCount}` : "Comment"}
              </span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition hover:bg-black/5"
            >
              <FaShare className="text-xs sm:text-sm" />
              <span>
                {localSharesCount > 0 ? `${localSharesCount}` : "Share"}
              </span>
            </button>
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 transition ${saved ? "bg-orange-500/10 text-orange-600" : "hover:bg-black/5"
                }`}
            >
              <FaBookmark className="text-xs sm:text-sm" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="border-t border-black/5 bg-white px-4 sm:px-6 py-3 sm:py-4">
              {/* Comment Input */}
              {isAuthenticated ? (
                <form onSubmit={handleComment} className="mb-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment... (use @name to mention someone)"
                    rows="2"
                    className="w-full rounded-xl sm:rounded-2xl border border-black/10 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black/70 transition focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(255,107,44,0.18)] resize-none"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="rounded-full bg-orange-500 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-4 rounded-xl sm:rounded-2xl bg-orange-500/5 p-3 sm:p-4 text-center">
                  <p className="text-xs sm:text-sm text-black/60">
                    <button
                      onClick={() => navigate("/sign-in")}
                      className="font-semibold text-orange-600 hover:underline"
                    >
                      Sign in
                    </button>{" "}
                    to comment on this post
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-3 sm:space-y-4">
                {loadingComments ? (
                  <p className="text-center text-xs sm:text-sm text-black/40">
                    Loading comments...
                  </p>
                ) : localComments.length === 0 ? (
                  <p className="text-center text-xs sm:text-sm text-black/40">
                    No comments yet. Be the first!
                  </p>
                ) : (
                  localComments.map((comment, index) => (
                    <div key={index} className="flex gap-2 sm:gap-3">
                      <span className="inline-flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs sm:text-sm font-bold text-orange-600">
                        {comment.userId?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="rounded-xl sm:rounded-2xl bg-black/5 px-3 sm:px-4 py-2 sm:py-3">
                          <p className="text-xs sm:text-sm font-semibold text-black">
                            {comment.userId?.name || "Unknown User"}
                          </p>
                          <p className="mt-1 text-xs sm:text-sm text-black/70 wrap-break-word">
                            {highlightMentions(comment.text)}
                          </p>
                        </div>
                        <p className="mt-1 px-3 sm:px-4 text-[0.65rem] sm:text-xs text-black/40">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </footer>
      </article>
    </>
  );
};

export default PostCard;
