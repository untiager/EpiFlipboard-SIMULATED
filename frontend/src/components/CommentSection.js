import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getComments, postComment, deleteComment, updateComment } from '../services/api';
import CommentItem from './CommentItem';
import './CommentSection.css';

const CommentSection = ({ articleId }) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(articleId);
      setComments(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const comment = await postComment(articleId, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
      setError(null);
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      setError(null);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('Failed to delete comment. Please try again.');
    }
  };

  const handleUpdate = async (commentId, content) => {
    try {
      const updatedComment = await updateComment(commentId, content);
      setComments(comments.map(c => 
        c.id === commentId 
          ? { ...c, content: updatedComment.content, updated_at: updatedComment.updated_at }
          : c
      ));
      setError(null);
    } catch (err) {
      console.error('Failed to update comment:', err);
      setError('Failed to update comment. Please try again.');
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <h2 className="comment-section-title">
          💬 Comments ({comments.length})
        </h2>
      </div>

      {isAuthenticated ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="comment-form-header">
            <span className="comment-form-avatar">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </span>
            <span className="comment-form-username">{user?.username}</span>
          </div>
          <textarea
            className="comment-form-textarea"
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={2000}
            rows={3}
            disabled={submitting}
          />
          <div className="comment-form-footer">
            <span className="comment-form-counter">
              {newComment.length}/2000
            </span>
            <button 
              type="submit" 
              className="comment-form-submit"
              disabled={!newComment.trim() || submitting}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <p>Please <a href="/login">log in</a> to leave a comment</p>
        </div>
      )}

      {error && (
        <div className="comment-error">
          {error}
        </div>
      )}

      <div className="comments-list">
        {loading ? (
          <div className="comments-loading">
            <div className="loading-spinner"></div>
            <p>Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        ) : (
          <div className="no-comments">
            <div className="no-comments-icon">💬</div>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
