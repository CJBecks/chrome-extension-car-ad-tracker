import React from "react";
import { ICarDetails } from "../../../content";

interface CarDetailsProps {
  car: ICarDetails;
  isNew: boolean;
  isHighlighted?: boolean;
  onRemove: () => void;
  onTrack: () => void;
}

export const CarDetails: React.FC<CarDetailsProps> = ({ car, isNew, isHighlighted = false, onRemove, onTrack }) => {
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
            onTrack();
          }}
        >
          Track
        </button>
      ) : (
        <button
          className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          Remove
        </button>
      )}
    </div>
  );
};
