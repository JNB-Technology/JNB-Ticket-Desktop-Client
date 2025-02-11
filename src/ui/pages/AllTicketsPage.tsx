import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TicketTable, Ticket } from '../components/TicketTable/TicketTable';
import { TicketTiles } from '../components/TicketTiles/TicketTiles';
import { ViewToggle, ViewMode } from '../components/ViewToggle/ViewToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faCommentDots, faTimes, faUserEdit, faImage } from '@fortawesome/free-solid-svg-icons';
import mockTicketsData from '../../mockdata/mockTickets.json';

interface Comment {
  author: string;
  text: string;
  createdAt: string;
}

interface TicketWithDetails extends Ticket {
  comments?: Comment[];
  imageLinks?: string[];
}

export const AllTicketsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedTicket, setSelectedTicket] = useState<TicketWithDetails | null>(null);
  const [mockTickets, setMockTickets] = useState<TicketWithDetails[]>([]);

  useEffect(() => {
    // Parse the JSON data and convert date strings to Date objects
    const tickets: TicketWithDetails[] = (mockTicketsData as unknown as TicketWithDetails[]).map(ticket => ({
      ...ticket,
      createdAt: new Date(ticket.createdAt)
    }));
    setMockTickets(tickets);
  }, []);

  const renderContent = () => {
    switch (viewMode) {
      case 'table':
        return <TicketTable tickets={mockTickets} onSelectTicket={setSelectedTicket} />;
      case 'tiles':
        return <TicketTiles tickets={mockTickets} />;
      case 'json':
        return (
          <div className="json-view-container" style={{ maxHeight: 'calc(100vh - 180px)', overflow: 'auto' }}>
            <SyntaxHighlighter 
              language="json"
              style={vscDarkPlus}
              customStyle={{
                background: 'var(--syntax-bg, var(--panel-bg-color))',
                color: 'var(--syntax-color, var(--text-color))',
                padding: '16px',
                borderRadius: '8px',
                margin: 0,
              }}
              showLineNumbers={true}
              lineNumberStyle={{
                color: 'var(--secondary-text)',
                opacity: 0.5,
              }}
            >
              {JSON.stringify(mockTickets, null, 2)}
            </SyntaxHighlighter>
          </div>
        );
      default:
        return <TicketTable tickets={mockTickets} onSelectTicket={setSelectedTicket} />;
    }
  };

  return (
    <div className="page-container" style={{ overflow: 'hidden' }}>
      <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      <div className="content-container" style={{ overflow: 'hidden' }}>
        <div className={`tickets-container ${selectedTicket ? 'with-details' : ''}`} style={{ overflowY: 'auto', margin: 0 }}>
          {renderContent()}
        </div>
        {selectedTicket && (
          <div className="details-container" style={{ overflowY: 'auto', margin: 0 }}>
            <div className="details-header">
              <h2>{selectedTicket.id}</h2>
              <button onClick={() => setSelectedTicket(null)} title="Close">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="details-content">
              <div className="ticket-info">
                <div className="ticket-info-item">
                  <strong>Creator:</strong> {selectedTicket.creator}
                </div>
                <div className="ticket-info-item">
                  <strong>Assignee:</strong> {selectedTicket.assignee || 'Unassigned'}
                  <button className="assign-button" title="Change Assignee">
                    <FontAwesomeIcon icon={faUserEdit} /> Change Assignee
                  </button>
                </div>
              </div>
              <hr className="separator-line" />
              <div className="ticket-description">
                <h3>Description</h3>
                <p>{selectedTicket.description}</p>
              </div>
              <hr className="separator-line" />
              <div className="ticket-comments">
                <h3>Comments</h3>
                <div className="comments-thread">
                  {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                    selectedTicket.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <div className="comment-header">
                          <strong>{comment.author}</strong> <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p>No comments.</p>
                  )}
                </div>
                <div className="comment-box">
                  <textarea placeholder="Add a comment..."></textarea>
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
              <hr className="separator-line" />
              <div className="ticket-images">
                <h3>Images</h3>
                <div className="images-container">
                  {selectedTicket.imageLinks?.map((link, index) => (
                    <img key={index} src={link} alt={`Ticket image ${index + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};