import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './CommentItem.css';

const CommentItem = ({ comment, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = user && user.id === comment.user_id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleUpdate = async () => {
    if (!editedContent.trim() || editedContent === comment.content) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(comment.id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <span className="comment-avatar">{comment.username[0].toUpperCase()}</span>
          <span className="comment-username">{comment.username}</span>
        </div>
        <div className="comment-meta">
          <span className="comment-date">{formatDate(comment.created_at)}</span>
          {comment.updated_at !== comment.created_at && (
            <span className="comment-edited">(edited)</span>
          )}
        </div>
      </div>

      <div className="comment-body">
        {isEditing ? (
          <div className="comment-edit-form">
            <textarea
              className="comment-edit-textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              maxLength={2000}
              rows={3}
              disabled={isSubmitting}
            />
            <div className="comment-edit-actions">
              <button 
                className="comment-btn comment-btn-cancel"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="comment-btn comment-btn-save"
                onClick={handleUpdate}
                disabled={isSubmitting || !editedContent.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-content">{comment.content}</p>
            {isOwner && (
              <div className="comment-actions">
                <button 
                  className="comment-action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button 
                  className="comment-action-btn comment-action-delete"
                  onClick={() => onDelete(comment.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
