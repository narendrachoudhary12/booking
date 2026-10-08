import React from "react";
import "./Breadcrumb.css";

const Breadcrumb = ({ items = [], recommendationLink }) => {
  return (
    <div className="sph-breadcrumb-container">
      <ol
        className="breadcrumb"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${item.hidden ? "hidden" : ""} ${
              item.active ? "active hotel-name-breadcrumb-sph" : ""
            }`}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <a itemProp="item" href={item.href || "#"}>
              <span itemProp="name">{item.label}</span>
            </a>
            <meta itemProp="position" content={index + 1} />
          </li>
        ))}

        {recommendationLink && (
          <li className="recommendation-link">
            <a href={recommendationLink.href || "#"}>
              {recommendationLink.label}
            </a>
          </li>
        )}
      </ol>
    </div>
  );
};

export default Breadcrumb;