import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTable, 
  faTh, 
  faCode, 
  faFilter 
} from '@fortawesome/free-solid-svg-icons';
import './ViewToggle.css';

export type ViewMode = 'table' | 'tiles' | 'json';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="view-toggle-container">
      <div className="view-toggle">
        <button
          className={`view-toggle-button ${currentView === 'table' ? 'active' : ''}`}
          onClick={() => onViewChange('table')}
          title="Table View"
        >
          <FontAwesomeIcon icon={faTable} />
          <span>Table</span>
        </button>
        <button
          className={`view-toggle-button ${currentView === 'tiles' ? 'active' : ''}`}
          onClick={() => onViewChange('tiles')}
          title="Tiles View"
        >
          <FontAwesomeIcon icon={faTh} />
          <span>Tiles</span>
        </button>
        <button
          className={`view-toggle-button ${currentView === 'json' ? 'active' : ''}`}
          onClick={() => onViewChange('json')}
          title="JSON View"
        >
          <FontAwesomeIcon icon={faCode} />
          <span>JSON</span>
        </button>
      </div>
      
      <div className="view-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tickets..."
            className="search-input"
          />
        </div>
        <button className="filter-button" title="Filter tickets">
          <FontAwesomeIcon icon={faFilter} />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};
