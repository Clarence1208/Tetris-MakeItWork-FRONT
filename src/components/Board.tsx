// Board.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {KanbanBoard, KanbanColumn, KanbanStatus, Point, Task, TetrisShape} from '../types';
import TetrisBlock from './TetrisBlock';
import TetrisGrid from './TetrisGrid';
import './Board.css';

// Grid dimensions
export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 12;
export const CELL_SIZE = 50;

// Mapping of skill names to their logo URLs
const skillLogos: Record<string, string> = {
    "React": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    "Angular": "https://angular.io/assets/images/logos/angular/angular.svg",
    "Vue": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png",
    "Node": "https://w7.pngwing.com/pngs/232/470/png-transparent-circle-js-node-node-js-programming-round-icon-popular-services-brands-vol-icon-thumbnail.png",
    "Node.js": "https://w7.pngwing.com/pngs/232/470/png-transparent-circle-js-node-node-js-programming-round-icon-popular-services-brands-vol-icon-thumbnail.png",
    "PHP": "https://www.php.net/images/logos/new-php-logo.svg",
    "Java": "https://dev.java/assets/images/java-logo-vert-blk.png",
    "Spring": "https://spring.io/img/spring.svg",
    "Nest": "https://nestjs.com/img/logo-small.svg",
    "C#": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/C_Sharp_wordmark.svg/800px-C_Sharp_wordmark.svg.png",
    "CSS": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1200px-CSS3_logo_and_wordmark.svg.png",
    "HTML": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png",
    "JavaScript": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png",
    "TypeScript": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
    "Python": "https://www.python.org/static/community_logos/python-logo.png",
    "MongoDB": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/1200px-MongoDB_Logo.svg.png",
    "SQL": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sql_data_base_with_logo.png/800px-Sql_data_base_with_logo.png",
    "Express": "https://expressjs.com/images/express-facebook-share.png",
    "REST": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmJoxiAXVIxedd5WnxL3yepJpACK2lmCSl9w&s"
};

// Function to get a logo URL for a skill, with fallback to placeholder
const getSkillLogoUrl = (skillName: string): string => {
    // Try to match exactly
    if (skillLogos[skillName]) {
        return skillLogos[skillName];
    }

    // Try case-insensitive match
    const lowercaseSkillName = skillName.toLowerCase();
    for (const [key, url] of Object.entries(skillLogos)) {
        if (key.toLowerCase() === lowercaseSkillName) {
            return url;
        }
    }

    // Fallback to placeholder with skill name
    return `https://via.placeholder.com/50?text=${encodeURIComponent(skillName)}`;
};

// Helper function to calculate block points for a task
const calculateBlockPoints = (shape: TetrisShape, skillCount: number): Point[] => {
    let layout: boolean[][] = [];

    switch (shape) {
        case 'I': // I shape - horizontal line
            if (skillCount <= 4) {
                layout = [Array(skillCount).fill(true)];
            } else {
                const fullRows = Math.floor(skillCount / 4);
                const remainder = skillCount % 4;
                layout = Array(fullRows).fill(Array(4).fill(true));
                if (remainder > 0) {
                    layout.push(Array(remainder).fill(true));
                }
            }
            break;

        case 'L': // L shape
            switch (skillCount) {
                case 1:
                    layout = [[true]];
                    break;
                case 2:
                    layout = [[true], [true]];
                    break;
                case 3:
                    layout = [[true], [true], [true]];
                    break;
                case 4:
                    layout = [[true], [true], [true, true]];
                    break;
                default:
                    layout = [[true], [true], [true, true, true]];
                    let remaining = skillCount - 5;
                    let currentRow = 3;
                    while (remaining > 0 && currentRow < 6) {
                        layout.push([true, true, true].slice(0, Math.min(3, remaining)));
                        remaining -= 3;
                        currentRow++;
                    }
            }
            break;

        case 'J': // J shape - mirrored L
            switch (skillCount) {
                case 1:
                    layout = [[true]];
                    break;
                case 2:
                    layout = [[true], [true]];
                    break;
                case 3:
                    layout = [[true], [true], [true]];
                    break;
                case 4:
                    layout = [[false, true], [false, true], [true, true]];
                    break;
                default:
                    layout = [[false, false, true], [false, false, true], [true, true, true]];
                    let remaining = skillCount - 5;
                    let currentRow = 3;
                    while (remaining > 0 && currentRow < 6) {
                        layout.push([true, true, true].slice(0, Math.min(3, remaining)));
                        remaining -= 3;
                        currentRow++;
                    }
            }
            break;

        case 'O': // O shape
            const side = Math.ceil(Math.sqrt(skillCount));
            layout = [];
            let remaining = skillCount;
            for (let i = 0; i < side; i++) {
                const row = [];
                for (let j = 0; j < side; j++) {
                    if (remaining > 0) {
                        row.push(true);
                        remaining--;
                    } else {
                        row.push(false);
                    }
                }
                layout.push(row);
            }
            break;

        case 'S': // S shape
            switch (skillCount) {
                case 1:
                    layout = [[true]];
                    break;
                case 2:
                    layout = [[true, true]];
                    break;
                case 3:
                    layout = [[false, true, true], [true]];
                    break;
                case 4:
                    layout = [[false, true, true], [true, true]];
                    break;
                default:
                    layout = [[false, true, true], [true, true, false]];
                    remaining = skillCount - 5;
                    let currentRow = 2;
                    while (remaining > 0 && currentRow < 5) {
                        if (currentRow % 2 === 0) {
                            layout.push([true, true, false].slice(0, Math.min(3, remaining)));
                        } else {
                            layout.push([false, true, true].slice(0, Math.min(3, remaining)));
                        }
                        remaining -= Math.min(3, remaining);
                        currentRow++;
                    }
            }
            break;

        case 'T': // T shape
            switch (skillCount) {
                case 1:
                    layout = [[true]];
                    break;
                case 2:
                    layout = [[true, true]];
                    break;
                case 3:
                    layout = [[true, true, true]];
                    break;
                case 4:
                    layout = [[true, true, true], [false, true]];
                    break;
                default:
                    layout = [[true, true, true], [false, true, false], [false, true, false]];
                    remaining = skillCount - 5;
                    let currentRow = 3;
                    while (remaining > 0 && currentRow < 6) {
                        layout.push([false, true, false].slice(0, Math.min(3, remaining)));
                        remaining -= Math.min(3, remaining);
                        currentRow++;
                    }
            }
            break;

        case 'Z': // Z shape
            switch (skillCount) {
                case 1:
                    layout = [[true]];
                    break;
                case 2:
                    layout = [[true, true]];
                    break;
                case 3:
                    layout = [[true, true], [false, true]];
                    break;
                case 4:
                    layout = [[true, true, false], [false, true, true]];
                    break;
                default:
                    layout = [[true, true, false], [false, true, true]];
                    remaining = skillCount - 4;
                    let currentRow = 2;
                    while (remaining > 0 && currentRow < 5) {
                        if (currentRow % 2 === 0) {
                            layout.push([false, true, true].slice(0, Math.min(3, remaining)));
                        } else {
                            layout.push([true, true, false].slice(0, Math.min(3, remaining)));
                        }
                        remaining -= Math.min(3, remaining);
                        currentRow++;
                    }
            }
            break;

        default:
            layout = [Array(skillCount).fill(true)];
    }

    // Convert layout to points
    const points: Point[] = [];
    layout.forEach((row, rowIndex) => {
        row.forEach((isVisible, colIndex) => {
            if (isVisible) {
                points.push({x: colIndex, y: rowIndex});
            }
        });
    });
    return points;
};

