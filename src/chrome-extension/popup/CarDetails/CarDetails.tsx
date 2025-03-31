import React from "react";
import { ICarDetails } from "../../../content";

interface CarDetailsProps {
  car: ICarDetails;
  isNew: boolean;
  isHighlighted?: boolean;
}

export const CarDetails: React.FC<CarDetailsProps> = ({ car, isNew, isHighlighted = false }) => {

  function removeCarFromTrackedCars() {
    chrome.runtime.sendMessage({ action: "removeCarFromTrackedCars", carDetails: car });
    if (isHighlighted) {
      chrome.runtime.sendMessage({ action: "showNewCarBadge" }); // Update badge to reflect car removal
    }
  }

  function saveCarToTrackedCars() {
    // Save the car to the global tracked cars dictionary
    chrome.runtime.sendMessage({ action: "saveCarToTrackedCars", carDetails: car });
    chrome.runtime.sendMessage({ action: "showTrackedCarBadge" }); // Update badge to reflect car addition
  }

  const formattedPrice = car.price?.startsWith("$") ? car.price : `$${car.price}`;

  return (
    <div
      className={`relative p-4 rounded shadow-md transition-all ${
        isHighlighted
          ? isNew
            ? "border-2 border-[#FFA500]/50 bg-orange-50 hover:bg-orange-100 hover:border-orange-500/50"
            : "border-2 border-[#228B22]/50 bg-green-50 hover:bg-green-100 hover:border-green-700/50"
          : "border border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold">{car.make} {car.model}</h4>
        {!isNew && (
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none z-10"
            onClick={(e) => {
              e.stopPropagation();
              removeCarFromTrackedCars();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <p className="text-sm">Year: {car.year}</p>
      <p className="text-sm">Price: {formattedPrice}</p>
      <p className="text-sm">
        URL: <a href={car.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">
          {new URL(car.url).hostname}
        </a>
      </p>
      {isNew && (
        <button
          className="mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          onClick={(e) => {
            e.stopPropagation();
            saveCarToTrackedCars();
          }}
        >
          Track
        </button>
      )}
    </div>
  );
};
