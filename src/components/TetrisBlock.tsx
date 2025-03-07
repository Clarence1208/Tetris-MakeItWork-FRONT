import React, {useEffect} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Task} from '../types';
import './TetrisBlock.css';
import {TaskModal} from "./modal/TaskModal.tsx";

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
            console.log('Started dragging block:', task.id, task.name);
        }
    }, [isDragging, task.id, task.name]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Generate blocks based on the shape and number of skills
    const renderSkillBlocks = () => {
        const skillCount = task.skills.length;
        const shape = task.shape;

        // Convert block points to a grid layout
        const maxX = Math.max(...task.blockPoints.map(p => p.x)) + 1;
        const maxY = Math.max(...task.blockPoints.map(p => p.y)) + 1;
        const layout: boolean[][] = Array(maxY).fill(0).map(() => Array(maxX).fill(false));
        task.blockPoints.forEach(point => {
            layout[point.y][point.x] = true;
        });

        // Convert the layout to actual blocks
        let blockCount = 0;
        return (
            <div className={`tetris-shape ${shape}`} onClick={() => {
                if (typeof document !== "undefined") {
                    const modal =  document.getElementById(`task-modal-${task.name}`) as HTMLDialogElement
                    modal.showModal();
                }
            }}>
                <TaskModal task={task} />
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
                                        title={`${task.name} - ${skillName.name}`}
                                        style={{'--index': blockCount} as React.CSSProperties}
                                        data-point={`${colIndex},${rowIndex}`}
                                    >
                                        <img
                                            src={skillName.image}
                                            alt={`${skillName.name} logo`}/>
                                    </div>
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
            title={task.name}
            data-task-id={task.id}
            data-shape={task.shape}
            data-skill-count={task.skills.length}
        >
            {renderSkillBlocks()}
        </div>
    );
};

export default TetrisBlock; 