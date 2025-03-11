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
      textAlign: "left",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#ffffff",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
    row: {
      borderBottom: "1px solid #e0e0e0",
      transition: "background 0.3s",
    },
    rowHover: {
      backgroundColor: "#f1f1f1",
    },
    switchContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    switch: {
      position: "relative",
      width: "50px",
      height: "28px",
    },
    input: {
      opacity: 0,
      width: 0,
      height: 0,
    },
    slider: {
      position: "absolute",
      cursor: "pointer",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "#d1d1d1",
      borderRadius: "30px",
      transition: "0.4s",
    },
    sliderBefore: {
      content: "''",
      position: "absolute",
      height: "22px",
      width: "22px",
      left: "3px",
      bottom: "3px",
      backgroundColor: "#ffffff",
      borderRadius: "50%",
      transition: "0.4s",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    },
    inputChecked: {
      backgroundColor: "#4cd964", // Verde tipo iPhone
    },
    sliderCheckedBefore: {
      transform: "translateX(22px)",
    },
    editButton: {
        backgroundColor: "#FBC02D",
        color: "white",
        padding: "8px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "0.3s",
        fontSize: "14px",
      },
      editButtonHover: {
        backgroundColor: "#66BB69",
      },
      addButton: {
        backgroundColor: "#2194f3",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "0.3s",
        fontSize: "1rem",
        position: "absolute",
        top: "70px",
        right: "75px",
   
      },
      addButtonHover: {
        backgroundColor: "#45a049",
      },
  };
  