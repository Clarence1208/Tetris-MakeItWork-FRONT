type Props = {
  title: string;
  imageSrc: string;
};

export const SkillCard = ({ title, imageSrc }: Props) => (
  <div className="card bg-base-100 w-96 shadow-sm">
    <figure>
      <img src={imageSrc} alt="image" />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
    </div>
  </div>
);
