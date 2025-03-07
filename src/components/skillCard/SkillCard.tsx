type Props = {
  title: string;
  image: string;
};

export const SkillCard = ({ title, image }: Props) => (
  <div className="card bg-base-100 w-96 shadow-sm">
    <figure>
      <img src={image} alt="image" />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
    </div>
  </div>
);
