import React, { useState } from "react";
import "./ExploreSection.css";

const ExploreSection = () => {
  const [activeTab, setActiveTab] = useState("beach");

  const data = {
    beach: [
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
        sub: "24 km from Gurgaon",
      },
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
        sub: "24 km from Gurgaon",
      },
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
        sub: "24 km from Gurgaon",
      },
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
        sub: "24 km from Gurgaon",
      },
    ],

    mountain: [
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
        sub: "24 km from Gurgaon",
      },
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
        sub: "24 km from Gurgaon",
      },
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
        sub: "24 km from Gurgaon",
      },
    ],

    city: [
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
      },
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
      },
      {
        img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
        title: "Nigeria.",
      },
    ],
  };

  return (
    <section className="explore-section">
      <h2>Explore destinations</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "beach" ? "tab active" : "tab"}
          onClick={() => setActiveTab("beach")}
        >
          Gastronomic Experiences
        </button>

        <button
          className={activeTab === "mountain" ? "tab active" : "tab"}
          onClick={() => setActiveTab("mountain")}
        >
          Historical Expeditions
        </button>

        <button
          className={activeTab === "city" ? "tab active" : "tab"}
          onClick={() => setActiveTab("city")}
        >
          Romantic Getaways
        </button>
      </div>

      {/* Cards */}
      <div className="image-tab active">
        {data[activeTab].map((item, index) => (
          <div className="card" key={index}>
            <img src={item.img} alt="" />
            <p>{item.title}</p>
            {item.sub && <p className="sub">{item.sub}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreSection;