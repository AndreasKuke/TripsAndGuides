import Header from "./Header";

export default function Home() {
  return (
    <div style={{ 
      minHeight: "80vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "white",
      padding: "40px"
    }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "300", marginBottom: "20px", color: "#333" }}>
        Trips & Guides
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "50px" }}>
        Explore amazing trips and find experienced guides
      </p>
      
      <Header />
    </div>
  );
}
