import Card from "../Card";
import groomer from "../../assets/images/groomer.jpg";
import veterinarian from "../../assets/images/veterinarian.jpg";
import assistant from "../../assets/images/assistant.jpg";

const ServicesSection = () => {
  return (
    <section className="w-full px-6 py-12">
      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        <Card
          image={groomer}
          title="Groomer"
          description="Provides pet grooming services like bathing, trimming, and styling."
          link="job-offer"
        />
        <Card
          image={veterinarian}
          title="Veterinarian"
          description="Provides medical care, surgery, and diagnosis for pets."
        />
        <Card
          image={assistant}
          title="Veterinary Assistant"
          description="Helps with handling animals, cleaning, feeding, and supporting daily clinic operations."
        />
      </div>
    </section>
  );
};

export default ServicesSection;