// Sample data for initial state
const initialTasks: Task[] = [
    {
        id: '1',
        name: 'Create UI Components',
        skills: [
            {
                name: 'React',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png'
            },
            {
                name: 'CSS',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1200px-CSS3_logo_and_wordmark.svg.png'
            },
            {
                name: 'HTML',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png'
            }
        ],
        shape: 'I' as TetrisShape,
        status: 'Todo' as KanbanStatus,
        blockPoints: [],
        description: "Tests",
        company: "Intern"
    },
    {
        id: '2',
        name: 'Implement API',
        skills: [
            {
                name: 'Node.js',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png'
            },
            {name: 'Express', image: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png'},
            {
                name: 'MongoDB',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/1200px-MongoDB_Logo.svg.png'
            },
            {
                name: 'REST',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmJoxiAXVIxedd5WnxL3yepJpACK2lmCSl9w&s'
            }
        ],
        shape: 'L' as TetrisShape,
        status: 'Todo' as KanbanStatus,
        blockPoints: [],
        description: "Tests",
        company: "Intern"
    },
    {
        id: '3',
        name: 'Design Database',
        skills: [
            {
                name: 'MongoDB',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/1200px-MongoDB_Logo.svg.png'
            },
            {
                name: 'Schema Design',
                image: 'https://www.shutterstock.com/image-vector/database-sign-icon-relational-schema-260nw-448158316.jpg'
            }
        ],
        shape: 'T' as TetrisShape,
        status: 'InProgress' as KanbanStatus,
        blockPoints: [],
        description: "Tests",
        company: "Intern"
    },
    {
        id: '4',
        name: 'Write Tests',
        skills: [
            {name: 'Jest', image: 'https://jestjs.io/img/jest.png'},
            {
                name: 'Testing',
                image: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/testing-logo-design-template-ce84480d61b3db9a8e1522a99875832f_screen.jpg?ts=1732644069'
            },
            {name: 'Cypress', image: 'https://www.cypress.io/images/layouts/cypress-logo.svg'},
            {
                name: 'QA',
                image: 'https://media.istockphoto.com/id/1073505842/fr/vectoriel/ic%C3%B4ne-de-question-r%C3%A9ponse-symbole-de-le-q-a.jpg?s=612x612&w=0&k=20&c=Dji2pjE49FRDHiQhYnOX4m9kN3IUrtfr0exXHqj0zZs='
            },
            {
                name: 'Documentation',
                image: 'https://static.vecteezy.com/system/resources/previews/006/986/082/non_2x/write-document-user-interface-outline-icon-logo-illustration-free-vector.jpg'
            }
        ],
        shape: 'O' as TetrisShape,
        status: 'InProgress' as KanbanStatus,
        blockPoints: [],
        description: "Tests",
        company: "Intern"
    },
    {
        id: '5',
        name: 'Deploy Application',
        skills: [
            {
                name: 'DevOps',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Devops-toolchain.svg/1200px-Devops-toolchain.svg.png'
            },
            {
                name: 'AWS',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png'
            },
            {
                name: 'CI/CD',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Continuous_Integration_development_practice_diagram.svg/1200px-Continuous_Integration_development_practice_diagram.svg.png'
            }
        ],
        shape: 'Z' as TetrisShape,
        status: 'Done' as KanbanStatus,
        blockPoints: [],
        description: "Tests",
        company: "Intern"
    },
    {
        id: '6',
        name: 'Security Review',
        skills: [
            {
                name: 'Auth',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Authentication.svg/1200px-Authentication.svg.png'
            },
            {
                name: 'Encryption',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Encryption.svg/1200px-Encryption.svg.png'
            }
        ],
        shape: 'J' as TetrisShape,
        status: 'Test' as KanbanStatus,
        blockPoints: [],
        description: "Test",
        company: "Tests"
    },
    {
        id: '7',
        name: 'Performance Optimization',
        skills: [
            {name: 'Webpack', image: 'https://webpack.js.org/icon-square-big.svg'},
            {
                name: 'Code Splitting',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Code_split.svg/1200px-Code_split.svg.png'
            },
            {
                name: 'Lazy Loading',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Lazy_loading_design_pattern.svg/1200px-Lazy_loading_design_pattern.svg.png'
            },
            {
                name: 'Caching',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Cache_computing.svg/1200px-Cache_computing.svg.png'
            }
        ],
        shape: 'S' as TetrisShape,
        status: 'Test' as KanbanStatus,
        blockPoints: [],
        description: "Test",
        company: "Tests"
    },
].map(task => ({
    ...task,
    blockPoints: calculateBlockPoints(task.shape, task.skills.length)
}));

const initialColumns: KanbanColumn[] = [
    {
        id: 'Todo' as KanbanStatus,
        name: 'To Do',
        tasks: initialTasks.filter(task => task.status === 'Todo'),
        gridRowStart: 0,
        gridRowEnd: 3,
    },
    {
        id: 'InProgress' as KanbanStatus,
        name: 'In Progress',
        tasks: initialTasks.filter(task => task.status === 'InProgress'),
        gridRowStart: 3,
        gridRowEnd: 6,
    },
    {
        id: 'Test' as KanbanStatus,
        name: 'Testing',
        tasks: initialTasks.filter(task => task.status === 'Test'),
        gridRowStart: 6,
        gridRowEnd: 9,
    },
    {
        id: 'Done' as KanbanStatus,
        name: 'Done',
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

    console.log('=== CHECKING POSITION AVAILABILITY ===');
    console.log('Task:', task.id);
    console.log('Base position:', {x, y});
    console.log('Block points:', task.blockPoints);

    // Check all points of the Tetris block
    for (const point of task.blockPoints) {
        const blockX = x + point.x;
        const blockY = y + point.y;

        console.log('Checking block point:', {blockX, blockY});

        // Check if any point is out of bounds
        if (blockX < 0 || blockX >= GRID_WIDTH || blockY < 0 || blockY >= GRID_HEIGHT) {
            console.log(`❌ Block point (${blockX}, ${blockY}) is out of bounds`);
            return false;
        }

        // Check if any point is occupied by another task
        if (grid[blockY][blockX] !== null && grid[blockY][blockX] !== task.id) {
            console.log(`❌ Position (${blockX}, ${blockY}) is occupied by:`, grid[blockY][blockX]);
            return false;
        }
    }

    console.log('✅ All positions are available');
    return true;
};

// Helper function to print the grid state
const printGrid = (grid: (string | null)[][], message: string = '') => {
    console.log(`===== GRID STATE ${message ? '- ' + message : ''} =====`);
    let output = '';
    for (let y = 0; y < grid.length; y++) {
        let row = '';
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[y][x];
            row += cell ? ` ${cell.padEnd(3)} ` : ' --- ';
        }
        output += row + '\n';
    }
    console.log(output);
    console.log('='.repeat(50));
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
    printGrid(newGrid, 'After Synchronization');
    console.log('===== SYNCHRONIZATION COMPLETE =====');

    return {
        columns: currentBoard.columns,
        grid: newGrid
    };
};

// Helper function to rotate block points 90 degrees clockwise around center
const rotateBlockPoints = (points: Point[]): Point[] => {
    if (points.length === 0) return points;

    // Find the bounding box
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    // Calculate center point (using floor to keep points on grid)
    const centerX = Math.floor(minX + (maxX - minX) / 2);
    const centerY = Math.floor(minY + (maxY - minY) / 2);

    // Rotate each point 90 degrees clockwise around the center
    const rotatedPoints = points.map(point => {
        // Translate point to origin (relative to center)
        const relX = point.x - centerX;
        const relY = point.y - centerY;

        // Rotate 90 degrees clockwise: (x,y) -> (y,-x)
        const rotX = relY;
        const rotY = -relX;

        // Translate back
        return {
            x: rotX + centerX,
            y: rotY + centerY
        };
    });

    // Find the minimum coordinates after rotation to normalize position
    const newMinX = Math.min(...rotatedPoints.map(p => p.x));
    const newMinY = Math.min(...rotatedPoints.map(p => p.y));

    // Normalize positions to ensure they start from a valid grid position
    return rotatedPoints.map(point => ({
        x: point.x - newMinX,
        y: point.y - newMinY
    }));
};

// Function to check for completed rows in the "Done" category
const checkCompletedRows = (grid: (string | null)[][]): number[] => {
    const completedRows: number[] = [];

    // Check each row in the Done category
    for (let y = 11; y >= 9; y--) {
        let isRowComplete = true;
        // Check if all cells in this row are filled
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (grid[y][x] === null) {
                isRowComplete = false;
                break;
            }
        }
        if (isRowComplete) {
            completedRows.push(y);
        }
    }

    return completedRows;
};

