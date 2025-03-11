export const styles = {
  container: {
    width: "85%",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    fontWeight: "600",
    marginBottom: "25px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.3s",
  },
  cardTitle: {
    fontSize: "1.5rem",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  cardId: {
    fontSize: "1rem",
    color: "#777",
  },
  cardHover: {
    transform: "scale(1.05)",
  },
};