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
  {
    id: 'TKT003',
    title: 'Need help with API integration',
    priority: 'low',
    status: 'New',
    creator: 'Mike Anderson',
    business: 'Dev Solutions Ltd',
    assignee: '', // empty string is unassigned
    createdAt: new Date('2024-01-17T14:20:00'),
    updates: 0
  },
  {
    id: 'TKT004',
    title: 'Update payment gateway configuration',
    priority: 'high',
    status: 'Completed',
    creator: 'Sarah Parker',
    business: 'Finance Plus Inc',
    assignee: 'Bob Wilson',
    createdAt: new Date('2024-01-14T16:45:00'),
    updates: 8
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
        {mockTickets.map((ticket) => (
          <tr key={ticket.id} className={getRowClass(ticket)}>
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
