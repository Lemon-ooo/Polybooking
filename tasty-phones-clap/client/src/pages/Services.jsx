import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const servicesData = [
    {
      _id: "1",
      name: "Airport Pickup",
      description:
        "Private airport transfer with air-conditioned car and professional driver. Hassle-free travel to your hotel.",
      price: 25,
      image:
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
    },
    {
      _id: "2",
      name: "Breakfast Buffet",
      description:
        "Start your day with a delicious buffet featuring international and local cuisine, freshly prepared every morning.",
      price: 15,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    },
    {
      _id: "3",
      name: "Spa & Massage",
      description:
        "Relax and rejuvenate with professional massage therapy, aromatherapy oils, and tranquil ambiance.",
      price: 50,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
    },
    {
      _id: "4",
      name: "Laundry Service",
      description:
        "Fast and convenient laundry and ironing service to keep your clothes clean and fresh during your stay.",
      price: 10,
      image:
        "https://rjkool.com/wp-content/uploads/2021/09/laundry-services.jpg",
    },
    {
      _id: "5",
      name: "City Tour",
      description:
        "Discover the beauty of the city with our guided sightseeing tours covering top attractions and hidden gems.",
      price: 90,
      image:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800",
    },
    {
      _id: "6",
      name: "Car Rental",
      description:
        "Rent a car with or without a driver for flexible travel and easy exploration of nearby destinations.",
      price: 70,
      image:
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800",
    },
  ];

  return (
    <div className="py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-playfair font-semibold text-gray-800">
          Our Premium Services
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Choose from our exclusive range of hospitality services to enhance
          your stay with comfort, convenience, and style.
        </p>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {servicesData.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                ${service.price}
              </span>
            </div>

            {/* Info */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.name}
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  {service.description}
                </p>
              </div>

              {/* Button luôn hiển thị và căn giữa */}
              <div className="mt-auto flex justify-center">
                <Link
                  to={`/services/${service._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-7 py-3 rounded-full transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
