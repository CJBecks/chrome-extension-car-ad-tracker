import { ICarDetails } from "../../../content";
import { CarDetails } from "../CarDetails/CarDetails";

interface CarListProps {
  trackedCars: { [tabId: string]: ICarDetails | null };
}

export const CarList = ({ trackedCars }: CarListProps) => {

  console.log("Car List Component tracked cars:", trackedCars);

  return (
    <div className="space-y-4">
      {Object.entries(trackedCars).length > 0 ? (
        <>
          <h2>Tracked Cars:</h2>
          {Object.entries(trackedCars).map(([tabId, car]) =>
            car ? (
              <CarDetails key={tabId} car={car} isNew={false} />
            ) : null
          )}
        </>
      ) : (
        <div className="text-lg font-bold">No cars to display</div>
      )}
    </div>
  );
};
