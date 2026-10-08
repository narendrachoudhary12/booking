import React from "react";
import "./Press.css";

const Press = () => {
  return (
    <section className="press">
      <div className="press-container">
        
        <h2 className="press-title">We've been featured in</h2>
        <div className="press-divider"></div>

        <div className="press-logos">
          <a href="https://www.bbc.com" target="_blank" rel="noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/BBC_Logo_2021.svg" alt="BBC" />
          </a>

          <a href="https://www.forbes.com" target="_blank" rel="noreferrer">
            <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Forbes_logo.svg" alt="Forbes" />
          </a> 

          <a href="https://www.newsweek.com" target="_blank" rel="noreferrer">
            <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Newsweek_Logo.svg" alt="Newsweek" />
          </a>

          
        </div>

      </div>
    </section>
  );
};

export default Press;