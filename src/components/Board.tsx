// Board.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {DndContext, DragEndEvent, DragOverlay, DragStartEvent} from '@dnd-kit/core';
import {KanbanBoard, KanbanColumn, KanbanStatus, Task} from '../types';
import TetrisBlock from './TetrisBlock';
import TetrisGrid from './TetrisGrid';
import './Board.css';

// Grid dimensions
export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 12;
export const CELL_SIZE = 50;

// Sample data for initial state
const initialTasks: Task[] = [
    {
        id: '1',
        title: 'Create UI Components',
        skills: ['React', 'CSS', 'HTML'],
        shape: 'I',
        status: 'Todo',
        blockPoints: [],
    },
    {
        id: '2',
        title: 'Implement API',
        skills: ['Node.js', 'Express', 'MongoDB', 'REST'],
        shape: 'L',
        status: 'Todo',
        blockPoints: [],
    },
    {
        id: '3',
        title: 'Design Database',
        skills: ['MongoDB', 'Schema Design'],
        shape: 'T',
        status: 'InProgress',
        blockPoints: [],
    },
    {
        id: '4',
        title: 'Write Tests',
        skills: ['Jest', 'Testing', 'Cypress', 'QA', 'Documentation'],
        shape: 'O',
        status: 'InProgress',
        blockPoints: [],
    },
    {
        id: '5',
        title: 'Deploy Application',
        skills: ['DevOps', 'AWS', 'CI/CD'],
        shape: 'Z',
        status: 'Done',
        blockPoints: [],
    },
    {
        id: '6',
        title: 'Security Review',
        skills: ['Auth', 'Encryption'],
        shape: 'J',
        status: 'Test',
        blockPoints: [],
    },
    {
        id: '7',
        title: 'Performance Optimization',
        skills: ['Webpack', 'Code Splitting', 'Lazy Loading', 'Caching'],
        shape: 'S',
        status: 'Test',
        blockPoints: [],
    },
];

