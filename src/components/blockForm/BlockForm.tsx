import './BlockForm.css'
import { ChangeEvent, FormEvent, useState, useRef, useEffect } from "react";
import CustomError from "../CustomError.tsx";
import { addTaskToBoard } from "../../components/Board.tsx";

// Mapping of skill names to their logo URLs for preview
const skillLogos: Record<string, string> = {
    "React": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    "Angular": "https://angular.io/assets/images/logos/angular/angular.svg",
    "Vue": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png",
    "Node": "https://e7.pngegg.com/pngimages/306/37/png-clipart-node-js-logo-node-js-javascript-web-application-express-js-computer-software-others-miscellaneous-text-thumbnail.png",
    "Node.js": "https://w7.pngwing.com/pngs/232/470/png-transparent-circle-js-node-node-js-programming-round-icon-popular-services-brands-vol-icon-thumbnail.png",
    "PHP": "https://www.php.net/images/logos/new-php-logo.svg",
    "Java": "https://dev.java/assets/images/java-logo-vert-blk.png",
    "Spring": "https://spring.io/img/spring.svg",
    "Nest": "https://nestjs.com/img/logo-small.svg",
    "C#": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/C_Sharp_wordmark.svg/800px-C_Sharp_wordmark.svg.png"
};

// Function to get a skill logo URL or return a default
const getSkillLogo = (skillName: string): string => {
    return skillLogos[skillName] || `https://via.placeholder.com/20?text=${encodeURIComponent(skillName.charAt(0))}`;
};

type TaskFormData = {
    name: string;
    description: string;
    company: string;
    skills: string[];
}
type Skill = {
    id: number;
    name: string;
}
const initialTaskFormData: TaskFormData = {
    name: '',
    description: '',
    company: '',
    skills: [],
}

//fixme
const skillsAvailables : Skill[] = [
    {id: 0, name: "None"},
    {id: 1, name: "Nest"},
    {id: 2, name: "PHP"},
    {id: 3, name: "React"},
    {id: 4, name: "Angular"},
    {id: 5, name: "Vue"},
    {id: 6, name: "Java"},
    {id: 7, name: "Spring"},
    {id: 8, name: "Node"},
    {id: 9, name: "C#"},
]

// Define the maximum number of skills allowed
const MAX_SKILLS_ALLOWED = 5;

