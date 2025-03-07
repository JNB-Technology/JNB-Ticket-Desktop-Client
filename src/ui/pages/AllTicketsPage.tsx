import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TicketTable, Ticket } from '../components/TicketTable/TicketTable';
import { TicketTiles } from '../components/TicketTiles/TicketTiles';
import { ViewToggle, ViewMode } from '../components/ViewToggle/ViewToggle';
import mockTicketsData from '../../mockdata/mockTickets.json';

export const AllTicketsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [mockTickets, setMockTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const tickets = (mockTicketsData as any[]).map(ticket => ({
      ...ticket,
      createdAt: new Date(ticket.createdAt)
    }));
    setMockTickets(tickets);
  }, []);

  const renderContent = () => {
    switch (viewMode) {
      case 'table':
        return <TicketTable tickets={mockTickets} onSelectTicket={() => {}} />;
      case 'tiles':
        return <TicketTiles tickets={mockTickets} />;
      case 'json':
        return (
          <div className="json-view-container">
            <SyntaxHighlighter 
              language="json"
              style={vscDarkPlus}
              customStyle={{
                background: 'var(--syntax-bg, var(--panel-bg-color))',
                padding: '16px',
                borderRadius: '8px',
                margin: 0,
              }}
            >
              {JSON.stringify(mockTickets, null, 2)}
            </SyntaxHighlighter>
          </div>
        );
      default:
        return <TicketTable tickets={mockTickets} onSelectTicket={() => {}} />;
    }
  };

  return (
    <div className="page-container">
      <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      <div className="content-container">
        {renderContent()}
      </div>
    </div>
  );
};