// TetrisGrid.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanStatus } from '../types';
import './TetrisGrid.css';

interface TetrisGridProps {
  width: number;
  height: number;
  activeStatus: KanbanStatus | null;
}

interface DroppableCellProps {
  x: number;
  y: number;
  rowStatus: KanbanStatus;
  activeStatus: KanbanStatus | null;
}

const DroppableCell: React.FC<DroppableCellProps> = ({ x, y, rowStatus, activeStatus }) => {
  const { setNodeRef } = useDroppable({
    id: `cell-${x}-${y}`,
  });

  return (
      <div
          ref={setNodeRef}
          className={`tetris-cell ${rowStatus === activeStatus ? 'active' : ''}`}
          data-status={rowStatus}
          data-position={`${x},${y}`}
      />
  );
};

const TetrisGrid: React.FC<TetrisGridProps> = ({ width, height, activeStatus }) => {
  // Define row ranges for each status
  const statusSections: { [key in KanbanStatus]: { start: number; end: number } } = {
    Todo: { start: 0, end: 3 },
    InProgress: { start: 3, end: 6 },
    Test: { start: 6, end: 9 },
    Done: { start: 9, end: 12 },
  };

  const renderGrid = () => {
    const rows = [];
    for (let y = 0; y < height; y++) {
      let rowStatus: KanbanStatus = 'Todo';
      if (y >= statusSections.Todo.start && y < statusSections.Todo.end) {
        rowStatus = 'Todo';
      } else if (y >= statusSections.InProgress.start && y < statusSections.InProgress.end) {
        rowStatus = 'InProgress';
      } else if (y >= statusSections.Test.start && y < statusSections.Test.end) {
        rowStatus = 'Test';
      } else if (y >= statusSections.Done.start && y < statusSections.Done.end) {
        rowStatus = 'Done';
      }
      const cells = [];
      for (let x = 0; x < width; x++) {
        cells.push(
            <DroppableCell key={`${x}-${y}`} x={x} y={y} rowStatus={rowStatus} activeStatus={activeStatus} />
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
