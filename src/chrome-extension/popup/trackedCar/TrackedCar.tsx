import React from "react";
import { ICarDetails } from "../../../content";

interface TrackedCarProps {
  car: ICarDetails;
  isHighlighted: boolean;
  onRemove: () => void;
}

export const TrackedCar: React.FC<TrackedCarProps> = ({ car, isHighlighted, onRemove }) => {
  return (
    <div
      className={`p-4 border rounded shadow-md ${
        isHighlighted ? "bg-blue-100" : "bg-white"
      }`}
    >
      <h4 className="text-lg font-bold">{car.make} {car.model}</h4>
      <p className="text-sm">Year: {car.year}</p>
      <p className="text-sm">Price: {car.price}</p>
      <p className="text-sm">Date Listed: {car.dateListed}</p>
      <button
        className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        Remove
      </button>
    </div>
  );
};
