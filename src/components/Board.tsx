import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {KanbanBoard, KanbanColumn, KanbanStatus, Task} from '../types';
import TetrisBlock from './TetrisBlock';
import TetrisGrid from './TetrisGrid';
import './Board.css';

// Grid dimensions
const GRID_WIDTH = 15;
const GRID_HEIGHT = 20;
const CELL_SIZE = 30; // size of each grid cell in pixels

// Sample data for initial state
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Create UI Components',
    skills: ['React', 'CSS', 'HTML'],
    shape: 'I',
    status: 'Todo',
  },
  {
    id: '2',
    title: 'Implement API',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST'],
    shape: 'L',
    status: 'Todo',
  },
  {
    id: '3',
    title: 'Design Database',
    skills: ['MongoDB', 'Schema Design'],
    shape: 'T',
    status: 'InProgress',
  },
  {
    id: '4',
    title: 'Write Tests',
    skills: ['Jest', 'Testing', 'Cypress', 'QA', 'Documentation'],
    shape: 'O',
    status: 'InProgress',
  },
  {
    id: '5',
    title: 'Deploy Application',
    skills: ['DevOps', 'AWS', 'CI/CD'],
    shape: 'Z',
    status: 'Done',
  },
  {
    id: '6',
    title: 'Security Review',
    skills: ['Auth', 'Encryption'],
    shape: 'J',
    status: 'Test',
  },
  {
    id: '7',
    title: 'Performance Optimization',
    skills: ['Webpack', 'Code Splitting', 'Lazy Loading', 'Caching'],
    shape: 'S',
    status: 'Test',
  },
];

const initialColumns: KanbanColumn[] = [
  {
    id: 'Todo' as KanbanStatus,
    title: 'To Do',
    tasks: initialTasks.filter(task => task.status === 'Todo'),
    gridRowStart: 0,
    gridRowEnd: 5,
  },
  {
    id: 'InProgress' as KanbanStatus,
    title: 'In Progress',
    tasks: initialTasks.filter(task => task.status === 'InProgress'),
    gridRowStart: 10,
    gridRowEnd: 15,
  },
  {
    id: 'Test' as KanbanStatus,
    title: 'Testing',
    tasks: initialTasks.filter(task => task.status === 'Test'),
    gridRowStart: 10,
    gridRowEnd: 15,
  },
  {
    id: 'Done' as KanbanStatus,
    title: 'Done',
    tasks: initialTasks.filter(task => task.status === 'Done'),
    gridRowStart: 15,
    gridRowEnd: 20,
  },
];

// Initialize empty grid
const createEmptyGrid = () => {
  const grid: (string | null)[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid[y][x] = null;
    }
  }
  return grid;
};

const initialBoard: KanbanBoard = {
  columns: initialColumns,
  grid: createEmptyGrid(),
};

// Add this new function after the createEmptyGrid function
const synchronizeGridWithTasks = (currentBoard: KanbanBoard): KanbanBoard => {
  console.log('===== SYNCHRONIZING GRID WITH TASKS =====');
  
  // Create a fresh empty grid
  const newGrid = createEmptyGrid();
  
  // Keep track of placed tasks
  const placedTasks = new Set<string>();
  
  // First, place all tasks with existing grid positions
  currentBoard.columns.forEach(column => {
    column.tasks.forEach(task => {
      if (task.gridPosition) {
        const { x, y } = task.gridPosition;
        
        // Verify position is within bounds
        if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
          // Check if position is already occupied
          if (newGrid[y][x] === null) {
            newGrid[y][x] = task.id;
            placedTasks.add(task.id);
          } else {
            console.warn(`Position (${x}, ${y}) already occupied by ${newGrid[y][x]}, task ${task.id} needs relocation`);
          }
        } else {
          console.warn(`Task ${task.id} has out-of-bounds position: (${x}, ${y})`);
        }
      }
    });
  });
  
  // Now handle tasks without positions or with invalid positions
  const columnRowRanges = {
    'Todo': { start: 0, end: 5 },
    'InProgress': { start: 5, end: 10 },
    'Test': { start: 10, end: 15 },
    'Done': { start: 15, end: 20 }
  };
  
  currentBoard.columns.forEach(column => {
    const rowRange = columnRowRanges[column.id];
    let nextX = 0;
    let nextY = rowRange.start;
    
    column.tasks.forEach(task => {
      // Skip tasks that are already placed
      if (placedTasks.has(task.id)) return;
      
      // Find next available position in this column's range
      let found = false;
      for (let y = rowRange.start; y < rowRange.end && !found; y++) {
        for (let x = 0; x < GRID_WIDTH && !found; x++) {
          if (newGrid[y][x] === null) {
            newGrid[y][x] = task.id;
            task.gridPosition = { x, y };
            placedTasks.add(task.id);
            found = true;
            
            console.log(`Assigned task ${task.id} to position (${x}, ${y})`);
          }
        }
      }
      
      if (!found) {
        console.error(`Could not find empty position for task ${task.id} in column ${column.id}`);
      }
    });
  });
  
  // Verify all tasks have positions
  let allTasksHavePositions = true;
  currentBoard.columns.forEach(column => {
    column.tasks.forEach(task => {
      if (!task.gridPosition || !placedTasks.has(task.id)) {
        console.error(`Task ${task.id} doesn't have a valid grid position after synchronization`);
        allTasksHavePositions = false;
      }
    });
  });
  
  console.log(`Grid synchronization ${allTasksHavePositions ? 'successful' : 'failed'}`);
  console.log('===== SYNCHRONIZATION COMPLETE =====');
  
  return {
    columns: currentBoard.columns,
    grid: newGrid
  };
};

