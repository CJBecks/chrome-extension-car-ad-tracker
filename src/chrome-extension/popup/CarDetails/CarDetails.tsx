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

  return (
    <div
      className={`p-4 border rounded shadow-md ${
        isHighlighted ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300"
      }`}
    >
      <h4 className="text-lg font-bold">{car.make} {car.model}</h4>
      <p className="text-sm">Year: {car.year}</p>
      <p className="text-sm">Price: {car.price}</p>
      <p className="text-sm">Date Listed: {car.dateListed}</p>
      <p className="text-sm">Days on Market: {car.daysOnMarket ?? "Unknown"}</p>
      {isNew ? (
        <button
          className="mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          onClick={(e) => {
            e.stopPropagation();
            saveCarToTrackedCars();
          }}
        >
          Track
        </button>
      ) : (
        <button
          className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation();
            removeCarFromTrackedCars();
          }}
        >
          Remove
        </button>
      )}
    </div>
  );
};