export default function BlockForm() {
    const [taskFormData, setTaskFormData] = useState<TaskFormData>(initialTaskFormData);
    const [skills] = useState<Skill[]>(skillsAvailables);
    const [error, setError] = useState("");
    const [openError, setOpenError] = useState<boolean>(false);
    function handleClose() {
        setOpenError(false);
    }
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside the dropdown to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Keep the API call function but don't use it (as per requirements)
    async function postTask(formData: TaskFormData) {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                setError('Failed to create the task :' + response.statusText);
                setOpenError(true);
            }
            const data: any = await response.json();
            return data;
        }catch (error) {
            setError('Failed to create the task' + error);
            setOpenError(true);
            return {};
        }
    }

    //useEffecttogetskills?

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setTaskFormData((formData) => ({
            ...formData,
            [name]: value,
        }));
    }

    async function handleSubmitTaskForm(event: FormEvent){
        event.preventDefault();

        // Validate required fields
        if (!taskFormData.name.trim()) {
            setError('Task name is required');
            return;
        }

        if (!taskFormData.description.trim()) {
            setError('Task description is required');
            return;
        }

        // assert at least the two first skills are filled
        if (taskFormData.skills.length < 2) {
            setError('Please select at least two skills');
            return;
        }

        try {
            const addedTask = addTaskToBoard({
                title: taskFormData.name,
                description: taskFormData.description,
                skills: taskFormData.skills.filter(skill => skill !== "None"),
            });

            if (addedTask) {
                console.log('Task added to Tetris board:', addedTask);
                // Reset form fields
                setTaskFormData(initialTaskFormData);
                setError(""); // Clear any errors
            } else {
                setError('Failed to add task to the board. Make sure the board is initialized.');
            }
        } catch (error) {
            setError('Failed to create the task: ' + error);
        }
    }

    function handleSkillCheckboxChange(e: ChangeEvent<HTMLInputElement>, skillName: string) {
        if (skillName === "None") return;

        const checked = e.target.checked;

        setTaskFormData(prevState => {
            if (checked && prevState.skills.length >= MAX_SKILLS_ALLOWED) {
                // Prevent the checkbox from being checked by setting it back to unchecked
                e.target.checked = false;
                setError(`Maximum of ${MAX_SKILLS_ALLOWED} skills allowed`);
                return prevState;
            }

            // Clear error when successfully updating skills
            setError("");

            if (checked) {
                // Add the skill if it's not already in the list
                return {
                    ...prevState,
                    skills: prevState.skills.includes(skillName)
                        ? prevState.skills
                        : [...prevState.skills, skillName]
                };
            } else {
                return {
                    ...prevState,
                    skills: prevState.skills.filter(s => s !== skillName)
                };
            }
        });
    }

    // MultiSelect Dropdown Component for Skills
    const MultiSelectDropdown = () => {
        const remainingSkills = MAX_SKILLS_ALLOWED - taskFormData.skills.length;
        const isAtMaxSkills = taskFormData.skills.length >= MAX_SKILLS_ALLOWED;

        return (
            <div className="multi-select-dropdown" ref={dropdownRef}>
                <button
                    type="button"
                    className="dropdown-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <span>
                        {taskFormData.skills.length > 0
                            ? `${taskFormData.skills.length}/${MAX_SKILLS_ALLOWED} skills selected`
                            : `Select skills (max ${MAX_SKILLS_ALLOWED})`}
                    </span>
                    <span>{dropdownOpen ? '▲' : '▼'}</span>
                </button>

                {dropdownOpen && (
                    <div
                        className="dropdown-content"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            marginTop: '5px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            zIndex: 10,
                        }}
                    >
                        {isAtMaxSkills && (
                            <div style={{
                                padding: '8px 10px',
                                color: 'white',
                                backgroundColor: '#ef4444',
                                borderRadius: '6px 6px 0 0',
                                fontSize: '14px'
                            }}>
                                Maximum {MAX_SKILLS_ALLOWED} skills limit reached
                            </div>
                        )}
                        <ul style={{ padding: '10px', margin: 0, listStyle: 'none' }}>
                            {skills
                                .filter(skill => skill.name !== "None")
                                .map(skill => {
                                    const isSelected = taskFormData.skills.includes(skill.name);
                                    const isDisabled = isAtMaxSkills && !isSelected;

                                    return (
                                        <li key={skill.id} style={{ padding: '8px 0' }}>
                                            <label style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                opacity: isDisabled ? 0.5 : 1,
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => handleSkillCheckboxChange(e, skill.name)}
                                                    disabled={isDisabled}
                                                    style={{ marginRight: '10px' }}
                                                />
                                                <img
                                                    src={getSkillLogo(skill.name)}
                                                    alt={skill.name}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        marginRight: '8px',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                                {skill.name}
                                            </label>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    // Display the current selected skills with a remove option
    const renderSelectedSkills = () => {
        if (taskFormData.skills.length === 0) {
            return null;
        }

        return (
            <div className="selected-skills mt-3">
                <h3 className="text-sm font-bold mb-1">Selected Skills:</h3>
                <div className="flex flex-wrap gap-2">
                    {taskFormData.skills.map((skill, index) => (
                        <span
                            key={index}
                            className="badge badge-primary badge-lg"
                            onClick={() => {
                                // Remove skill when clicked
                                setTaskFormData(prev => ({
                                    ...prev,
                                    skills: prev.skills.filter(s => s !== skill)
                                }));
                                setError(""); // Clear any error when removing skills
                            }}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px 8px'
                            }}
                        >
                            <img
                                src={getSkillLogo(skill)}
                                alt={skill}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    marginRight: '4px',
                                    objectFit: 'contain'
                                }}
                            />
                            {skill} ✕
                        </span>
                    ))}
                </div>
                <p className="text-xs mt-1">
                    {taskFormData.skills.length < MAX_SKILLS_ALLOWED
                        ? `You can select ${MAX_SKILLS_ALLOWED - taskFormData.skills.length} more skills`
                        : 'Maximum number of skills reached'}
                </p>
            </div>
        );
    };

    return (
        <div className="blockForm">
            {openError && <CustomError message={error} handleClose={handleClose} />}
            <h2>Create a task</h2>
            <form>
                <div className="join join-vertical">
                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Task name</legend>
                        <input
                            type="text"
                            className="input"
                            placeholder="Ex: Migrate to React18"
                            required
                            name="name"
                            value={taskFormData.name}
                            onChange={handleChange}
                        />
                    </fieldset>

                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Task description</legend>
                        <input
                            type="text"
                            className="input"
                            placeholder="Ex: Update the lib version"
                            required
                            name="description"
                            value={taskFormData.description}
                            onChange={handleChange}
                        />
                    </fieldset>

                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Company linked</legend>
                        <input
                            type="text"
                            className="input"
                            placeholder="Ex: Update the lib version"
                            required
                            name="company"
                            value={taskFormData.company}
                            onChange={handleChange}
                        />
                        <p className="fieldset-label">Optional</p>
                    </fieldset>

                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Skills (Multi-select)</legend>
                        <div style={{ position: 'relative' }}>
                            <MultiSelectDropdown />
                        </div>
                        {renderSelectedSkills()}
                    </fieldset>

                    <button type="submit" className="btn btn-default my-4" onClick={handleSubmitTaskForm}>Create task</button>
                </div>
            </form>
        </div>
    )
}