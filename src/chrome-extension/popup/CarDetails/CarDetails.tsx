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
  }

  function saveCarToTrackedCars() {
    // Save the car to the global tracked cars dictionary
    chrome.runtime.sendMessage({ action: "saveCarToTrackedCars", carDetails: car });
  }

  const formattedPrice = car.price?.startsWith("$") ? car.price : `$${car.price}`;

  return (
    <div
      className={`relative p-4 border rounded shadow-md transition-all ${
        isHighlighted ? "bg-blue-100 border-blue-500 hover:bg-blue-200" : "bg-white border-gray-300 hover:bg-gray-200"
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