const Board: React.FC = () => {
  const [board, setBoard] = useState<KanbanBoard>(initialBoard);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeStatus, setActiveStatus] = useState<KanbanStatus | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  
  // Keep a reference to the grid element
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Add a ref to track if we need to sync the grid due to an error
  const needsSyncRef = useRef(false);
  
  // Add error recovery mechanism - check grid consistency periodically
  useEffect(() => {
    // Check if we need to perform a sync
    if (needsSyncRef.current) {
      console.log('🔄 Performing recovery grid sync');
      setBoard(prev => synchronizeGridWithTasks(prev));
      needsSyncRef.current = false;
    }
  }, [board]);

  // Initialize task positions on the grid
  useEffect(() => {
    // Synchronize the grid with tasks on initial render
    setBoard(prev => synchronizeGridWithTasks(prev));
  }, []);

  // Create a memoized function for finding tasks by ID
  const findTaskById = useCallback((taskId: string): Task | undefined => {
    console.log(`Looking for task: ${taskId}`);
    
    let foundTask: Task | undefined;
    let foundInColumn: string | undefined;
    
    for (const column of board.columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        foundTask = { ...task }; // Return a copy to avoid mutation
        foundInColumn = column.id;
        break;
      }
    }
    
    if (foundTask) {
      console.log(`Task ${taskId} found in column: ${foundInColumn}`);
    } else {
      console.error(`Task ${taskId} not found in any column!`);
      
      // Debug: Log all available tasks
      let availableTasks: Array<{id: string, title: string, column: string}> = [];
      board.columns.forEach(column => {
        column.tasks.forEach(task => {
          availableTasks.push({id: task.id, title: task.title, column: column.id});
        });
      });
      console.log('Available tasks:', availableTasks);
    }
    
    return foundTask;
  }, [board.columns]);

  // Handle explicitly clicking a cell to move a task
  const handleCellClick = (x: number, y: number) => {
    if (!activeTask) return;
    console.log('Cell clicked at:', { x, y });
    moveTaskToPosition(activeTask.id, x, y);
    setActiveTask(null);
    setActiveStatus(null);
  };

  // Start dragging a task
  const startDragging = (taskId: string, event: React.MouseEvent) => {
    console.log('===== START DRAGGING =====');
    event.preventDefault();
    event.stopPropagation();
    
    const task = findTaskById(taskId);
    if (!task) {
      console.error('Task not found for dragging:', taskId);
      return;
    }
    
    console.log('Starting drag for task:', task.title);
    setActiveTask(task);
    setActiveStatus(task.status);
    setIsDragging(true);
    
    // Set the initial drag position to mouse coordinates
    setDragPosition({ x: event.clientX, y: event.clientY });
    
    // Add global mouse move and mouse up event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    console.log('===== START DRAGGING COMPLETE =====');
  };
  
  // Handle mouse movement during drag
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !activeTask) return;
    
    // Update the drag position to follow the mouse cursor
    setDragPosition({ x: event.clientX, y: event.clientY });
    
    // Update the status if we're in a different section
    const gridRect = gridRef.current?.getBoundingClientRect();
    if (gridRect) {
      // Calculate grid position
      const gridX = event.clientX - gridRect.left;
      const gridY = event.clientY - gridRect.top;
      
      // Calculate cell position
      const cellX = Math.floor(gridX / CELL_SIZE);
      const cellY = Math.floor(gridY / CELL_SIZE);
      
      // Make sure we're within grid bounds
      if (cellX >= 0 && cellX < GRID_WIDTH && cellY >= 0 && cellY < GRID_HEIGHT) {
        // Determine which status this cell belongs to
        let newStatus: KanbanStatus = 'Todo';
        if (cellY < 5) {
          newStatus = 'Todo';
        } else if (cellY < 10) {
          newStatus = 'InProgress';
        } else if (cellY < 15) {
          newStatus = 'Test';
        } else {
          newStatus = 'Done';
        }
        
        // Update status if needed
        if (activeTask.status !== newStatus) {
          console.log('Status change during drag:', activeTask.status, '->', newStatus);
          setActiveStatus(newStatus);
        }
      }
    }
  }, [isDragging, activeTask]);
  
  // Handle mouse up to drop the task
  const handleMouseUp = useCallback((event: MouseEvent) => {
    console.log('===== DROP =====');
    if (!isDragging || !activeTask) {
      console.warn('Drop without active task or not dragging');
      return;
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    console.log('Mouse up at:', { x: event.clientX, y: event.clientY });
    
    // Get the grid element bounds
    const gridRect = gridRef.current?.getBoundingClientRect();
    if (!gridRect) {
      console.error('Grid element not found');
      setIsDragging(false);
      setActiveTask(null);
      setActiveStatus(null);
      return;
    }
    
    // Calculate position relative to grid
    const gridX = event.clientX - gridRect.left;
    const gridY = event.clientY - gridRect.top;
    console.log('Position relative to grid:', { gridX, gridY });
    
    // Calculate the cell position
    const cellX = Math.floor(gridX / CELL_SIZE);
    const cellY = Math.floor(gridY / CELL_SIZE);
    console.log('Cell position:', { cellX, cellY });
    
    // Check if we're within grid bounds
    if (cellX >= 0 && cellX < GRID_WIDTH && cellY >= 0 && cellY < GRID_HEIGHT) {
      console.log('✅ Valid drop position within grid');
      moveTaskToPosition(activeTask.id, cellX, cellY);
    } else {
      console.log('❌ Drop outside grid bounds');
      
      // If we're close to the grid, move to nearest edge
      if (
        gridX >= -CELL_SIZE && gridX <= gridRect.width + CELL_SIZE && 
        gridY >= -CELL_SIZE && gridY <= gridRect.height + CELL_SIZE
      ) {
        const validX = Math.max(0, Math.min(GRID_WIDTH - 1, cellX));
        const validY = Math.max(0, Math.min(GRID_HEIGHT - 1, cellY));
        console.log('Moving to nearest valid cell:', { validX, validY });
        moveTaskToPosition(activeTask.id, validX, validY);
      }
    }
    
    // Reset the drag state
    setIsDragging(false);
    setActiveTask(null);
    setActiveStatus(null);
    console.log('===== DROP COMPLETE =====');
  }, [isDragging, activeTask, handleMouseMove]);
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Modify the moveTaskToPosition function to prevent double updates
  const moveTaskToPosition = (taskId: string, x: number, y: number) => {
    console.log('===== MOVE TASK TO POSITION =====');
    console.log('Task ID:', taskId);
    console.log('Target position:', { x, y });
    
    // First, find the task by ID
    let taskToMove: Task | undefined;
    let taskColumnId: KanbanStatus | undefined;
    let taskIndex: number = -1;
    
    // Loop through columns to find the task
    for (const column of board.columns) {
      const index = column.tasks.findIndex(t => t.id === taskId);
      if (index >= 0) {
        taskToMove = { ...column.tasks[index] }; // Create a copy
        taskColumnId = column.id;
        taskIndex = index;
        break;
      }
    }
    
    if (!taskToMove) {
      console.error('🔴 Task not found for moving:', taskId);
      
      // Attempt grid recovery if task is missing
      setBoard(prev => synchronizeGridWithTasks(prev));
      return;
    }
    
    console.log('✅ Found task to move:', taskToMove);
    console.log('Original column:', taskColumnId);
    console.log('Original position in column:', taskIndex);
    
    // Store original position for logging
    const originalPosition = taskToMove.gridPosition ? { ...taskToMove.gridPosition } : null;
    console.log('Original grid position:', originalPosition);
    
    // Determine which status this cell belongs to
    let newStatus: KanbanStatus = 'Todo';
    if (y < 5) {
      newStatus = 'Todo';
    } else if (y < 10) {
      newStatus = 'InProgress';
    } else if (y < 15) {
      newStatus = 'Test';
    } else {
      newStatus = 'Done';
    }
    
    console.log('New status:', newStatus);
    
    // Check if the cell is already occupied by a different task
    const occupyingTaskId = board.grid[y]?.[x];
    console.log('Cell currently occupied by:', occupyingTaskId);
    
    if (occupyingTaskId !== null && occupyingTaskId !== taskId) {
      console.log('Cell is occupied, looking for nearby empty cell');
      
      // Find a nearby empty cell
      const emptyCell = findNearestEmptyCell(x, y);
      if (emptyCell) {
        console.log('Found empty cell at:', emptyCell);
        x = emptyCell.x;
        y = emptyCell.y;
      } else {
        console.error('🔴 No empty cell found nearby, cannot move task');
        return;
      }
    }
    
    // Important: Use functional update to prevent stale state and double updates
    setBoard(prevBoard => {
      console.log('Updating board state with single functional update');
      
      // Create deep copies to ensure we don't mutate state
      const updatedColumns = prevBoard.columns.map(column => ({
        ...column,
        tasks: [...column.tasks] // Create a new array for tasks
      }));
      
      // Create a deep copy of the grid
      const updatedGrid = prevBoard.grid.map(row => [...row]);
      
      // 1. First clear the task from its original position in the grid
      if (originalPosition) {
        const { x: oldX, y: oldY } = originalPosition;
        if (updatedGrid[oldY] && updatedGrid[oldY][oldX] === taskId) {
          console.log(`Clearing task from old position (${oldX}, ${oldY})`);
          updatedGrid[oldY][oldX] = null;
        } else {
          console.warn(`⚠️ Task was not found at expected position (${oldX}, ${oldY})`);
          console.log('Current value at position:', updatedGrid[oldY]?.[oldX]);
        }
      } else {
        console.warn('⚠️ Task had no previous grid position');
      }
      
      // 2. Remove the task from its original column
      if (taskColumnId) {
        const columnIndex = updatedColumns.findIndex(col => col.id === taskColumnId);
        if (columnIndex >= 0) {
          console.log(`Removing task from old column: ${taskColumnId}`);
          updatedColumns[columnIndex].tasks = updatedColumns[columnIndex].tasks.filter(t => t.id !== taskId);
        } else {
          console.warn(`⚠️ Original column not found: ${taskColumnId}`);
        }
      }
      
      // 3. Update the task with new position and status
      const updatedTask: Task = {
        ...taskToMove,
        gridPosition: { x, y },
        status: newStatus
      };
      
      console.log('Updated task:', updatedTask);
      
      // 4. Add the task to its new column
      const newColumnIndex = updatedColumns.findIndex(col => col.id === newStatus);
      if (newColumnIndex >= 0) {
        console.log(`Adding task to new column: ${newStatus}`);
        updatedColumns[newColumnIndex].tasks.push(updatedTask);
      } else {
        console.error(`🔴 New column not found: ${newStatus}`);
        return prevBoard; // Return previous state to avoid corruption
      }
      
      // 5. Update the grid with the task's new position
      if (y >= 0 && y < updatedGrid.length && x >= 0 && x < updatedGrid[y].length) {
        console.log(`Setting task at new position (${x}, ${y})`);
        updatedGrid[y][x] = taskId;
      } else {
        console.error(`🔴 New position (${x}, ${y}) is out of grid bounds`);
        return prevBoard; // Return previous state to avoid corruption
      }
      
      // 6. Verify grid consistency - make sure all tasks are in the grid
      const taskIds = new Set<string>();
      updatedColumns.forEach(column => {
        column.tasks.forEach(task => {
          taskIds.add(task.id);
        });
      });
      
      const gridTaskIds = new Set<string>();
      updatedGrid.forEach(row => {
        row.forEach(cellId => {
          if (cellId !== null) {
            gridTaskIds.add(cellId);
          }
        });
      });
      
      const missingFromGrid = [...taskIds].filter(id => !gridTaskIds.has(id));
      if (missingFromGrid.length > 0) {
        console.warn('Tasks missing from grid:', missingFromGrid);
      }
      
      console.log('Board update complete, all tasks accounted for');
      
      // Return the updated state
      return {
        columns: updatedColumns,
        grid: updatedGrid
      };
    });
    
    console.log('===== MOVE TASK OPERATION COMPLETE =====');
  };

  // Find the nearest empty cell to the given coordinates
  const findNearestEmptyCell = (x: number, y: number) => {
    // Check immediate vicinity first (spiral out)
    for (let distance = 1; distance < 5; distance++) {
      for (let dx = -distance; dx <= distance; dx++) {
        for (let dy = -distance; dy <= distance; dy++) {
          // Skip checking the same positions twice
          if (Math.abs(dx) < distance && Math.abs(dy) < distance) continue;
          
          const newX = x + dx;
          const newY = y + dy;
          
          // Check if within grid bounds
          if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
            if (board.grid[newY][newX] === null) {
              return { x: newX, y: newY };
            }
          }
        }
      }
    }
    
    // If no empty cell found within reasonable distance
    return null;
  };

  // Render tasks on the grid
  const renderTasks = () => {
    console.log('Rendering tasks...');
    
    // Get all tasks with valid grid positions
    const allTasks: Task[] = [];
    
    // Track tasks by ID to help with debugging
    const taskIds = new Set<string>();
    
    board.columns.forEach(column => {
      console.log(`Column ${column.id} has ${column.tasks.length} tasks`);
      
      column.tasks.forEach(task => {
        if (task.gridPosition) {
          // Clone to avoid accidental mutations
          allTasks.push({ ...task });
          taskIds.add(task.id);
        } else {
          console.warn(`Task without grid position: ${task.id} - ${task.title}`);
        }
      });
    });
    
    console.log(`Total tasks to render: ${allTasks.length}`);
    console.log('Task IDs:', Array.from(taskIds));
    
    return (
      <>
        {/* Render all non-active tasks normally */}
        {allTasks
          .filter(task => activeTask?.id !== task.id)
          .map(task => {
            // Verify grid position is valid
            if (!task.gridPosition) {
              console.error(`Missing grid position for task: ${task.id}`);
              return null;
            }
            
            const { x, y } = task.gridPosition;
            
            // Verify coordinates are within bounds
            if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
              console.warn(`Task ${task.id} has out-of-bounds position: (${x}, ${y})`);
            }
            
            return (
              <div 
                key={task.id}
                className="tetris-block-wrapper"
                style={{
                  position: 'absolute',
                  left: `${x * CELL_SIZE}px`,
                  top: `${y * CELL_SIZE}px`,
                  zIndex: 10
                }}
                data-task-id={task.id}
                onMouseDown={(e) => startDragging(task.id, e)}
              >
                <TetrisBlock task={task} />
              </div>
            );
          })}

        {/* Render active task at original position with opacity */}
        {activeTask && activeTask.gridPosition && isDragging && (
          <div 
            key={`original-${activeTask.id}`}
            className="tetris-block-wrapper original"
            style={{
              position: 'absolute',
              left: `${activeTask.gridPosition.x * CELL_SIZE}px`,
              top: `${activeTask.gridPosition.y * CELL_SIZE}px`,
              opacity: 0.4,
              pointerEvents: 'none',
              zIndex: 5
            }}
          >
            <TetrisBlock task={activeTask} />
          </div>
        )}

        {/* Render dragging preview if dragging */}
        {isDragging && activeTask && (
          <div 
            key={`dragging-${activeTask.id}`}
            className="tetris-block-wrapper dragging"
            style={{
              position: 'fixed', // Use fixed positioning to follow cursor precisely
              left: `${dragPosition.x - 50}px`, // Offset by 50px to center the block
              top: `${dragPosition.y - 50}px`, // Offset by 50px to center the block
              pointerEvents: 'none',
              zIndex: 1000,
              transform: 'scale(0.9)', // Slightly smaller to indicate dragging state
              transition: 'none', // Remove transition for immediate following
              opacity: 0.9, // Slightly transparent to see underneath
              filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))' // Add shadow for better visibility
            }}
          >
            <TetrisBlock task={activeTask} />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Tetris Kanban Board</h2>
      <div className="tetris-board-container">
        <div ref={gridRef}>
          <TetrisGrid 
            width={GRID_WIDTH} 
            height={GRID_HEIGHT} 
            activeStatus={activeStatus}
            onCellClick={handleCellClick}
          />
        </div>
        <div className="tetris-blocks-layer">
          {renderTasks()}
        </div>
        <div className="grid-debug-info">
          <button 
            className="btn btn-sm btn-primary mt-4"
            onClick={() => {
              setBoard(prev => synchronizeGridWithTasks(prev));
            }}
          >
            Re-sync Grid and Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board; 