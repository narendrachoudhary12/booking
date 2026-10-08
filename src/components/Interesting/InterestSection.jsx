import React from "react";
import "./InterestSection.css";

const InterestSection = () => {

  const properties = [
    {
      title: "Hotels",
      count: "21 available",
      img: "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550862.jpeg?k=3514aa4abb76a6d19df104cb307b78b841ac0676967f24f4b860d289d55d3964&o=",
    },
  ];

  return (
    <section className="interest-property-section">
      <h2>Interesting Section</h2>

      <div className="interest-property-wrapper">
        {properties.map((item, index) => (
          <div className="interest-property-card" key={index}>
            <img src={item.img} alt={item.title} />
            <h4>{item.title}</h4>
            <p>{item.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InterestSection;