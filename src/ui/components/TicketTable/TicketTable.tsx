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
  updates: number; // Added field
}

export const mockTickets: Ticket[] = [
  {
    id: 'TKT001',
    title: 'Unable to access dashboard',
    priority: 'high',
    status: 'Open',
    creator: 'John Smith',
    business: 'Acme Corp',
    assignee: 'Jane Doe',
    createdAt: new Date('2024-01-15T10:30:00'),
    updates: 5
  },
  {
    id: 'TKT002',
    title: 'Login issue after password reset',
    priority: 'medium',
    status: 'In Progress',
    creator: 'Alice Johnson',
    business: 'Tech Corp',
    assignee: 'Bob Wilson',
    createdAt: new Date('2024-01-16T09:15:00'),
    updates: 3
  },
  // Add more mock data as needed
];

export const TicketTable: React.FC = () => {
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
        {mockTickets.map((ticket) => (
          <tr key={ticket.id}>
            <td className="ticket-id">{ticket.id}</td>
            <td>{ticket.title}</td>
            <td>
              <span className={getPriorityClass(ticket.priority)}>
                {ticket.priority}
              </span>
            </td>
            <td>
              <span className="status-badge">
                {ticket.status}
              </span>
            </td>
            <td>{ticket.creator}</td>
            <td>{ticket.business}</td>
            <td>{ticket.assignee}</td>
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
