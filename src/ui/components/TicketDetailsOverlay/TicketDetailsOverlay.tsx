import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUserEdit, 
  faPaperclip, 
  faImage, 
  faCommentDots,
  faComment,
  faImages,
  faClock,
  faUser,
  faBuilding,
  faExclamationTriangle,
  faCheckCircle,
  faCircle,
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import { Ticket } from '../TicketTable/TicketTable';
import './TicketDetailsOverlay.css';

interface Comment {
  author: string;
  text: string;
  createdAt: string;
  imageLinks?: string[];
}

interface TicketWithDetails extends Ticket {
  comments?: Comment[];
  imageLinks?: string[];
}

interface TicketDetailsOverlayProps {
  ticket: TicketWithDetails;
  onClose: () => void;
}

type TabType = 'details' | 'comments' | 'images' | 'history';

export const TicketDetailsOverlay: React.FC<TicketDetailsOverlayProps> = ({ ticket, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [newComment, setNewComment] = useState('');
  const commentCount = ticket.comments?.length || 0;
  const imageCount = ticket.imageLinks?.length || 0;

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = () => {
    switch (ticket.status.toLowerCase()) {
      case 'completed':
        return faCheckCircle;
      case 'in progress':
        return faCircle;
      case 'open':
        return faExclamationTriangle;
      default:
        return faCircle;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="ticket-details-content">
            <div className="ticket-header">
              <div className="ticket-title-section">
                <h2>{ticket.title}</h2>
                <div className="ticket-meta">
                  <span className={`priority-badge priority-${ticket.priority}`}>
                    {ticket.priority}
                  </span>
                  <span className={`status-badge status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    <FontAwesomeIcon icon={getStatusIcon()} />
                    {ticket.status}
                  </span>
                </div>
              </div>
              <div className="ticket-actions">
                <button className="action-button" title="Edit Ticket">
                  <FontAwesomeIcon icon={faUserEdit} />
                </button>
                <button className="action-button" title="Close Ticket">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>

            <div className="ticket-info-grid">
              <div className="info-item">
                <FontAwesomeIcon icon={faUser} />
                <div>
                  <label>Creator</label>
                  <span>{ticket.creator}</span>
                </div>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faBuilding} />
                <div>
                  <label>Business</label>
                  <span>{ticket.business}</span>
                </div>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faUserEdit} />
                <div>
                  <label>Assignee</label>
                  <span>{ticket.assignee || 'Unassigned'}</span>
                </div>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faClock} />
                <div>
                  <label>Created</label>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="ticket-description">
              <h3>Description</h3>
              <p>{ticket.description}</p>
            </div>
          </div>
        );

      case 'comments':
        return (
          <div className="comments-section">
            <div className="comments-thread">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <div className="comment-header">
                      <div className="comment-author">
                        <FontAwesomeIcon icon={faUser} />
                        <strong>{comment.author}</strong>
                      </div>
                      <span className="comment-time">
                        <FontAwesomeIcon icon={faClock} />
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p>{comment.text}</p>
                    {comment.imageLinks && comment.imageLinks.length > 0 && (
                      <div className="comment-images">
                        {comment.imageLinks.map((link, imgIndex) => (
                          <img 
                            key={imgIndex} 
                            src={link} 
                            alt={`Comment image ${imgIndex + 1}`} 
                            onClick={() => window.open(link, '_blank')}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-content">No comments yet</p>
              )}
            </div>
            <div className="comment-box">
              <textarea 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="comment-actions">
                <button className="upload-button" title="Attach file">
                  <FontAwesomeIcon icon={faPaperclip} />
                </button>
                <button className="image-button" title="Add image">
                  <FontAwesomeIcon icon={faImage} />
                </button>
                <button 
                  className="send-button" 
                  title="Send comment"
                  disabled={!newComment.trim()}
                >
                  <FontAwesomeIcon icon={faCommentDots} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'images':
        return (
          <div className="images-section">
            {ticket.imageLinks && ticket.imageLinks.length > 0 ? (
              <div className="images-grid">
                {ticket.imageLinks.map((link, index) => (
                  <div key={index} className="image-card">
                    <img 
                      src={link} 
                      alt={`Ticket image ${index + 1}`}
                      onClick={() => window.open(link, '_blank')}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-content">No images attached</p>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="history-section">
            <div className="history-timeline">
              <div className="history-item">
                <div className="history-icon">
                  <FontAwesomeIcon icon={faCircle} />
                </div>
                <div className="history-content">
                  <div className="history-header">
                    <strong>Ticket Created</strong>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                  <p>Ticket was created by {ticket.creator}</p>
                </div>
              </div>
              {/* Add more history items here */}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="ticket-details-overlay">
      <div className="ticket-details-container">
        <div className="details-header">
          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <FontAwesomeIcon icon={faComment} />
              Comments {commentCount > 0 && <span className="count">{commentCount}</span>}
            </button>
            <button
              className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
              onClick={() => setActiveTab('images')}
            >
              <FontAwesomeIcon icon={faImages} />
              Images {imageCount > 0 && <span className="count">{imageCount}</span>}
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <FontAwesomeIcon icon={faHistory} />
              History
            </button>
          </div>
          <button onClick={onClose} title="Close">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
