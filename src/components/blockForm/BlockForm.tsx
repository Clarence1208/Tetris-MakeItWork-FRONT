import './BlockForm.css'
import {ChangeEvent, FormEvent, useState} from "react";
import CustomError from "../CustomError.tsx";


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
const initialSkills : Skill[] = [
    {id: 1, name: "Nest"},
    {id: 2, name: "PHP"},
]
export default function  BlockForm() {

    const [taskFormData, setTaskFormData] = useState<TaskFormData>(initialTaskFormData);
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [error, setError] = useState("");
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
            }
            const data: any = await response.json();
            return data;
        }catch (error) {
            setError('Failed to create the task' + error);
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
        console.log(taskFormData);
    }

    async function handleSubmitTaskForm(event: FormEvent){
        event.preventDefault();
            try {
                // Call the API to create the card
                const newTask = await postTask(taskFormData);
                if (!newTask.name) {
                    return;
                }
            } catch (error) {
                setError('Failed to create the task' + error);
            } finally {
                // Reset form fields
                setTaskFormData(initialTaskFormData);
            }
        }

    function handleSelectSkills(e: ChangeEvent<HTMLSelectElement>) {
        const selectedItem = e.target.value as string;

        setTaskFormData((prevState) => {
            const updatedSkills = prevState.skills.includes(selectedItem)
                ? prevState.skills
                : [...prevState.skills, selectedItem]; // Add selected skill to skills array
            return {
                ...prevState,
                skills: updatedSkills,
            }
        });
        console.log(taskFormData);
    }


    return (
        <div className="blockForm">
            {error && <CustomError message={error} />}
            <h2>Create a task</h2>
            <form>
                <div className="join join-vertical">
                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Task name</legend>
                        <input type="text" className="input" placeholder="Ex: Migrate to React18" required
                               onChange={handleChange}/>
                    </fieldset>

                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Task description</legend>
                        <input type="text" className="input" placeholder="Ex: Update the lib version" required
                               onChange={handleChange}/>
                    </fieldset>

                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Company linked</legend>
                        <input type="text" className="input" placeholder="Ex: Update the lib version" required
                               onChange={handleChange}/>
                        <p className="fieldset-label">Optionnal</p>
                    </fieldset>

                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Skill 1</legend>
                        <select defaultValue="None" className="select select-primary" onChange={handleSelectSkills}>
                            <option disabled={true}>Choose a skill linked</option>
                            {skills.map(skill => (
                                <option key={skill.id} value={skill.name}>
                                    {skill.name}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Skill 2</legend>
                        <select defaultValue="None" className="select select-accent" onChange={handleSelectSkills}>
                            <option disabled={true}>Choose a skill linked</option>
                            {skills.map(skill => (
                                <option key={skill.id} value={skill.name}>
                                    {skill.name}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset className="fieldset my-1">
                        <legend className="fieldset-legend">Skill 3</legend>
                        <select defaultValue="None" className="select select-info" onChange={handleSelectSkills}>
                            <option disabled={true}>Choose a skill linked</option>
                            {skills.map(skill => (
                                <option key={skill.id} value={skill.name}>
                                    {skill.name}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <button type="submit" className="btn btn-default my-4" onClick={handleSubmitTaskForm}>Create task</button>
                </div>

            </form>
        </div>
    )
}