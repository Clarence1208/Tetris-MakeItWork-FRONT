import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/modal/Modal";
import { SkillService } from "../../services/skillService/SkillService";
import { SkillCard } from "../../components/skillCard/SkillCard";

const formFields = [
  {
    key: "name",
    legend: "Skill name",
    placeholder: "Ex: React",
  },
  {
    key: "imageSrc",
    legend: "Skill image",
    placeholder: "Ex: http://image-url...",
  },
];

export const Skills = () => {
  const [skills, setSkills] = useState<{ name: string; imageSrc: string }[]>(
    []
  );

  const [skillFormData, setSkillFormData] = useState({
    name: "",
    imageSrc: "",
  });

  const skillService = useMemo(() => new SkillService(), []);

  useEffect(() => {
    const getSkills = async () => {
      const skills = await skillService.getSkills();
      setSkills(skills);
    };
    getSkills();
  }, [skillService]);

  const handleChange = (key: string, value: string) => {
    setSkillFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmitSkillForm = async () => {
    await skillService.createSkill(skillFormData);
  };

  return (
    <div className="flex">
      <div>
        {skills.map(({ name, imageSrc }) => (
          <SkillCard title={name} imageSrc={imageSrc} />
        ))}
      </div>
      <Modal buttonText="Create skill" dialogTitle="Create skill">
        <form>
          <div className="join join-vertical">
            {formFields.map(({ key, legend, placeholder }) => (
              <fieldset className="fieldset my-1">
                <legend className="fieldset-legend">{legend}</legend>
                <input
                  type="text"
                  className="input"
                  placeholder={placeholder}
                  required
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </fieldset>
            ))}
            <button
              type="submit"
              className="btn btn-default my-4"
              onClick={handleSubmitSkillForm}
            >
              Create skill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
