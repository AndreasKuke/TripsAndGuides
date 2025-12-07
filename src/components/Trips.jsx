import { useEffect, useState } from "react";
import { Link } from "react-router";
import facade from "../apiFacade";

export default function Trips() {
  const [listOfTrips, setListOfTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
      return `${diffDays} days${diffHours > 0 ? ` and ${diffHours} hours` : ""}`;
    } else if (diffHours > 0) {
      return `${diffHours} hours`;
    } else {
      const diffMinutes = Math.floor(diffMillis / (1000 * 60));
      return `${diffMinutes} minutes`;
    }
  };

  // Fetch trips data
  useEffect(() => {
    const headers = {
      "Content-type": "application/json",
      "Accept": "application/json"
    };
    
    // Add Authorization header if user is logged in
    if (facade.loggedIn()) {
      headers["Authorization"] = `Bearer ${facade.getToken()}`;
    }
    
    fetch("https://tripapi.cphbusinessapps.dk/api/trips", { headers })
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
    fetch("https://packingapi.cphbusinessapps.dk/packinglist/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((error) => {
        console.error("Error fetching categories data:", error);
      });
  }, []);

  if (loading) return <div>Loading trips...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter trips based on selected category
  const filteredTrips =
    selectedCategory === "all"
      ? listOfTrips
      : listOfTrips.filter(
          (trip) => trip.category.toUpperCase() === selectedCategory.toUpperCase()
        );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Trips</h2>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="filter-box" style={{ marginBottom: "20px" }}>
          <label>
            <strong>Filter by Category:</strong>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
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

      {/* Trips Grid */}
      <div className="trips-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {filteredTrips.map((trip) => (
          <Link 
            to={`/trips/${trip.id}`} 
            key={trip.id} 
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="trip-card" style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", cursor: "pointer" }}>
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
          </Link>
        ))}
      </div>
    </div>
  );
}
