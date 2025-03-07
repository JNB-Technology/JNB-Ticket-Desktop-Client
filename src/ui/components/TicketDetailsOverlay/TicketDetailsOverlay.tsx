import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUserEdit, 
  faPaperclip, 
  faImage, 
  faCommentDots,
  faComment,
  faImages
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

type TabType = 'details' | 'comments' | 'images';

export const TicketDetailsOverlay: React.FC<TicketDetailsOverlayProps> = ({ ticket, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const commentCount = ticket.comments?.length || 0;
  const imageCount = ticket.imageLinks?.length || 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <>
            <div className="ticket-info">
              <div className="ticket-info-item">
                <strong>Creator:</strong> {ticket.creator}
              </div>
              <div className="ticket-info-item">
                <strong>Assignee:</strong> {ticket.assignee || 'Unassigned'}
                <button className="assign-button" title="Change Assignee">
                  <FontAwesomeIcon icon={faUserEdit} /> Change Assignee
                </button>
              </div>
            </div>
            <div className="ticket-description">
              <h3>Description</h3>
              <p>{ticket.description}</p>
            </div>
          </>
        );

      case 'comments':
        return (
          <div className="comments-section">
            <div className="comments-thread">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <div className="comment-header">
                      <strong>{comment.author}</strong>
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
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
              <textarea placeholder="Add a comment..."></textarea>
              <div className="comment-actions">
                <button className="upload-button">
                  <FontAwesomeIcon icon={faPaperclip} />
                </button>
                <button className="image-button">
                  <FontAwesomeIcon icon={faImage} />
                </button>
                <button className="send-button">
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
    }
  };

  return (
    <div className="ticket-details-overlay">
      <div className="ticket-details-content">
        <div className="details-header">
          <h2>{ticket.id}</h2>
          <button onClick={onClose} title="Close">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="tabs-container">
          <div className="tabs-header">
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
          </div>
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
