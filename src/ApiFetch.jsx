import { useEffect, useState } from "react";

export default function ApiFetch() {
  const [listOfTrips, setListOfTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);

  const [items, setItems] = useState([]);

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return null;

    const start = new Date(startTime);
    const end = new Date(endTime);

    const diffMillis = end - start;
    const diffDays = Math.floor(diffMillis / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) {
      return `${diffDays} days${
        diffHours > 0 ? ` and ${diffHours} hours` : ""
      }`;
    } else if (diffHours > 0) {
      return `${diffHours} hours`;
    } else {
      const diffMinutes = Math.floor(diffMillis / (1000 * 60));
      return `${diffMinutes} minutes`;
    }
  };

  // Fetch trips data
  useEffect(() => {
    fetch(`https://tripapi.cphbusinessapps.dk/api/trips`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setListOfTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trips data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Fetch categories data
  useEffect(() => {
    fetch(`https://packingapi.cphbusinessapps.dk/packinglist/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data.categories || []);
        setCategoriesLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories data:", error);
        setCategoriesError(error.message);
        setCategoriesLoading(false);
      });
  }, []);

  // Fetch trip details when a trip is selected
  useEffect(() => {
    if (!selectedTrip) return;

    fetch(`https://tripapi.cphbusinessapps.dk/api/trips/${selectedTrip.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setTripDetails(data))
      .catch((err) => console.error("Trip details error:", err));
  }, [selectedTrip]);

  // Fetch items based on selected trip's category
  useEffect(() => {
    if (!selectedTrip || !selectedTrip.category) {
      return;
    }

    console.log("Fetching items for category:", selectedTrip.category);

    fetch(
      `https://packingapi.cphbusinessapps.dk/packinglist/${selectedTrip.category.toLowerCase()}`
    )
      .then((response) => {
        console.log("Items API response status:", response.status);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Items API response data:", data);
        // Try different possible data structures
        if (data.items) {
          setItems(data.items);
        } else if (Array.isArray(data)) {
          setItems(data);
        } else if (data.packingList) {
          setItems(data.packingList);
        } else {
          console.log("Unexpected data structure:", data);
          setItems([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching items data:", error);
        setItems([]);
      });
  }, [selectedTrip]);

  // Derived state for items - reset when no trip is selected or no category
  const currentItems = selectedTrip && selectedTrip.category ? items : [];

  if (loading) return <div>Loading trips...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter trips based on selected category
  const filteredTrips =
    selectedCategory === "all"
      ? listOfTrips
      : listOfTrips.filter(
          (trip) =>
            trip.category.toUpperCase() === selectedCategory.toUpperCase()
        );

  return (
    <div>
      {/* Category Selector */}
      {!categoriesLoading && !categoriesError && (
        <div className="filter-box">
          <label>
            <strong>Filter by Category:</strong>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Layout with Two Panels */}
      <div className="main-layout">
        {/* Left Panel - Trip Cards */}
        <div className="left-panel">
          <h2>Trips available: </h2>
          <div className="trips-grid">
            {filteredTrips.map((trip) => (
              <div
                className="trip-card"
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
              >
                <h3>{trip.name || "No destination"}</h3>
                <p>
                  <strong>Price:</strong>{" "}
                  {trip.price ? `${trip.price} DKK` : "Price not available"}
                </p>
                {trip.description && (
                  <p>
                    <strong>Description:</strong> {trip.description}
                  </p>
                )}
                {trip.starttime && (
                  <p>
                    <strong>Start Date:</strong> {trip.starttime}
                  </p>
                )}
                {trip.endtime && (
                  <p>
                    <strong>End Date:</strong> {trip.endtime}
                  </p>
                )}

                {calculateDuration(trip.starttime, trip.endtime) && (
                  <p>
                    <strong>Duration:</strong>{" "}
                    {calculateDuration(trip.starttime, trip.endtime)}
                  </p>
                )}
                {trip.startDate && (
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(trip.startDate).toLocaleDateString()}
                  </p>
                )}
                {trip.endDate && (
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                )}

                {trip.category && (
                  <p>
                    <strong>Category:</strong> {trip.category}
                  </p>
                )}
                {trip.guide && (
                  <p>
                    <strong>Guide:</strong> {trip.guide.firstname}{" "}
                    {trip.guide.lastname}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Trip Details */}
        <div className="right-panel">
          {tripDetails ? (
            <div className="details-card">
              <h2>Trip Details for: {tripDetails.name}</h2>
              <p>
                <strong>Price:</strong>{" "}
                {tripDetails.price
                  ? `${tripDetails.price} DKK`
                  : "Price not available"}
              </p>
              <p>
                <strong>Start Date:</strong> {tripDetails.starttime}
              </p>
              <p>
                <strong>End Date:</strong> {tripDetails.endtime}
              </p>
              <p>
                <strong>Category:</strong> {tripDetails.category}
              </p>

              {calculateDuration(
                tripDetails.starttime,
                tripDetails.endtime
              ) && (
                <p>
                  <strong>Duration:</strong>{" "}
                  {calculateDuration(
                    tripDetails.starttime,
                    tripDetails.endtime
                  )}
                </p>
              )}
              {tripDetails.category && (
                <p>
                  <strong>Category:</strong> {tripDetails.category}
                </p>
              )}
              <hr></hr>
              {tripDetails.guide && (
                <>
                  <h3>Guide information:</h3>
                  <p>
                    <strong>Name:</strong> {tripDetails.guide.firstname}{" "}
                    {tripDetails.guide.lastname}
                  </p>
                  <p>
                    <strong>Email:</strong> {tripDetails.guide.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {tripDetails.guide.phone}
                  </p>
                  <p>
                    <strong>Years of experience:</strong>
                    {tripDetails.guide.yearsOfExperience}
                  </p>
                </>
              )}
              <hr></hr>
              {currentItems.length > 0 ? (
                <>
                  <h3>Packing List:</h3>
                  <ul>
                    {currentItems.map((item) => (
                      <li key={item.id || item.name}>
                        <div>
                          <strong>{item.name}</strong>{" "}
                          {item.quantity ? `- Quantity: ${item.quantity}` : ""}
                          {item.description && (
                            <p>
                              <em>{item.description}</em>
                            </p>
                          )}
                          {item.buyingOptions &&
                            item.buyingOptions.length > 0 && (
                              <div
                                style={{ marginLeft: "20px", marginTop: "5px" }}
                              >
                                <strong>Where to buy:</strong>
                                <ul>
                                  {item.buyingOptions.map((option, index) => (
                                    <li key={index}>
                                      {option.shopName}
                                      {option.price} DKK
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No packing list items available for this trip.</p>
              )}
            </div>
          ) : (
            <div className="details-empty">Select a trip to see details</div>
          )}
          {detailsLoading && <div>Loading trip details...</div>}
          {detailsError && <div>Error: {detailsError}</div>}
        </div>
      </div>
    </div>
  );
}
