import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TicketTable, mockTickets } from '../components/TicketTable/TicketTable';
import { TicketTiles } from '../components/TicketTiles/TicketTiles';
import { ViewToggle, ViewMode } from '../components/ViewToggle/ViewToggle';

export const AllTicketsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const renderContent = () => {
    switch (viewMode) {
      case 'table':
        return <TicketTable />;
      case 'tiles':
        return <TicketTiles tickets={mockTickets} />;
      case 'json':
        return (
          <div className="json-view-container" style={{ maxHeight: 'calc(100vh - 180px)', overflow: 'auto' }}>
            <SyntaxHighlighter 
              language="json"
              style={vscDarkPlus}
              customStyle={{
                background: 'var(--panel-bg-color)',
                padding: '16px',
                borderRadius: '8px',
                margin: 0,
              }}
              showLineNumbers={true}
            >
              {JSON.stringify(mockTickets, null, 2)}
            </SyntaxHighlighter>
          </div>
        );
      default:
        return <TicketTable />;
    }
  };

  return (
    <div className="page-container">
      <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      {renderContent()}
    </div>
  );
};