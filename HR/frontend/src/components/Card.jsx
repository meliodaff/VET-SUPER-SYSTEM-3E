import Button from "./Button";
import { Link } from "react-router-dom";

const Card = ({ image, title, description, link }) => {
  return (
    <div className="min-w-[250px] max-w-[250px] bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4 flex flex-col justify-between h-[200px]">
        <h4 className="text-center font-bold text-lg text-black mb-2">
          {title}
        </h4>
        <p className="text-gray-700 text-sm mb-3 text-center">{description}</p>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 self-center">
          <Link to={link}>Apply Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default Card;
