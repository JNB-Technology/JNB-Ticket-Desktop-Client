import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { TicketDetailsOverlay } from '../TicketDetailsOverlay/TicketDetailsOverlay';
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

type SortDirection = 'asc' | 'desc' | null;
type SortField = keyof Ticket | null;

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, onSelectTicket }) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedTickets = () => {
    if (!sortField || !sortDirection) return tickets;

    return [...tickets].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === 'createdAt') {
        const aDate = aValue as Date;
        const bDate = bValue as Date;
        return sortDirection === 'asc' 
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRowClass = (ticket: Ticket): string => {
    const statusClass = `status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`;
    const unassignedClass = !ticket.assignee ? 'unassigned-ticket' : '';
    return `ticket-row ${statusClass} ${unassignedClass}`.trim();
  };

  const getSortIcon = (field: keyof Ticket) => {
    if (sortField !== field) return faSort;
    return sortDirection === 'asc' ? faSortUp : faSortDown;
  };

  return (
    <>
      <table className="ticket-table">
        <thead>
          <tr>
            {(['id', 'title', 'priority', 'status', 'creator', 'business', 'assignee', 'updates', 'createdAt'] as const).map((field) => (
              <th 
                key={field} 
                onClick={() => handleSort(field)}
                className={sortField === field ? 'active-sort' : ''}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <FontAwesomeIcon 
                  icon={getSortIcon(field)} 
                  className={`sort-icon ${sortField === field ? 'active' : ''}`}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getSortedTickets().map((ticket) => (
            <tr 
              key={ticket.id} 
              className={getRowClass(ticket)} 
              onClick={() => {
                setSelectedTicket(ticket);
                onSelectTicket(ticket);
              }}
            >
              <td className="ticket-id">{ticket.id}</td>
              <td className="ticket-title">{ticket.title}</td>
              <td>
                <span>
                  {ticket.priority}
                </span>
              </td>
              <td>
                <span>
                  {ticket.status}
                </span>
              </td>
              <td>{ticket.creator}</td>
              <td>{ticket.business}</td>
              <td>
                <span>
                  {ticket.assignee || 'UNASSIGNED'}
                </span>
              </td>
              <td>
                <span>
                  {ticket.updates}
                </span>
              </td>
              <td>{formatDate(ticket.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTicket && (
        <TicketDetailsOverlay
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
};