const Board = ({ title = "Tetris Kanban Board" }: { title?: string }): React.ReactElement => {
    const [board, setBoard] = useState<KanbanBoard>(initialBoard);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [showHiddenRows, setShowHiddenRows] = useState<boolean>(false);
    const [completedRows, setCompletedRows] = useState<number[]>([]);
    const [savedRowsContent, setSavedRowsContent] = useState<{
        rowIndex: number;
        cells: {
            x: number;
            taskId: string;
            shape: TetrisShape;
        }[];
    }[]>([]);
    const [removedBlocks, setRemovedBlocks] = useState<{
        task: Task;
        originalPosition: { x: number; y: number };
        hiddenRowIndex: number;
    }[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);

    const HIDDEN_ROWS_COUNT = 3;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    // Initialize task positions on first render
    useEffect(() => {
        setBoard(prev => synchronizeGridWithTasks(prev));
    }, []);

    useEffect(() => {
        // Register the addNewTask function to be accessible from outside
        setBoardAddTaskFunction(addNewTask);

        return () => {
            setBoardAddTaskFunction(null);
        };
    }, []);

    // Handle click for rotation
    const handleClick = (taskId: string, event: React.MouseEvent) => {
        if (event.shiftKey) {
            event.preventDefault();
            handleBlockRotation(taskId);
        }
    };

    // Update DndContext callback to check for prevented drag
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

        console.log('Drag End Event:', {
            activeId: active.id,
            overId: over?.id,
            overRect: over?.rect
        });

        if (over && typeof over.id === 'string' && over.id.startsWith('cell-')) {
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
                        const emptyCell = findNearestEmptyCell(x, y, task);
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

    // Function to toggle visibility of hidden rows
    const toggleHiddenRows = (): void => {
        setShowHiddenRows(prev => !prev);
    };

    const findTaskById = useCallback((taskId: string): Task | undefined => {
        for (const column of board.columns) {
            const task = column.tasks.find(t => t.id === taskId);
            if (task) return {...task};
        }
        return undefined;
    }, [board.columns]);

    // Find the nearest empty cell to a given position
    const findNearestEmptyCell = (startX: number, startY: number, task: Task): { x: number, y: number } | null => {
        console.log('Finding nearest empty cell to position:', {startX, startY});
        console.log('Task block points:', task.blockPoints);

        // Create a queue for BFS
        const queue: { x: number, y: number, distance: number }[] = [];
        // Keep track of visited cells
        const visited: Set<string> = new Set();

        // Start with the original position
        queue.push({x: startX, y: startY, distance: 0});
        visited.add(`${startX},${startY}`);

        // Direction vectors for nearby cells - prioritize cardinal directions first
        const directions = [
            {dx: 0, dy: -1},  // up
            {dx: 1, dy: 0},   // right
            {dx: 0, dy: 1},   // down
            {dx: -1, dy: 0},  // left
            {dx: 1, dy: -1},  // up-right
            {dx: 1, dy: 1},   // down-right
            {dx: -1, dy: 1},  // down-left
            {dx: -1, dy: -1}, // up-left
        ];

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

        if (
            startX >= 0 && startX < GRID_WIDTH &&
            startY >= rowRangeStart && startY < rowRangeEnd &&
            isPositionAvailable(board.grid, startX, startY, task)
        ) {
            console.log(`Target position (${startX}, ${startY}) is valid for the entire block`);
            return {x: startX, y: startY};
        }

        // Store candidate positions with their distances for later sorting
        const candidates: { x: number, y: number, distance: number }[] = [];

        // BFS to find the nearest valid position
        while (queue.length > 0) {
            const current = queue.shift();
            if (!current) break;

            const {x, y, distance} = current;

            // Check if the entire block can fit at this position
            if (
                x >= 0 && x < GRID_WIDTH &&
                y >= rowRangeStart && y < rowRangeEnd &&
                isPositionAvailable(board.grid, x, y, task)
            ) {
                candidates.push({x, y, distance});

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
            // Sort candidates by distance (closest first)
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
            console.log(`Found best valid position at (${bestCandidate.x}, ${bestCandidate.y}) with distance ${bestCandidate.distance}`);
            return {x: bestCandidate.x, y: bestCandidate.y};
        }

        console.error('No valid position found for the block');
        return null;
    };

    // Modify renderTasks to show blocks correctly when hidden rows are visible
    const renderTasks = () => {
        const allTasks: Task[] = [];

        // Collect all tasks with grid positions
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
                                left: `${(x * CELL_SIZE) + 40}px`,
                                top: `${y * CELL_SIZE}px`,
                                zIndex: 10,
                            }}
                            data-task-id={task.id}
                            onClick={(e) => handleClick(task.id, e)}
                        >
                            <TetrisBlock task={task}/>
                        </div>
                    );
                })}
            </>
        );
    };

    // Add a component to render the hidden rows with saved blocks at the bottom of the Done category
    const renderHiddenRows = () => {
        if (!showHiddenRows) return null;

        const hiddenRows = [];
        // Calculate where to start hidden rows (right after the Done category)
        const hiddenRowStartY = GRID_HEIGHT; // Regular grid height is 12

        // Create hidden rows grid
        for (let i = 0; i < HIDDEN_ROWS_COUNT; i++) {
            const rowY = hiddenRowStartY + i;
            const row = [];

            for (let x = 0; x < GRID_WIDTH; x++) {
                row.push(
                    <div
                        key={`hidden-cell-${x}-${rowY}`}
                        className="tetris-cell hidden-row-cell"
                        style={{
                            width: `${CELL_SIZE}px`,
                            height: `${CELL_SIZE}px`,
                            border: '1px dashed rgba(255, 255, 255, 0.4)',
                            backgroundColor: 'rgba(100, 100, 100, 0.2)'
                        }}
                        data-position={`${x},${rowY}`}
                    />
                );
            }

            hiddenRows.push(
                <div
                    key={`hidden-row-${rowY}`}
                    className="tetris-grid-row hidden-row"
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        left: '40px', // Account for the label width
                        top: `${rowY * CELL_SIZE}px`,
                        width: `${GRID_WIDTH * CELL_SIZE}px`,
                        height: `${CELL_SIZE}px`,
                    }}
                >
                    {row}
                </div>
            );
        }

        console.log('Saved rows content:', savedRowsContent);
        console.log('Removed blocks:', removedBlocks);

        // Create a map of tasks from all columns for quick lookup
        const allTasks = new Map<string, Task>();
        board.columns.forEach(column => {
            column.tasks.forEach(task => {
                allTasks.set(task.id, task);
            });
        });

        // Render the saved completed rows in the hidden rows section
        const savedRowBlocks: React.ReactNode[] = [];

        // First, add cells from savedRowsContent
        savedRowsContent.forEach((savedRow, rowIndex) => {
            const hiddenRowY = GRID_HEIGHT + rowIndex;

            // Group cells by task ID to recreate the original blocks
            const taskGroups = new Map<string, { task: Task, cells: { x: number, shape: TetrisShape }[] }>();

            // First pass - group cells by task ID
            savedRow.cells.forEach(cell => {
                // Get the original task if it exists, otherwise try to find it in allTasks
                let originalTask = allTasks.get(cell.taskId);

                // If the task is no longer in the board (fully removed), create a template task
                if (!originalTask) {
                    // Create a minimal task that matches the Task type
                    originalTask = {
                        id: cell.taskId,
                        name: 'Completed Task',
                        status: 'Done',
                        shape: cell.shape,
                        skills: [],
                        blockPoints: []
                    } as Task;
                }

                if (!taskGroups.has(cell.taskId)) {
                    taskGroups.set(cell.taskId, {
                        task: {...originalTask},
                        cells: []
                    });
                }

                taskGroups.get(cell.taskId)!.cells.push({
                    x: cell.x,
                    shape: cell.shape
                });
            });

            // Find the leftmost x position for each group
            taskGroups.forEach((taskGroup) => {
                const sortedCellsX = [...taskGroup.cells].sort((a, b) => a.x - b.x);
                if (sortedCellsX.length > 0) {
                    const minX = sortedCellsX[0].x;
                    taskGroup.cells.forEach(cell => {
                        cell.x -= minX; // Normalize x positions
                    });
                }
            });

            // Second pass - create blocks for each task
            taskGroups.forEach((taskData, taskId) => {
                const minX = Math.min(...taskData.cells.map(c => c.x));
                const posX = savedRow.cells.find(c => c.taskId === taskId)?.x || 0;
                const posY = hiddenRowY;

                // Create a copy of the original task with guaranteed position
                const hiddenTask: Task = {
                    ...taskData.task,
                    id: `${taskId}-hidden-${savedRow.rowIndex}`,
                    // Create block points from the cells
                    blockPoints: taskData.cells.map(cell => ({
                        x: cell.x,
                        y: 0
                    })),
                    gridPosition: {
                        x: posX,
                        y: posY
                    }
                };

                savedRowBlocks.push(
                    <div
                        key={hiddenTask.id}
                        className="tetris-block-wrapper saved-row-block"
                        style={{
                            position: 'absolute',
                            left: `${(posX * CELL_SIZE) + 40}px`,
                            top: `${posY * CELL_SIZE}px`,
                            zIndex: 10,
                        }}
                    >
                        <TetrisBlock task={hiddenTask}/>
                    </div>
                );
            });
        });

        // Second, add completely removed blocks directly
        removedBlocks.forEach((removedBlock, index) => {
            // Only display blocks that correspond to current hidden rows
            if (removedBlock.hiddenRowIndex < HIDDEN_ROWS_COUNT) {
                const hiddenRowY = GRID_HEIGHT + removedBlock.hiddenRowIndex;
                const posX = removedBlock.originalPosition.x;
                const posY = hiddenRowY;

                // Create a copy of the removed task with position in hidden row
                const hiddenTask: Task = {
                    ...removedBlock.task,
                    id: `removed-block-${index}`,
                    gridPosition: {
                        x: posX,
                        y: posY
                    }
                };

                savedRowBlocks.push(
                    <div
                        key={hiddenTask.id}
                        className="tetris-block-wrapper removed-block"
                        style={{
                            position: 'absolute',
                            left: `${(posX * CELL_SIZE) + 40}px`,
                            top: `${posY * CELL_SIZE}px`,
                            zIndex: 10,
                            // Add a highlight effect to make these blocks stand out
                            boxShadow: '0 0 10px rgba(255, 255, 0, 0.7)',
                        }}
                    >
                        <TetrisBlock task={hiddenTask}/>
                    </div>
                );
            }
        });

        // If we have no saved rows, add a message
        const noSavedRowsMessage = (savedRowsContent.length === 0 && removedBlocks.length === 0) ? (
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: `${(GRID_HEIGHT + 1) * CELL_SIZE}px`,
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    zIndex: 15,
                    textAlign: 'center',
                    width: '80%',
                }}
            >
                No completed rows have been cleared yet.<br/>
                Complete a row in the Done category to see it here.
            </div>
        ) : null;

        return (
            <div
                className="hidden-rows-container"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none' // Allow clicks to pass through
                }}
            >
                <div
                    className="hidden-rows-label"
                    style={{
                        position: 'absolute',
                        left: '0',
                        top: `${GRID_HEIGHT * CELL_SIZE}px`,
                        height: `${HIDDEN_ROWS_COUNT * CELL_SIZE}px`,
                        width: '40px',
                        backgroundColor: 'rgba(100, 0, 100, 0.6)',
                        color: 'white',
                        writingMode: 'vertical-lr',
                        transform: 'rotate(180deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        borderRadius: '0 4px 4px 0',
                    }}
                >
                    Cleared Rows
                </div>
                {hiddenRows}
                {savedRowBlocks}
                {noSavedRowsMessage}
            </div>
        );
    };

    // Add useEffect to check for completed rows whenever the grid changes
    useEffect(() => {
        const newCompletedRows = checkCompletedRows(board.grid);
        if (newCompletedRows.length > 0) {
            setCompletedRows(newCompletedRows);
        }
    }, [board.grid]);

    // Update clearCompletedRows to save row data and track removed blocks
    const clearCompletedRowsWithSave = (board: KanbanBoard, completedRows: number[]): KanbanBoard => {
        if (completedRows.length === 0) return board;

        console.log('Clearing completed rows:', completedRows);

        // Create deep copies of columns and grid
        const updatedColumns = board.columns.map(column => ({
            ...column,
            tasks: [...column.tasks]
        }));
        const updatedGrid = board.grid.map(row => [...row]);

        // Get the Done column
        const doneColumn = updatedColumns.find(col => col.id === 'Done');
        if (!doneColumn) return board;

        // Save the content of each completed row before clearing
        const rowsToSave = completedRows.map(rowIndex => {
            const rowContent: {
                x: number;
                taskId: string;
                shape: TetrisShape;
            }[] = [];

            // For each cell in the row, record its content
            for (let x = 0; x < GRID_WIDTH; x++) {
                const taskId = updatedGrid[rowIndex][x];
                if (taskId !== null) {
                    // Find the task to get its shape
                    const task = doneColumn.tasks.find(t => t.id === taskId);
                    if (task) {
                        rowContent.push({
                            x,
                            taskId,
                            shape: task.shape
                        });
                    }
                }
            }

            return {
                rowIndex,
                cells: rowContent
            };
        });

        // Find blocks that are fully contained in the completed rows
        const fullyRemovedBlocks: {
            task: Task;
            originalPosition: { x: number; y: number };
            hiddenRowIndex: number;
        }[] = [];

        doneColumn.tasks.forEach(task => {
            if (task.gridPosition) {
                // Check if all of this task's points are in completed rows
                const allPointsInCompletedRows = task.blockPoints.every(point => {
                    const blockY = task.gridPosition!.y + point.y;
                    return completedRows.includes(blockY);
                });

                if (allPointsInCompletedRows) {
                    // Store info about this fully removed block
                    const hiddenRowIndex = completedRows.indexOf(task.gridPosition.y +
                        task.blockPoints[0].y); // Use first block point's row

                    fullyRemovedBlocks.push({
                        task: {...task},  // Clone to prevent reference issues
                        originalPosition: {...task.gridPosition},
                        hiddenRowIndex
                    });

                    console.log(`Task ${task.id} is fully contained in completed rows, adding to removed blocks`);
                }
            }
        });

        // Update removedBlocks state to include these newly removed blocks
        setRemovedBlocks(prev => [...prev, ...fullyRemovedBlocks]);

        // Store the saved rows for later display
        setSavedRowsContent(rowsToSave);

        // Process each completed row
        for (let rowIndex of completedRows) {
            // Find all tasks that have cells in this row
            const tasksToModify = new Map<string, Task>();

            // Collect all tasks that have cells in this row
            for (let x = 0; x < GRID_WIDTH; x++) {
                const taskId = updatedGrid[rowIndex][x];
                if (taskId !== null) {
                    // Find the task
                    let task = doneColumn.tasks.find(t => t.id === taskId);
                    if (task && !tasksToModify.has(taskId)) {
                        tasksToModify.set(taskId, {...task});
                    }

                    // Clear the cell in the completed row
                    updatedGrid[rowIndex][x] = null;
                }
            }

            // For each affected task, remove the points that were in the completed row
            // and update their position and shape
            tasksToModify.forEach((task, taskId) => {
                const originalPoints = [...task.blockPoints];

                // Filter out points that were in the completed row
                const remainingPoints = originalPoints.filter(point => {
                    const blockY = task.gridPosition!.y + point.y;
                    return blockY !== rowIndex;
                });

                if (remainingPoints.length === 0) {
                    // If no points remain, remove the entire task
                    doneColumn.tasks = doneColumn.tasks.filter(t => t.id !== taskId);
                } else {
                    // If points remain, update the task with the new points
                    // Find the task in the column
                    const taskIndex = doneColumn.tasks.findIndex(t => t.id === taskId);
                    if (taskIndex !== -1) {
                        // Remove the task from grid before updating
                        originalPoints.forEach(point => {
                            const blockX = task.gridPosition!.x + point.x;
                            const blockY = task.gridPosition!.y + point.y;
                            if (blockX >= 0 && blockX < GRID_WIDTH && blockY >= 0 && blockY < GRID_HEIGHT) {
                                updatedGrid[blockY][blockX] = null;
                            }
                        });

                        // Update the task with new points
                        doneColumn.tasks[taskIndex] = {
                            ...task,
                            blockPoints: remainingPoints
                        };

                        // Place updated task back on grid
                        remainingPoints.forEach(point => {
                            const blockX = task.gridPosition!.x + point.x;
                            const blockY = task.gridPosition!.y + point.y;
                            if (blockX >= 0 && blockX < GRID_WIDTH && blockY >= 0 && blockY < GRID_HEIGHT) {
                                updatedGrid[blockY][blockX] = taskId;
                            }
                        });
                    }
                }
            });

            // Shift all rows above the completed row down one row
            for (let y = rowIndex; y > 9; y--) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    updatedGrid[y][x] = updatedGrid[y - 1][x];
                }
            }

            // Create an empty row at the top of the Done section
            for (let x = 0; x < GRID_WIDTH; x++) {
                updatedGrid[9][x] = null;
            }

            // Update positions of all tasks in the Done section
            doneColumn.tasks.forEach(task => {
                if (task.gridPosition && task.gridPosition.y < rowIndex) {
                    // This task is above the cleared row, so it needs to move down

                    // Remove the task from its current position in the grid
                    task.blockPoints.forEach(point => {
                        const blockX = task.gridPosition!.x + point.x;
                        const blockY = task.gridPosition!.y + point.y;
                        if (blockX >= 0 && blockX < GRID_WIDTH && blockY >= 0 && blockY < GRID_HEIGHT) {
                            updatedGrid[blockY][blockX] = null;
                        }
                    });

                    // Move the task down
                    task.gridPosition = {
                        x: task.gridPosition.x,
                        y: task.gridPosition.y + 1
                    };

                    // Place the task in its new position
                    task.blockPoints.forEach(point => {
                        const blockX = task.gridPosition!.x + point.x;
                        const blockY = task.gridPosition!.y + point.y;
                        if (blockX >= 0 && blockX < GRID_WIDTH && blockY >= 0 && blockY < GRID_HEIGHT) {
                            updatedGrid[blockY][blockX] = task.id;
                        }
                    });
                }
            });
        }

        return {
            columns: updatedColumns,
            grid: updatedGrid
        };
    };

    // Update moveTaskToPosition to use the new function
    const moveTaskToPosition = (taskId: string, x: number, y: number) => {
        console.log('===== MOVE TASK TO POSITION =====');
        console.log('Task ID:', taskId);
        console.log('Target position:', {x, y});
        console.log('Current board state:');
        printGrid(board.grid, 'Current Board');

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
            setBoard(prev => synchronizeGridWithTasks(prev));
            return;
        }

        // Ensure block points are calculated
        if (taskToMove.blockPoints.length === 0) {
            taskToMove.blockPoints = calculateBlockPoints(taskToMove.shape, taskToMove.skills.length);
        }

        console.log('✅ Found task to move:', taskToMove);
        console.log('Task block points:', taskToMove.blockPoints);
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
            console.log('Previous board grid state:');
            printGrid(prevBoard.grid, 'Previous Board');

            // Create deep copies of columns and grid
            const updatedColumns = prevBoard.columns.map(column => ({
                ...column,
                tasks: [...column.tasks]
            }));
            const updatedGrid = prevBoard.grid.map(row => [...row]);

            // 1. Remove the task from its old grid cells (if exists)
            if (originalPosition) {
                console.log('Removing task from old position:', originalPosition);
                console.log('Task block points:', taskToMove.blockPoints);
                taskToMove.blockPoints.forEach(point => {
                    const oldX = originalPosition.x + point.x;
                    const oldY = originalPosition.y + point.y;
                    if (oldX >= 0 && oldX < GRID_WIDTH && oldY >= 0 && oldY < GRID_HEIGHT) {
                        console.log(`Clearing cell at (${oldX}, ${oldY})`);
                        updatedGrid[oldY][oldX] = null;
                    }
                });
            }

            printGrid(updatedGrid, 'After Removing Old Position');

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
            console.log('Placing task at new position:', {x, y});
            console.log('Task block points:', taskToMove.blockPoints);
            taskToMove.blockPoints.forEach(point => {
                const newX = x + point.x;
                const newY = y + point.y;
                if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
                    console.log(`Setting cell at (${newX}, ${newY}) to ${taskId}`);
                    updatedGrid[newY][newX] = taskId;
                }
            });

            printGrid(updatedGrid, 'After Moving Task');

            // Check for completed rows in the Done category after a task is moved
            const newCompletedRows = checkCompletedRows(updatedGrid);
            if (newCompletedRows.length > 0) {
                console.log('Found completed rows:', newCompletedRows);
                // Track the completed rows
                setCompletedRows(newCompletedRows);

                // Clear completed rows and update board only if not showing hidden rows
                if (!showHiddenRows) {
                    return clearCompletedRowsWithSave({
                        columns: updatedColumns,
                        grid: updatedGrid
                    }, newCompletedRows);
                }
            }

            return {
                columns: updatedColumns,
                grid: updatedGrid
            };
        });
    };

    // Update handleBlockRotation to use the new function
    const handleBlockRotation = (taskId: string) => {
        console.log('=== ROTATING BLOCK ===');
        console.log('Task ID:', taskId);

        setBoard(prevBoard => {
            // Find the task
            let taskToRotate: Task | undefined;
            let taskColumn: KanbanColumn | undefined;

            for (const column of prevBoard.columns) {
                const task = column.tasks.find(t => t.id === taskId);
                if (task) {
                    taskToRotate = task;
                    taskColumn = column;
                    break;
                }
            }

            if (!taskToRotate || !taskToRotate.gridPosition) {
                console.error('Task not found or has no position:', taskId);
                return prevBoard;
            }

            console.log('Current position:', taskToRotate.gridPosition);
            console.log('Current block points:', taskToRotate.blockPoints);

            // Calculate new rotated points
            const rotatedPoints = rotateBlockPoints(taskToRotate.blockPoints);
            console.log('Rotated block points:', rotatedPoints);

            // Print current grid state around the task
            const {x, y} = taskToRotate.gridPosition;
            console.log('Current grid state around rotation point:');
            for (let dy = -2; dy <= 2; dy++) {
                let row = '';
                for (let dx = -2; dx <= 2; dx++) {
                    const checkX = x + dx;
                    const checkY = y + dy;
                    if (checkX >= 0 && checkX < GRID_WIDTH && checkY >= 0 && checkY < GRID_HEIGHT) {
                        row += (prevBoard.grid[checkY][checkX] || '---') + ' ';
                    } else {
                        row += 'OOB ';
                    }
                }
                console.log(row);
            }

            // Check if the rotated position would be valid
            if (!isPositionAvailable(prevBoard.grid, taskToRotate.gridPosition.x, taskToRotate.gridPosition.y, {
                ...taskToRotate,
                blockPoints: rotatedPoints
            })) {
                console.log('❌ Cannot rotate - position would be invalid');
                return prevBoard;
            }

            console.log('✅ Rotation is valid, applying changes');

            // Create new board state
            const updatedColumns = prevBoard.columns.map(column => ({
                ...column,
                tasks: column.tasks.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            blockPoints: rotatedPoints
                        };
                    }
                    return task;
                })
            }));

            // Update grid
            const updatedGrid = createEmptyGrid();

            // Reapply all tasks to the grid
            updatedColumns.forEach(column => {
                column.tasks.forEach(task => {
                    if (task.gridPosition) {
                        task.blockPoints.forEach(point => {
                            const x = task.gridPosition!.x + point.x;
                            const y = task.gridPosition!.y + point.y;
                            if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
                                updatedGrid[y][x] = task.id;
                            }
                        });
                    }
                });
            });

            const updatedBoard = {
                columns: updatedColumns,
                grid: updatedGrid
            };

            const newCompletedRows = checkCompletedRows(updatedGrid);
            if (newCompletedRows.length > 0) {
                console.log('Found completed rows after rotation:', newCompletedRows);
                // Track the completed rows
                setCompletedRows(newCompletedRows);

                // Clear completed rows and update board only if not showing hidden rows
                if (!showHiddenRows) {
                    return clearCompletedRowsWithSave(updatedBoard, newCompletedRows);
                }
            }

            return updatedBoard;
        });
    };

    // Function to add a new task to the board
    const addNewTask = (taskData: {
        name: string;
        description?: string;
        skills: string[];
        shape?: TetrisShape;
    }) => {
        // Determine shape based on number of skills if not explicitly provided
        let shape = taskData.shape;

        if (!shape) {
            const skillCount = taskData.skills.length;

            // Map skill count to appropriate shapes
            const shapesBySkillCount: Record<number, TetrisShape[]> = {
                1: ['I', 'L', 'J', 'O', 'S', 'T', 'Z'], // All shapes can have 1 skill
                2: ['I', 'L', 'J', 'O', 'S', 'T', 'Z'], // All shapes can have 2 skills
                3: ['I', 'L', 'J', 'O', 'S', 'T', 'Z'], // All shapes can have 3 skills
                4: ['I', 'L', 'J', 'O', 'S', 'T', 'Z'], // All shapes can have 4 skills
                5: ['L', 'J', 'S', 'T', 'Z'],           // These shapes can have 5 skills
                6: ['L', 'J', 'S', 'T', 'Z'],           // These shapes can have 6 skills
                7: ['L', 'J']                           // Only L and J can have 7 skills
            };

            // Default to 'I' for high skill counts
            const validShapes = shapesBySkillCount[Math.min(skillCount, 7)] || ['I'];

            // Pick a random shape from valid options
            shape = validShapes[Math.floor(Math.random() * validShapes.length)] as TetrisShape;

            console.log(`Determined shape ${shape} for skill count ${skillCount}`);
        }

        // Create skills array with appropriate logo URLs
        const skills = taskData.skills.map(skillName => ({
            name: skillName,
            image: getSkillLogoUrl(skillName)
        }));

        // Create a new task with a unique ID
        const newTask: Task = {
            id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: taskData.name,
            skills,
            shape,
            status: 'Todo' as KanbanStatus,
            blockPoints: calculateBlockPoints(shape, skills.length),
        };

        setBoard(prevBoard => {
            const updatedColumns = prevBoard.columns.map(column => {
                if (column.id === 'Todo') {
                    return {
                        ...column,
                        tasks: [...column.tasks, newTask]
                    };
                }
                return column;
            });

            return {
                columns: updatedColumns,
                grid: prevBoard.grid
            };
        });

        // Log the addition of the new task
        console.log('Added new task to the board:', newTask);

        setTimeout(() => {
            setBoard(prev => synchronizeGridWithTasks(prev));
        }, 0);

        return newTask;
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="mx-auto p-4">
                <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
                <div
                    className="tetris-board-container"
                    ref={gridRef}
                    style={{
                        position: 'relative',
                        height: showHiddenRows
                            ? `${(GRID_HEIGHT + HIDDEN_ROWS_COUNT) * CELL_SIZE}px`
                            : `${GRID_HEIGHT * CELL_SIZE}px`,
                        transition: 'height 0.3s ease-in-out',
                        marginBottom: '60px' // Add space for the button below
                    }}
                >
                    <TetrisGrid
                        width={GRID_WIDTH}
                        height={GRID_HEIGHT}
                        activeStatus={null}
                    />
                    {renderHiddenRows()}
                    <div className="tetris-blocks-layer">
                        {renderTasks()}
                    </div>

                        <button
                        className="toggle-hidden-rows-button"
                        onClick={toggleHiddenRows}
                        style={{
                            position: 'absolute',
                            bottom: showHiddenRows ?
                                `-50px` :
                                `-50px`,
                            left: '150px',
                            padding: '8px 16px',
                            backgroundColor: showHiddenRows ? 'rgba(100, 0, 100, 0.8)' : 'rgba(70, 0, 70, 0.8)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                            zIndex: 20,
                        }}
                    >
                        {showHiddenRows ? '▲ Hide Completed Rows' : '▼ Show Completed Rows'}
                        </button>
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

// Export addNewTask function and the Board component
export { Board as default, initialTasks };

// Create an addTaskToBoard function to be used by other components
let boardAddTaskFunction: ((taskData: {
    name: string;
    description?: string;
    skills: string[];
    shape?: TetrisShape;
}) => Task) | null = null;

export const setBoardAddTaskFunction = (fn: typeof boardAddTaskFunction) => {
    boardAddTaskFunction = fn;
};

export const addTaskToBoard = (taskData: {
    name: string;
    description?: string;
    skills: string[];
    shape?: TetrisShape;
}) => {
    if (boardAddTaskFunction) {
        return boardAddTaskFunction(taskData);
    } else {
        console.error('Board component not mounted yet. Cannot add task.');
        return null;
    }
};
