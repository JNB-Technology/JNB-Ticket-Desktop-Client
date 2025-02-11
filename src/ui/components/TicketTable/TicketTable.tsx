import React from 'react';
import './TicketTable.css';

export interface Ticket {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  creator: string;
  business: string;
  assignee: string;
  createdAt: Date;
  updates: number;
  description: string; // Added field
}

interface TicketTableProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, onSelectTicket }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityClass = (priority: string): string => {
    return `priority-badge priority-${priority.toLowerCase()}`;
  };

  const getStatusClass = (status: string): string => {
    return `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const getRowClass = (ticket: Ticket): string => {
    const statusClass = `status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`;
    const unassignedClass = !ticket.assignee ? 'unassigned-ticket' : '';
    return `ticket-row ${statusClass} ${unassignedClass}`.trim();
  };

  return (
    <table className="ticket-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Creator</th>
          <th>Business</th>
          <th>Assignee</th>
          <th>Updates</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id} className={getRowClass(ticket)} onClick={() => onSelectTicket(ticket)}>
            <td className="ticket-id">{ticket.id}</td>
            <td>{ticket.title}</td>
            <td>
              <span className={getPriorityClass(ticket.priority)}>
                {ticket.priority}
              </span>
            </td>
            <td>
              <span className={getStatusClass(ticket.status)}>
                {ticket.status}
              </span>
            </td>
            <td>{ticket.creator}</td>
            <td>{ticket.business}</td>
            <td>
              <span className={`assignee-badge ${!ticket.assignee ? 'unassigned' : ''}`}>
                {ticket.assignee || 'UNASSIGNED'}
              </span>
            </td>
            <td>
              <span className="updates-badge">
                {ticket.updates}
              </span>
            </td>
            <td>{formatDate(ticket.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
