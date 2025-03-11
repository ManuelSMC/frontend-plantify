const styles = {
  homeContainer: {
    position: "relative",
    backgroundImage: "url('../images/XD.jpg')",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    zIndex: 1,
  },
  homeTitle: {
    position: "relative",
    zIndex: 2,
    fontFamily: "'Roboto', sans-serif",
    fontSize: "4rem",
    color: "#ffffff",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },
  inputContainer: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
   
    padding: "1rem",
    borderRadius: "10px",
    backdropFilter: "blur(10px)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    width: "300px",
  },
  label: {
   
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    color: "#ffffff",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "5px",
    border: "none",
    fontSize: "1rem",
    color: "#ffffff",
    
  },
  passwordWrapper: {
    display: "flex",
    alignItems: "center",
   
  },

  submitButton: {
    padding: "0.8rem 1.5rem",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "2px solid #ffffff",
    borderRadius: "20px",
    cursor: "pointer",
    zIndex: 2,
    fontSize: "1rem",
    fontWeight: "bold",
  },
  recoverButton: {
    backgroundColor: "transparent",
    color: "#28a745",
    border: "none",
    cursor: "pointer",
    zIndex: 2,
    fontSize: "1rem",
    textDecoration: "underline",
  },
};

export { styles };
