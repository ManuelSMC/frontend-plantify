const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "10px",
      width: "400px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "1rem",
    },
    button: {
      padding: "10px",
      marginTop: "15px",
      backgroundColor: "#4caf50",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      width: "100%",
      fontSize: "1rem",
    },
    closeButton: {
      backgroundColor: "#f44336",
      marginTop: "10px",
    },
  };
  
  export default modalStyles;
  