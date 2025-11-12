const HeroSection = () => (
  <section className="flex flex-col items-center justify-center px-4 py-12 min-h-[calc(100vh-4rem)]">
    <div className="text-center mb-8 lg:mb-12">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-black leading-tight mb-2">
        Where Employee Care
      </h1>
      <h2
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white/70 leading-tight drop-shadow-lg"
        style={{ WebkitTextStroke: "2px rgba(0,0,0,0.1)" }}
      >
        Meets Pet Care.
      </h2>
    </div>

    <div className="mb-8 lg:mb-12">
      <img
        src="src/assets/images/dog.png"
        alt="Happy dog"
        className="w-48 sm:w-64 lg:w-80 object-contain"
      />
    </div>
  </section>
);

export default HeroSection;
