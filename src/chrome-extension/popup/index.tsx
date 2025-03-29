import { ICarDetails } from "../../content";
import "../global.css";
import { useEffect, useState } from "react";
import { TrackedCar } from "./trackedCar/TrackedCar";

export const Popup = () => {
  console.log("Popup mounted");
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

  return (
    <div className="p-4 space-y-4">
      {carDetails ? (
          <TrackedCar car={carDetails} onRemove={() => {}} isHighlighted={true} />

      ) : (
        <div className="text-lg font-bold">No car details available</div>
      )}
    </div>
  );
};
