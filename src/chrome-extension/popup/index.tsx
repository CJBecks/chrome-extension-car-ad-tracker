import { ICarDetails } from "../../content";
import "../global.css";
import { useEffect, useState } from "react";
import { CarDetails } from "./CarDetails/CarDetails";
import { CarList } from "./CarList/CarList";

export const Popup = () => {
  const [carDetails, setCarDetails] = useState<ICarDetails | null>(null);
  const [allTrackedCarDetailsDictionary, setAllTrackedCarDetailsDictionary] = useState<{ [tabId: string]: ICarDetails | null }>({});

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Request car details from the background script
      chrome.runtime.sendMessage(
        { action: "getCarDetails", tabId: tabs[0].id },
        (response) => {
          if (response?.carDetails) {
            setCarDetails(response.carDetails);
          }
        }
      );

      // Request all stored cars from the background script
      chrome.runtime.sendMessage(
        { action: "getAllTrackedCars" },
        (response) => {
          if (response?.trackedCars) {
            setAllTrackedCarDetailsDictionary(response.trackedCars);
            console.log(allTrackedCarDetailsDictionary);
          }
        }
      );

      // TODO: Get list of current tracked cars
    });
  }, [allTrackedCarDetailsDictionary]);

  const handleRemoveAll = () => {
    setCarDetails(null); // Clear all tracked car details
    // Optionally, send a message to the background script to clear the cache
    chrome.runtime.sendMessage({ action: "clearAllSavedCars" });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tracked Advertisements</h1>
        <button
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          onClick={handleRemoveAll}
        >
          Remove All
        </button>
      </div>
      {carDetails && !Object.values(allTrackedCarDetailsDictionary).some(
        (trackedCar) => trackedCar?.url === carDetails.url
      ) ? (
        <CarDetails
          isHighlighted={true}
          car={carDetails}
          isNew={true}
        />
      ) : null}

      <CarList trackedCars={allTrackedCarDetailsDictionary} activeCarId={carDetails?.url} />
    </div>
  );
};
