import React, {useEffect} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Task} from '../types';
import './TetrisBlock.css';

interface TetrisBlockProps {
    task: Task;
}

const TetrisBlock: React.FC<TetrisBlockProps> = ({task}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            task,
            type: 'tetris-block',
        }
    });

    // Log when dragging state changes
    useEffect(() => {
        if (isDragging) {
            console.log('Started dragging block:', task.id, task.title);
        }
    }, [isDragging, task.id, task.title]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Generate blocks based on the shape and number of skills
    const renderSkillBlocks = () => {
        const skillCount = task.skills.length;
        const shape = task.shape;

        // Create arrays to represent the grid layout of each shape
        // true = skill block, false = empty space
        let layout: boolean[][] = [];

        switch (shape) {
            case 'I': // I shape - horizontal line
                if (skillCount <= 4) {
                    // For 1-4 skills, create a horizontal line
                    layout = [Array(skillCount).fill(true)];
                } else {
                    // For more than 4, stack horizontally
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
                        layout = [
                            [true],
                            [true]
                        ];
                        break;
                    case 3:
                        layout = [
                            [true],
                            [true],
                            [true]
                        ];
                        break;
                    case 4:
                        layout = [
                            [true],
                            [true],
                            [true, true]
                        ];
                        break;
                    default:
                        // For more skills, expand the L shape
                        layout = [
                            [true],
                            [true],
                            [true, true, true]
                        ];

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
                        layout = [
                            [true],
                            [true]
                        ];
                        break;
                    case 3:
                        layout = [
                            [true],
                            [true],
                            [true]
                        ];
                        break;
                    case 4:
                        layout = [
                            [false, true],
                            [false, true],
                            [true, true]
                        ];
                        break;
                    default:
                        // For more skills, expand the J shape
                        layout = [
                            [false, false, true],
                            [false, false, true],
                            [true, true, true]
                        ];

                        let remaining = skillCount - 5;
                        let currentRow = 3;

                        while (remaining > 0 && currentRow < 6) {
                            layout.push([true, true, true].slice(0, Math.min(3, remaining)));
                            remaining -= 3;
                            currentRow++;
                        }
                }
                break;

            case 'O': // O shape - square
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
                        layout = [
                            [false, true, true],
                            [true]
                        ];
                        break;
                    case 4:
                        layout = [
                            [false, true, true],
                            [true, true]
                        ];
                        break;
                    default:
                        // For more skills
                        layout = [
                            [false, true, true],
                            [true, true, false]
                        ];

                        let remaining = skillCount - 5;
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
                        layout = [
                            [true, true, true]
                        ];
                        break;
                    case 4:
                        layout = [
                            [true, true, true],
                            [false, true]
                        ];
                        break;
                    default:
                        // For more skills
                        layout = [
                            [true, true, true],
                            [false, true, false],
                            [false, true, false]
                        ];

                        let remaining = skillCount - 5;
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
                        layout = [
                            [true, true],
                            [false, true]
                        ];
                        break;
                    case 4:
                        layout = [
                            [true, true, false],
                            [false, true, true]
                        ];
                        break;
                    default:
                        // For more skills
                        layout = [
                            [true, true, false],
                            [false, true, true]
                        ];

                        let remaining = skillCount - 4;
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
                // Fallback to a simple line
                layout = [Array(skillCount).fill(true)];
        }

        // Convert the layout to actual blocks
        let blockCount = 0;
        return (
            <div className={`tetris-shape ${shape}`}>
                {layout.map((row, rowIndex) => (
                    <div key={rowIndex} className="tetris-row">
                        {row.map((isVisible, colIndex) => {
                            if (isVisible && blockCount < skillCount) {
                                const skillName = task.skills[blockCount];
                                blockCount++;
                                return (
                                    <div
                                        key={colIndex}
                                        className={`skill-block ${shape}`}
                                        title={`${task.title} - ${skillName}`}
                                        style={{'--index': blockCount} as React.CSSProperties}
                                    />
                                );
                            } else {
                                return <div key={colIndex} className="empty-block"/>;
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
            className={`tetris-block-container ${task.shape} ${isDragging ? 'is-dragging' : ''}`}
            title={task.title}
            data-task-id={task.id}
            data-shape={task.shape}
            data-skill-count={task.skills.length}
        >
            {renderSkillBlocks()}
        </div>
    );
};

export default TetrisBlock; 