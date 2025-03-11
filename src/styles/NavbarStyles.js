const styles = {
    navbar: {
      backgroundColor: "rgba(24, 53, 25, 0.9)", // Verde hierba con opacidad
      padding: "15px 0",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px",
    },
    navbarBrand: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#ffffff",
      textDecoration: "none",
      fontFamily: "'Arial', sans-serif",
    },
    navbarLinks: {
      display: "flex",
      gap: "15px",
    },
    navLink: {
      fontSize: "1.1rem",
      color: "#ffffff",
      textDecoration: "none",
      transition: "color 0.3s ease, background-color 0.3s ease",
      padding: "5px 10px",
      borderRadius: "5px",
    },
    navLinkHover: {
      color: "#d1c4b1", // Café claro
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Blanco con opacidad
    },
    // Media query para pantallas pequeñas
    "@media (max-width: 768px)": {
      navbarLinks: {
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
      },
    },
  };
  
  export { styles };