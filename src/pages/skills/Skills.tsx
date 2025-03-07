import { useCallback, useEffect, useMemo, useState } from "react";
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
    key: "image",
    legend: "Skill image",
    placeholder: "Ex: http://image-url...",
  },
];

export const Skills = () => {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<{ name: string; image: string }[]>([]);

  const [skillFormData, setSkillFormData] = useState({
    name: "",
    image: "",
  });

  const skillService = useMemo(() => new SkillService(), []);

  const getSkills = useCallback(async () => {
    const skills = await skillService.getSkills();
    setSkills(skills);
  }, [skillService]);

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  const handleChange = (key: string, value: string) => {
    setSkillFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmitSkillForm = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await skillService.createSkill(skillFormData);
    setOpen(false);
    await getSkills();
  };

  return (
    <div className="flex">
      <div>
        {skills.map(({ name, image }) => (
          <SkillCard title={name} image={image} />
        ))}
      </div>
      <Modal
        buttonText="Create skill"
        dialogTitle="Create skill"
        open={open}
        setOpen={setOpen}
      >
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
