import { ICarDetails } from "../../content";
import "../global.css";
import { useEffect, useState } from "react";

export const Popup = () => {
  console.log("Popup mounted");
  const [carDetails, setCarDetails] = useState<ICarDetails | null>(null);

  useEffect(() => {
    console.log("Popup mounted");

    // TODO get the current open tab id
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      console.log("Current tab id:", tabId);

      // Request car details from the background script
      chrome.runtime.sendMessage(
        { action: "getCarDetails", tabId: tabId },
        (response) => {

          console.log("Response received in popup:", response);
          
          if (response?.carDetails) {
            setCarDetails(response.carDetails);
          }
        }
      );
    });
  }, []);

  // function test(): void {
  //   chrome.runtime.sendMessage({ action: "getCarDetails" }, (response) => {

  //     console.log("Response received in popup:", response);

  //     if (response?.carDetails) {
  //       setCarDetails(response.carDetails);
  //     }
  //   });
  // }

  return (
    <div className="text-5xl p-10 font-extrabold">
      {carDetails ? (
        <div>
          <div>Make: {carDetails.make}</div>
          <div>Model: {carDetails.model}</div>
          <div>Year: {carDetails.year}</div>
          <div>Price: {carDetails.price}</div>
          <div>Date Listed: {carDetails.dateListed}</div>
        </div>
      ) : (
        <div>No car details available</div>
      )}

      {/* <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={test}
      >
        View Listing
      </button> */}
    </div>
  );
};
