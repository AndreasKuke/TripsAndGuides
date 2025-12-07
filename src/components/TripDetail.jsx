import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import facade from "../apiFacade";

export default function TripDetail() {
  const { id } = useParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      return `${diffDays} days${diffHours > 0 ? ` and ${diffHours} hours` : ""}`;
    } else if (diffHours > 0) {
      return `${diffHours} hours`;
    } else {
      const diffMinutes = Math.floor(diffMillis / (1000 * 60));
      return `${diffMinutes} minutes`;
    }
  };

  // Fetch trip details
  useEffect(() => {
    const headers = {
      "Content-type": "application/json",
      "Accept": "application/json"
    };
    
    // Add Authorization header if user is logged in
    if (facade.loggedIn()) {
      headers["Authorization"] = `Bearer ${facade.getToken()}`;
    }
    
    fetch(`https://tripapi.cphbusinessapps.dk/api/trips/${id}`, { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTripDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Trip details error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Fetch packing list items based on trip category
  useEffect(() => {
    if (!tripDetails || !tripDetails.category) return;

    fetch(
      `https://packingapi.cphbusinessapps.dk/packinglist/${tripDetails.category.toLowerCase()}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.items) {
          setItems(data.items);
        } else if (Array.isArray(data)) {
          setItems(data);
        } else if (data.packingList) {
          setItems(data.packingList);
        } else {
          setItems([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching items data:", error);
        setItems([]);
      });
  }, [tripDetails]);

  if (loading) return <div>Loading trip details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tripDetails) return <div>Trip not found</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/trips">← Back to Trips</Link>
      
      <div className="details-card" style={{ marginTop: "20px" }}>
        <h2>{tripDetails.name}</h2>
        <p>
          <strong>Price:</strong>{" "}
          {tripDetails.price ? `${tripDetails.price} DKK` : "Price not available"}
        </p>
        {tripDetails.description && (
          <p>
            <strong>Description:</strong> {tripDetails.description}
          </p>
        )}
        <p>
          <strong>Start Date:</strong> {tripDetails.starttime}
        </p>
        <p>
          <strong>End Date:</strong> {tripDetails.endtime}
        </p>
        <p>
          <strong>Category:</strong> {tripDetails.category}
        </p>

        {calculateDuration(tripDetails.starttime, tripDetails.endtime) && (
          <p>
            <strong>Duration:</strong>{" "}
            {calculateDuration(tripDetails.starttime, tripDetails.endtime)}
          </p>
        )}

        <hr />
        
        {tripDetails.guide && (
          <>
            <h3>Guide Information:</h3>
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
              <strong>Years of Experience:</strong>{" "}
              {tripDetails.guide.yearsOfExperience}
            </p>
            <hr />
          </>
        )}

        {items.length > 0 ? (
          <>
            <h3>Packing List:</h3>
            <ul>
              {items.map((item) => (
                <li key={item.id || item.name}>
                  <div>
                    <strong>{item.name}</strong>{" "}
                    {item.quantity ? `- Quantity: ${item.quantity}` : ""}
                    {item.description && (
                      <p>
                        <em>{item.description}</em>
                      </p>
                    )}
                    {item.buyingOptions && item.buyingOptions.length > 0 && (
                      <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                        <strong>Where to buy:</strong>
                        <ul>
                          {item.buyingOptions.map((option, index) => (
                            <li key={index}>
                              {option.shopName} - {option.price} DKK
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
    </div>
  );
}
