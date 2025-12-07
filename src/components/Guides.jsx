import { useEffect, useState } from "react";
import facade from "../apiFacade";

export default function Guides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch guides data
  useEffect(() => {
    const headers = {
      "Content-type": "application/json",
      "Accept": "application/json"
    };
    
    // Add Authorization header if user is logged in
    if (facade.loggedIn()) {
      headers["Authorization"] = `Bearer ${facade.getToken()}`;
    }
    
    fetch("https://tripapi.cphbusinessapps.dk/api/guides", { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setGuides(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching guides data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading guides...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Our Guides</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {guides.map((guide) => (
          <div 
            key={guide.id} 
            className="guide-card" 
            style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}
          >
            <h3>{guide.firstname} {guide.lastname}</h3>
            <p>
              <strong>Email:</strong> {guide.email}
            </p>
            <p>
              <strong>Phone:</strong> {guide.phone}
            </p>
            <p>
              <strong>Years of Experience:</strong> {guide.yearsOfExperience}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
