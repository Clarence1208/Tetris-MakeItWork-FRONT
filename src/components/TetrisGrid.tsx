import React from 'react';
import { KanbanStatus } from '../types';
import './TetrisGrid.css';

interface TetrisGridProps {
  width: number;
  height: number;
  activeStatus: KanbanStatus | null;
  onCellClick?: (x: number, y: number) => void;
}

const TetrisGrid: React.FC<TetrisGridProps> = ({ 
  width, 
  height, 
  activeStatus, 
  onCellClick 
}) => {
  // Define the grid sections for each status
  const statusSections = {
    Todo: { start: 0, end: 5 },
    InProgress: { start: 5, end: 10 },
    Test: { start: 10, end: 15 },
    Done: { start: 15, end: 20 }
  };

  // Generate the grid rows and cells
  const renderGrid = () => {
    const rows = [];
    
    for (let y = 0; y < height; y++) {
      const cells = [];
      let rowStatus: KanbanStatus = 'Todo';
      
      // Determine which status this row belongs to
      if (y >= statusSections.Todo.start && y < statusSections.Todo.end) {
        rowStatus = 'Todo';
      } else if (y >= statusSections.InProgress.start && y < statusSections.InProgress.end) {
        rowStatus = 'InProgress';
      } else if (y >= statusSections.Test.start && y < statusSections.Test.end) {
        rowStatus = 'Test';
      } else if (y >= statusSections.Done.start && y < statusSections.Done.end) {
        rowStatus = 'Done';
      }
      
      for (let x = 0; x < width; x++) {
        cells.push(
          <div 
            key={`${x}-${y}`}
            className={`tetris-cell 
              ${rowStatus === activeStatus ? 'active' : ''}
              ${rowStatus === activeStatus && y % 2 === 0 ? 'highlight-even' : ''}
              ${rowStatus === activeStatus && y % 2 === 1 ? 'highlight-odd' : ''}
            `}
            onClick={() => onCellClick && onCellClick(x, y)}
            data-status={rowStatus}
            data-x={x}
            data-y={y}
          />
        );
      }
      
      rows.push(
        <div key={y} className="tetris-grid-row">
          {cells}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="tetris-grid-container">
      <div className="tetris-grid">
        {renderGrid()}
      </div>
      <div className="tetris-grid-sections">
        {Object.entries(statusSections).map(([status, { start }]) => (
          <div 
            key={status} 
            className={`tetris-grid-section-label ${activeStatus === status ? 'active' : ''}`}
            style={{ top: `${(start / height) * 100}%` }}
          >
            {status}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TetrisGrid; 