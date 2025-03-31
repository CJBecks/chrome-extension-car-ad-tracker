import { ICarDetails } from "../../content";
import "../global.css";
import { useEffect, useState } from "react";
import { CarDetails } from "./CarDetails/CarDetails";
import { CarList } from "./CarList/CarList";
import { ConfirmationModal } from "./ConfirmationModal/ConfirmationModal"; // Import the modal component

export const Popup = () => {
  const [carDetails, setCarDetails] = useState<ICarDetails | null>(null);
  const [allTrackedCarDetailsDictionary, setAllTrackedCarDetailsDictionary] = useState<{ [tabId: string]: ICarDetails | null }>({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    //chrome.runtime.sendMessage({ action: "clearBadge" }); // Clear the badge when the popup is opened

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Request car details from the background script
      chrome.runtime.sendMessage(
        { action: "getCarDetails", tabId: tabs[0].id },
        (response) => {
          if (response?.carDetails && response?.carDetails.price != undefined) {
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
          }
        }
      );

      // TODO: Get list of current tracked cars
    });
  }, [allTrackedCarDetailsDictionary]);

  const handleRemoveAll = () => {
    if (Object.keys(allTrackedCarDetailsDictionary).length > 0) {
      setIsModalOpen(true); // Open the modal only if there are listings to clear
    }
  };

  const confirmRemoveAll = () => {
    setCarDetails(null); // Clear all tracked car details
    chrome.runtime.sendMessage({ action: "clearAllSavedCars" }); // Clear the cache

    // If the current car is not tracked, show the new car badge
    if (carDetails) {
      chrome.runtime.sendMessage({ action: "showNewCarBadge" });
    } else {
      chrome.runtime.sendMessage({ action: "clearBadge" }); // Remove the notification
    }

    setIsModalOpen(false); // Close the modal
  };

  const cancelRemoveAll = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="public/automall-logo-48.png" alt="Automall Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Tracked Advertisements</h1>
        </div>
        <button
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          onClick={handleRemoveAll}
        >
          Remove All
        </button>
        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={confirmRemoveAll}
          onCancel={cancelRemoveAll}
          message="Are you sure you want to remove all saved listings?"
        />
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
