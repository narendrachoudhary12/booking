import React from "react";

const HeaderHero = () => {
  const heroStyle = {
    background: `linear-gradient(rgba(8,68,130,0.8), rgba(60, 146, 142, 0.8)), url('https://hotels.ng/img/hotelsng/static-header.jpg')`,
    backgroundPosition: "50%",
    backgroundSize: "cover",
    height: "300px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "40px",
    fontWeight: "700",
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={heroStyle}>
        <h1 style={titleStyle}>About Us</h1>
      </div>
    </div>
  );
};

export default HeaderHero;