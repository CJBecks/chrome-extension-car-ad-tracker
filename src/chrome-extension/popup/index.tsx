import { ICarDetails } from "../../content";
import "../global.css";
import { useEffect, useState } from "react";
import { CarDetails } from "./CarDetails/CarDetails";

export const Popup = () => {
  const [carDetails, setCarDetails] = useState<ICarDetails | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Request car details from the background script
      chrome.runtime.sendMessage(
        { action: "getCarDetails", tabId: tabs[0].id },
        (response) => {
          console.log("Response received in popup:", response);

          if (response?.carDetails) {
            setCarDetails(response.carDetails);
          }
        }
      );

      // TODO: Get list of current tracked cars
    });
  }, []);

  const handleRemoveAll = () => {
    setCarDetails(null); // Clear all tracked car details
    // Optionally, send a message to the background script to clear the cache
    chrome.runtime.sendMessage({ action: "clearAllCarDetails" });
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
      {carDetails ? (
        <>
          <CarDetails
            car={carDetails}
            onRemove={() => {}}
            isNew={true}
            onTrack={() => {}}
          />
          <CarDetails
            car={carDetails}
            onRemove={() => {}}
            isNew={false}
            onTrack={() => {}}
          />

          <CarDetails
            isHighlighted={true}
            car={carDetails}
            onRemove={() => {}}
            isNew={true}
            onTrack={() => {}}
          />
          <CarDetails
            isHighlighted={true}
            car={carDetails}
            onRemove={() => {}}
            isNew={false}
            onTrack={() => {}}
          />
        </>
      ) : (
        <div className="text-lg font-bold">No car details available</div>
      )}
    </div>
  );
};
