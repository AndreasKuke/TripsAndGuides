import { Link } from "react-router";

export default function Header() {
    return (
        <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/trips" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "15px 40px",
            fontSize: "1rem",
            backgroundColor: "white",
            color: "#333",
            border: "2px solid #333",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.3s"
          }}>
            View Trips
          </button>
        </Link>
        <Link to="/guides" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "15px 40px",
            fontSize: "1rem",
            backgroundColor: "#333",
            color: "white",
            border: "2px solid #333",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.3s"
          }}>
            View Guides
          </button>
        </Link>
      </div>
    )
}
