import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faBuilding, 
  faClock, 
  faComment,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { Ticket } from '../TicketTable/TicketTable';
import './TicketTiles.css';

interface TicketTilesProps {
  tickets: Ticket[];
}

export const TicketTiles: React.FC<TicketTilesProps> = ({ tickets }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ticket-tiles">
      {tickets.map((ticket) => (
        <div 
          key={ticket.id} 
          className={`ticket-tile status-${ticket.status.toLowerCase().replace(/\s+/g, '-')} ${!ticket.assignee ? 'unassigned' : ''}`}
        >
          <div className="ticket-tile-header">
            <span className="ticket-tile-id">{ticket.id}</span>
            <div>
              <span className={`priority-badge priority-${ticket.priority}`}>
                {ticket.priority}
              </span>
              {!ticket.assignee && (
                <span className="unassigned-warning" title="Unassigned ticket">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </span>
              )}
            </div>
          </div>
          <h3 className="ticket-tile-title">{ticket.title}</h3>
          <span className="status-badge">{ticket.status}</span>
          <div className="ticket-tile-meta">
            <span className="ticket-tile-meta-item">
              <FontAwesomeIcon icon={faUser} />
              {ticket.creator}
            </span>
            <span className="ticket-tile-meta-item">
              <FontAwesomeIcon icon={faBuilding} />
              {ticket.business}
            </span>
            <span className="ticket-tile-meta-item">
              <FontAwesomeIcon icon={faClock} />
              {formatDate(ticket.createdAt)}
            </span>
          </div>
          <div className="ticket-tile-footer">
            <span className="ticket-tile-meta-item">
              <FontAwesomeIcon icon={faComment} />
              {ticket.updates} updates
            </span>
            <span className="ticket-tile-meta-item">
              Assigned to: {ticket.assignee}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
