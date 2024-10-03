import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Setup default icon for marker in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapLocationModalProps {
  onClose: () => void;
  onLocationSelect: (lat: number, long: number, locationDetails: any) => void;
}

const MapLocationModal: React.FC<MapLocationModalProps> = ({
  onClose,
  onLocationSelect,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const handleMapClick = (lat: number, long: number) => {
    setMarkerPosition([lat, long]);
    setSelectedLocation({ lat, lon: long });

    axios
      .get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat,
          lon: long,
          format: "json",
        },
      })
      .then((response) => {
        const { address } = response.data;
      })
      .catch((error) => {
        console.error("Error during reverse geocoding:", error);
      });
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setErrorMessage(null);

    if (query) {
      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: query,
              format: "json",
            },
          }
        );

        if (response.data.length === 0) {
          setSearchResults([]);
        } else {
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error("Error searching location:", error);
        setErrorMessage("Error searching location. Please try again.");
      }
    } else {
      setSearchResults([]);
    }
  };

  const LocationMarker = () => {
    const map = useMap();

    // Fly to marker position if it exists
    if (markerPosition) {
      map.flyTo(markerPosition, 17); // Zoom level 15
    }

    return markerPosition ? (
      <Marker position={markerPosition}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null;
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setMarkerPosition([lat, lon]);
    setSelectedLocation({ lat, lon });
    setSearchResults([]); // Clear search results after selection
    handleMapClick(lat, lon); // Optional: you can call this if needed
  };

  const handleSubmit = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lon, {});
      onClose(); // Close modal on submit
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-3xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Select Location</h2>

        <input
          type="text"
          placeholder="Search for location"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
        />

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {searchResults.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
            <ul>
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() =>
                    handleLocationSelect(
                      parseFloat(result.lat),
                      parseFloat(result.lon)
                    )
                  }
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <MapContainer
          center={markerPosition || [-5.0, 105.0]} // Koordinat untuk Indonesia
          zoom={markerPosition ? 13 : 5} // Level zoom awal
          maxZoom={18} // Level zoom maksimum
          minZoom={5} // Level zoom minimum
          style={{ height: "300px", width: "100%" }}
          attributionControl={false} // Menyembunyikan watermark
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
          <MapContainerEvents
            onClick={(e) => handleMapClick(e.latlng.lat, e.latlng.lng)}
          />
        </MapContainer>

        {selectedLocation && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Selected Location:</h3>
            <p>Latitude: {selectedLocation.lat}</p>
            <p>Longitude: {selectedLocation.lon}</p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-opacity-90 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#385878] text-white rounded-lg hover:bg-opacity-90"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// Create a component to handle map events
const MapContainerEvents = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e);
    },
  });

  return null;
};

export default MapLocationModal;