const initialColumns: KanbanColumn[] = [
    {
        id: 'Todo' as KanbanStatus,
        title: 'To Do',
        tasks: initialTasks.filter(task => task.status === 'Todo'),
        gridRowStart: 0,
        gridRowEnd: 3,
    },
    {
        id: 'InProgress' as KanbanStatus,
        title: 'In Progress',
        tasks: initialTasks.filter(task => task.status === 'InProgress'),
        gridRowStart: 3,
        gridRowEnd: 6,
    },
    {
        id: 'Test' as KanbanStatus,
        title: 'Testing',
        tasks: initialTasks.filter(task => task.status === 'Test'),
        gridRowStart: 6,
        gridRowEnd: 9,
    },
    {
        id: 'Done' as KanbanStatus,
        title: 'Done',
        tasks: initialTasks.filter(task => task.status === 'Done'),
        gridRowStart: 9,
        gridRowEnd: 12,
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

// Helper function to check if a position and its surrounding area is available
const isPositionAvailable = (grid: (string | null)[][], x: number, y: number, task?: Task): boolean => {
    if (!task) {
        // Check single position (used for finding available spaces)
        if (grid[y][x] !== null) return false;

        // For better spacing, check adjacent cells to avoid blocks being too close
        const directions = [
            {dx: -1, dy: 0}, // left
            {dx: 1, dy: 0},  // right
            {dx: 0, dy: -1}, // up
            {dx: 0, dy: 1},  // down
        ];

        let adjacentOccupied = 0;

        for (const {dx, dy} of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (
                newX >= 0 && newX < GRID_WIDTH &&
                newY >= 0 && newY < GRID_HEIGHT &&
                grid[newY][newX] !== null
            ) {
                adjacentOccupied++;
            }
        }

        return adjacentOccupied <= 1;
    }

    // Check all points of the Tetris block
    for (const point of task.blockPoints) {
        const blockX = x + point.x;
        const blockY = y + point.y;

        // Check if any point is out of bounds
        if (blockX < 0 || blockX >= GRID_WIDTH || blockY < 0 || blockY >= GRID_HEIGHT) {
            return false;
        }

        // Check if any point is occupied
        if (grid[blockY][blockX] !== null) {
            return false;
        }
    }

    return true;
};

// Improved synchronizeGridWithTasks function with better spacing
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
                const {x, y} = task.gridPosition;

                // Verify position is within bounds and all block points are available
                if (isPositionAvailable(newGrid, x, y, task)) {
                    // Place all blocks of the task
                    task.blockPoints.forEach(point => {
                        const blockX = x + point.x;
                        const blockY = y + point.y;
                        newGrid[blockY][blockX] = task.id;
                    });
                    placedTasks.add(task.id);
                } else {
                    console.warn(`Task ${task.id} has invalid position or overlaps with other blocks`);
                }
            }
        });
    });

    const columnRowRanges = {
        'Todo': {start: 0, end: 3},
        'InProgress': {start: 3, end: 6},
        'Test': {start: 6, end: 9},
        'Done': {start: 9, end: 12}
    };

    // placement strategy for remaining tasks
    currentBoard.columns.forEach(column => {
        const rowRange = columnRowRanges[column.id];

        // Get tasks that need placement in this column
        const tasksToPlace = column.tasks.filter(task => !placedTasks.has(task.id));

        // Sort tasks by shape to optimize placement
        tasksToPlace.sort((a, b) => a.shape.localeCompare(b.shape));

        // Place each task
        tasksToPlace.forEach(task => {
            // Find the first available position in the column's range
            let placed = false;

            // Try to place with spacing between blocks for visual clarity
            for (let y = rowRange.start; y < rowRange.end && !placed; y++) {
                for (let x = 0; x < GRID_WIDTH && !placed; x++) {
                    if (x === 1) {
                        x = 3;
                    }
                    // Check if current position and all block points are available
                    if (isPositionAvailable(newGrid, x, y, task)) {
                        // Place all blocks of the task
                        task.blockPoints.forEach(point => {
                            const blockX = x + point.x;
                            const blockY = y + point.y;
                            newGrid[blockY][blockX] = task.id;
                        });
                        task.gridPosition = {x, y};
                        placedTasks.add(task.id);
                        placed = true;
                        console.log(`Assigned task ${task.id} to position (${x}, ${y})`);
                    }
                }
            }

            // If still not placed, try any available position
            if (!placed) {
                for (let y = rowRange.start; y < rowRange.end && !placed; y++) {
                    for (let x = 0; x < GRID_WIDTH && !placed; x++) {
                        if (isPositionAvailable(newGrid, x, y, task)) {
                            // Place all blocks of the task
                            task.blockPoints.forEach(point => {
                                const blockX = x + point.x;
                                const blockY = y + point.y;
                                newGrid[blockY][blockX] = task.id;
                            });
                            task.gridPosition = {x, y};
                            placedTasks.add(task.id);
                            placed = true;
                            console.log(`Assigned task ${task.id} to position (${x}, ${y}) after relaxing spacing constraints`);
                        }
                    }
                }
            }

            if (!placed) {
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
    const gridRef = useRef<HTMLDivElement>(null);

    // Initialize task positions on first render
    useEffect(() => {
        setBoard(prev => synchronizeGridWithTasks(prev));
    }, []);

    // Find the nearest empty cell to a given position
    const findNearestEmptyCell = (startX: number, startY: number): { x: number, y: number } | null => {
        console.log('Finding nearest empty cell to position:', {startX, startY});

        // Create a queue for BFS
        const queue: { x: number, y: number, distance: number }[] = [];
        // Keep track of visited cells
        const visited: Set<string> = new Set();

        // Start with the original position
        queue.push({x: startX, y: startY, distance: 0});
        visited.add(`${startX},${startY}`);

        // Direction vectors for nearby cells - prioritize cardinal directions first
        // This will improve precision by favoring direct neighbors before diagonals
        const directions = [
            {dx: 0, dy: -1},  // up
            {dx: 1, dy: 0},   // right
            {dx: 0, dy: 1},   // down
            {dx: -1, dy: 0},  // left
            // Add diagonals last (they'll be explored after cardinal directions at the same distance)
            {dx: 1, dy: -1},  // up-right
            {dx: 1, dy: 1},   // down-right
            {dx: -1, dy: 1},  // down-left
            {dx: -1, dy: -1}, // up-left
        ];

        // Determine the valid row range based on the starting y position
        let rowRangeStart = 0, rowRangeEnd = GRID_HEIGHT;
        if (startY < 3) {
            rowRangeStart = 0;
            rowRangeEnd = 3;
        } else if (startY < 6) {
            rowRangeStart = 3;
            rowRangeEnd = 6;
        } else if (startY < 9) {
            rowRangeStart = 6;
            rowRangeEnd = 9;
        } else {
            rowRangeStart = 9;
            rowRangeEnd = 12;
        }

        // First check if the target cell itself is empty
        if (
            startX >= 0 && startX < GRID_WIDTH &&
            startY >= rowRangeStart && startY < rowRangeEnd &&
            board.grid[startY][startX] === null
        ) {
            console.log(`Target cell (${startX}, ${startY}) is already empty, using it directly`);
            return {x: startX, y: startY};
        }

        // Store candidate positions with their distances for later sorting
        const candidates: { x: number, y: number, distance: number }[] = [];

        // BFS to find the nearest empty cell
        while (queue.length > 0) {
            const current = queue.shift();
            if (!current) break;

            const {x, y, distance} = current;

            // Check if cell is within bounds and empty
            if (
                x >= 0 && x < GRID_WIDTH &&
                y >= rowRangeStart && y < rowRangeEnd &&
                board.grid[y][x] === null
            ) {
                // Add to candidates instead of returning immediately
                candidates.push({x, y, distance});

                // If we've found enough candidates or have checked enough cells, stop searching
                if (candidates.length >= 5 || distance > 2) {
                    break;
                }
            }

            if (distance > 5) {
                console.warn('Search distance exceeded, using best candidate found');
                break;
            }

            // Explore all directions
            for (const {dx, dy} of directions) {
                const newX = x + dx;
                const newY = y + dy;
                const key = `${newX},${newY}`;

                // Only consider unvisited cells
                if (!visited.has(key)) {
                    visited.add(key);
                    // Only explore cells that are in bounds
                    if (
                        newX >= 0 && newX < GRID_WIDTH &&
                        newY >= rowRangeStart && newY < rowRangeEnd
                    ) {
                        queue.push({x: newX, y: newY, distance: distance + 1});
                    }
                }
            }
        }

        if (candidates.length > 0) {
            // Sort candidates by distance (closest first) and Manhattan distance to target
            candidates.sort((a, b) => {
                // First by BFS distance
                if (a.distance !== b.distance) {
                    return a.distance - b.distance;
                }

                // Then by Manhattan distance to the target (total blocks away)
                const aManhattan = Math.abs(a.x - startX) + Math.abs(a.y - startY);
                const bManhattan = Math.abs(b.x - startX) + Math.abs(b.y - startY);
                return aManhattan - bManhattan;
            });

            const bestCandidate = candidates[0];
            console.log(`Found best empty cell at (${bestCandidate.x}, ${bestCandidate.y}) with distance ${bestCandidate.distance}`);
            return {x: bestCandidate.x, y: bestCandidate.y};
        }

        console.error('No empty cell found');
        return null;
    };

    // Helper: find a task in board by id
    const findTaskById = useCallback((taskId: string): Task | undefined => {
        for (const column of board.columns) {
            const task = column.tasks.find(t => t.id === taskId);
            if (task) return {...task};
        }
        return undefined;
    }, [board.columns]);

    // DndContext callback: on drag start, set active task.
    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;
        const task = findTaskById(active.id as string);
        if (task) {
            setActiveTask(task);
        }
    };

    // DndContext callback: on drag end, check if over a droppable grid cell.
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        // Log details to help debug
        console.log('Drag End Event:', {
            activeId: active.id,
            overId: over?.id,
            overRect: over?.rect
        });

        if (over && typeof over.id === 'string' && over.id.startsWith('cell-')) {
            // Expected id format: "cell-x-y"
            const parts = over.id.split('-');
            const x = parseInt(parts[1], 10);
            const y = parseInt(parts[2], 10);

            console.log('Dropping on cell:', {x, y});

            // Check if this is a valid cell position
            if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
                const taskId = active.id as string;
                const task = findTaskById(taskId);

                if (task) {
                    // Check if all block points would be within bounds and not overlapping
                    if (isPositionAvailable(board.grid, x, y, task)) {
                        moveTaskToPosition(taskId, x, y);
                    } else {
                        // Try to find a nearby valid position
                        const emptyCell = findNearestEmptyCell(x, y);
                        if (emptyCell) {
                            moveTaskToPosition(taskId, emptyCell.x, emptyCell.y);
                        } else {
                            console.error('No valid position found for task:', taskId);
                        }
                    }
                } else {
                    console.error('Task not found:', taskId);
                }
            } else {
                console.error('Invalid cell position:', {x, y});
            }
        } else {
            console.log('Not dropped on a valid cell');
        }

        setActiveTask(null);
    };

    // Updated moveTaskToPosition remains essentially the same as before
    const moveTaskToPosition = (taskId: string, x: number, y: number) => {
        console.log('===== MOVE TASK TO POSITION =====');
        console.log('Task ID:', taskId);
        console.log('Target position:', {x, y});

        // First, find the task by ID
        let taskToMove: Task | undefined;
        let taskColumnId: KanbanStatus | undefined;
        let taskIndex: number = -1;

        // Loop through columns to find the task
        for (const column of board.columns) {
            const index = column.tasks.findIndex(t => t.id === taskId);
            if (index >= 0) {
                taskToMove = {...column.tasks[index]}; // Create a copy
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
        const originalPosition = taskToMove.gridPosition ? {...taskToMove.gridPosition} : null;
        console.log('Original grid position:', originalPosition);

        // Determine which status this cell belongs to
        let newStatus: KanbanStatus;
        if (y < 3) {
            newStatus = 'Todo';
        } else if (y < 6) {
            newStatus = 'InProgress';
        } else if (y < 9) {
            newStatus = 'Test';
        } else {
            newStatus = 'Done';
        }

        console.log('New status:', newStatus);

        // Important: Use functional update to prevent stale state and double updates
        setBoard(prevBoard => {
            console.log('Updating board state with single functional update');
            // Create deep copies of columns and grid
            const updatedColumns = prevBoard.columns.map(column => ({
                ...column,
                tasks: [...column.tasks]
            }));
            const updatedGrid = prevBoard.grid.map(row => [...row]);

            // 1. Remove the task from its old grid cells (if exists)
            if (originalPosition) {
                taskToMove.blockPoints.forEach(point => {
                    const oldX = originalPosition.x + point.x;
                    const oldY = originalPosition.y + point.y;
                    if (oldX >= 0 && oldX < GRID_WIDTH && oldY >= 0 && oldY < GRID_HEIGHT) {
                        updatedGrid[oldY][oldX] = null;
                    }
                });
            }

            // 2. Remove task from its original column
            if (taskColumnId) {
                const originalColumn = updatedColumns.find(col => col.id === taskColumnId);
                if (originalColumn) {
                    originalColumn.tasks = originalColumn.tasks.filter(t => t.id !== taskId);
                }
            }

            // 3. Update task's position and status
            taskToMove.gridPosition = {x, y};
            taskToMove.status = newStatus;

            // 4. Add task to new column
            const newColumn = updatedColumns.find(col => col.id === newStatus);
            if (newColumn) {
                newColumn.tasks.push(taskToMove);
            }

            // 5. Place task in new grid cells
            taskToMove.blockPoints.forEach(point => {
                const newX = x + point.x;
                const newY = y + point.y;
                if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
                    updatedGrid[newY][newX] = taskId;
                }
            });

            return {
                columns: updatedColumns,
                grid: updatedGrid
            };
        });
    };

    // Render all tasks by their grid positions
    const renderTasks = () => {
        const allTasks: Task[] = [];
        board.columns.forEach(column => {
            column.tasks.forEach(task => {
                if (task.gridPosition) {
                    allTasks.push({...task});
                }
            });
        });
        return (
            <>
                {allTasks.map(task => {
                    if (!task.gridPosition) return null;
                    const {x, y} = task.gridPosition;
                    return (
                        <div
                            key={task.id}
                            className="tetris-block-wrapper"
                            style={{
                                position: 'absolute',
                                left: `${x * CELL_SIZE}px`,
                                top: `${y * CELL_SIZE}px`,
                                zIndex: 10,
                            }}
                            data-task-id={task.id}
                        >
                            <TetrisBlock task={task}/>
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="container mx-auto p-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Tetris Kanban Board</h2>
                <div className="tetris-board-container" ref={gridRef}>
                    <TetrisGrid
                        width={GRID_WIDTH}
                        height={GRID_HEIGHT}
                        activeStatus={null} // (optional – you may update this as needed)
                    />
                    <div className="tetris-blocks-layer">
                        {renderTasks()}
                    </div>
                    <div className="grid-debug-info">
                        <button
                            className="btn btn-sm btn-primary mt-4"
                            onClick={() => setBoard(prev => synchronizeGridWithTasks(prev))}
                        >
                            Re-sync Grid and Tasks
                        </button>
                    </div>
                </div>
                <DragOverlay>
                    {activeTask ? (
                        <div style={{transform: 'translate(0, 0)'}}>
                            <TetrisBlock task={activeTask}/>
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};

export default Board;
