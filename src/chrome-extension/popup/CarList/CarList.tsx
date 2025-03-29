import { ICarDetails } from "../../../content";
import { useState } from "react";
import { CarDetails } from "../CarDetails/CarDetails";

interface CarListProps {
  activeCarId?: string;
  trackedCars: { [tabId: string]: ICarDetails | null };
}

export const CarList = ({ activeCarId, trackedCars }: CarListProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Create a local copy of trackedCars to isolate changes
  const localTrackedCars = { ...trackedCars };

  const filteredCars = Object.entries(localTrackedCars)
    .filter(
      ([, car]) =>
        car &&
        Object.values(car).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    .sort(([, carA], [, carB]) => {
      if (carA?.url === activeCarId) return -1; // Lock the car with filterCarId to the top
      if (carB?.url === activeCarId) return 1;
      return 0;
    });

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border rounded focus:border-gray-400 focus:ring focus:ring-gray-200 focus:outline-none"
      />
      {filteredCars.length > 0 ? (
        <>
          {filteredCars.map(([tabId, car]) =>
            car ? (
              <CarDetails
                key={tabId}
                car={car}
                isNew={false}
                isHighlighted={car.url === activeCarId} // Highlight if URL matches activeCarId
              />
            ) : null
          )}
        </>
      ) : (
        <div className="mt-4">No tracked cars found.</div> // Added margin-top
      )}
    </div>
  );
};
