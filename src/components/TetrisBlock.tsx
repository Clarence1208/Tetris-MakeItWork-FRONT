import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import './TetrisBlock.css';

interface TetrisBlockProps {
  task: Task;
}

const TetrisBlock: React.FC<TetrisBlockProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Generate blocks based on the shape and number of skills
  const renderSkillBlocks = () => {
    const skillCount = task.skills.length;
    const shape = task.shape;
    
    // Create arrays to represent the grid layout of each shape
    let layout: boolean[][] = [];
    
    switch (shape) {
      case 'I': // I shape - horizontal or vertical line
        if (skillCount <= 4) {
          // For 1-4 skills, create a horizontal line
          layout = [Array(skillCount).fill(true)];
        } else {
          // For more than 4, create a vertical line and then wrap
          const rows = Math.ceil(skillCount / 4);
          layout = Array(rows).fill(null).map((_, rowIndex) => {
            return Array(Math.min(4, skillCount - rowIndex * 4)).fill(true);
          });
        }
        break;
        
      case 'L': // L shape
        if (skillCount <= 3) {
          // Simple L shape for 3 skills
          layout = [
            [true, false],
            [true, false],
            [true, true]
          ].slice(0, skillCount);
        } else {
          // Extended L shape for more skills
          layout = [
            [true, false, false],
            [true, false, false],
            [true, true, true]
          ];
          
          // Add more blocks if needed
          let remaining = skillCount - 5;
          if (remaining > 0) {
            layout[0][2] = true; // Add one more at the top
            remaining--;
          }
          if (remaining > 0) {
            layout.push([true, true, false]); // Add another row
          }
        }
        break;
        
      case 'J': // J shape - mirrored L
        if (skillCount <= 3) {
          // Simple J shape for 3 skills
          layout = [
            [false, true],
            [false, true],
            [true, true]
          ].slice(0, skillCount);
        } else {
          // Extended J shape for more skills
          layout = [
            [false, false, true],
            [false, false, true],
            [true, true, true]
          ];
          
          // Add more blocks if needed
          let remaining = skillCount - 5;
          if (remaining > 0) {
            layout[0][0] = true; // Add one more at the top
            remaining--;
          }
          if (remaining > 0) {
            layout.push([false, true, true]); // Add another row
          }
        }
        break;
        
      case 'O': // O shape - square
        const sideLength = Math.ceil(Math.sqrt(skillCount));
        layout = Array(sideLength).fill(null).map((_, rowIndex) => {
          return Array(sideLength).fill(false).map((_, colIndex) => {
            const index = rowIndex * sideLength + colIndex;
            return index < skillCount; // true if we still have skills to display
          });
        });
        break;
        
      case 'S': // S shape
        if (skillCount <= 4) {
          // Simple S shape
          layout = [
            [false, true, true],
            [true, true, false]
          ].slice(0, skillCount);
        } else {
          // Extended S shape
          layout = [
            [false, true, true],
            [true, true, false],
            [false, true, true]
          ];
          
          // Add more blocks if needed
          if (skillCount > 7) {
            layout.push([true, true, false]);
          }
        }
        break;
        
      case 'T': // T shape
        if (skillCount <= 4) {
          // Simple T shape
          layout = [
            [true, true, true],
            [false, true, false]
          ].slice(0, skillCount);
        } else {
          // Extended T shape
          layout = [
            [true, true, true],
            [false, true, false],
            [false, true, false]
          ];
          
          // Add more blocks if needed
          if (skillCount > 5) {
            layout[2][0] = true;
            if (skillCount > 6) {
              layout[2][2] = true;
            }
          }
        }
        break;
        
      case 'Z': // Z shape
        if (skillCount <= 4) {
          // Simple Z shape
          layout = [
            [true, true, false],
            [false, true, true]
          ].slice(0, skillCount);
        } else {
          // Extended Z shape
          layout = [
            [true, true, false],
            [false, true, true],
            [true, true, false]
          ];
          
          // Add more blocks if needed
          if (skillCount > 7) {
            layout.push([false, true, true]);
          }
        }
        break;
        
      default:
        // Fallback to a simple line
        layout = [Array(skillCount).fill(true)];
    }
    
    // Convert the layout to actual blocks
    let blockIndex = 0;
    return (
      <div className={`tetris-shape ${shape}`}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="tetris-row">
            {row.map((isVisible, colIndex) => {
              if (isVisible && blockIndex < skillCount) {
                const skillName = task.skills[blockIndex];
                blockIndex++;
                return (
                  <div 
                    key={colIndex}
                    className={`skill-block ${shape}`}
                    title={`${task.title} - ${skillName}`}
                  />
                );
              } else {
                return <div key={colIndex} className="empty-block" />;
              }
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`tetris-block-container ${task.shape}`}
      title={task.title}
    >
      {renderSkillBlocks()}
    </div>
  );
};

export default TetrisBlock; 