import { ICarDetails } from "../../../content";
import { useState } from "react";
import { CarDetails } from "../CarDetails/CarDetails";

interface CarListProps {
  filterCarId?: string;
  trackedCars: { [tabId: string]: ICarDetails | null };
}

export const CarList = ({ filterCarId, trackedCars }: CarListProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCars = Object.fromEntries(
    Object.entries(trackedCars).filter(
      ([, car]) =>
        car &&
        (!filterCarId || car.url !== filterCarId) &&
        Object.values(car).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
  );

  return (
    <div className="space-y-4">
      {Object.entries(filteredCars).length > 0 ? (
        <>
          <h2>Tracked Cars:</h2>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          {Object.entries(filteredCars).map(([tabId, car]) =>
            car ? <CarDetails key={tabId} car={car} isNew={false} /> : null
          )}
        </>
      ) : (
        <div className="text-lg font-bold">No cars to display</div>
      )}
    </div>
  );
};
