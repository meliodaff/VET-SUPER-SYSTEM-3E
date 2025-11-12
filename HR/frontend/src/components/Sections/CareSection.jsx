const CareSection = () => (
  <section className="w-full px-6 py-16 bg-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="flex flex-col justify-center text-left">
        <h4 className="text-blue-900 font-bold uppercase tracking-wide mb-2">
          Fur Ever Care
        </h4>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-900 leading-tight mb-4">
          Where Every Paw <br /> Gets Family Care
        </h2>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-lg">
          We’re more than a clinic—we’re a family that loves pets and the people
          who care for them. From wagging tails to purring friends, our team
          works together to bring comfort, health, and happiness to every animal
          that visits us.
        </p>
      </div>

      <div className="flex justify-end relative space-x-4">
        <div className="w-40 h-60 sm:w-48 sm:h-72 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-b from-[#CFE7FF] to-[#7C8B99] transform translate-y-4">
          <img
            src="src/assets/images/cat.png"
            alt="Cute kitten"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-40 h-60 sm:w-48 sm:h-72 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-b from-[#CFE7FF] to-[#7C8B99] transform -translate-y-4">
          <img
            src="src/assets/images/leftdog.png"
            alt="Happy dog"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

export default CareSection;
