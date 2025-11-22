import Card from "../Card";
import { jobsData } from "../../data/jobsData";

const ServicesSection = () => {
  return (
    <section className="w-full px-6 py-12">
      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {jobsData.map((job) => (
          <Card
            key={job.id}
            image={job.image}
            title={job.title}
            description={job.description}
            link={`/job-offer/${job.id}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
