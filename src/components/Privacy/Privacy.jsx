import React, { useState } from "react";
import "./Privacy.css";

const Privacy = () => {
  const [activeTab, setActiveTab] = useState("story");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="about-wrapper">
      
      {/* Mobile Toggle */}
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className="about-layout">
        
        {/* Sidebar */}
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => setActiveTab("story")}>Privacy Policy</li>
            <li onClick={() => setActiveTab("mission")}>What this Privacy Policy Covers</li>
            <li onClick={() => setActiveTab("mission")}>Changes to this Privacy Policy</li>
            <li onClick={() => setActiveTab("mission")}>Collection and Use of Personal Information</li>
            <li onClick={() => setActiveTab("mission")}>Changes to this Privacy Policy</li>
            <li onClick={() => setActiveTab("mission")}>Collection and Use of Personal Information</li>
          </ul>
        </div>

        {/* Content (SIDE ME properly aligned) */}
        <div className="content">
          {activeTab === "story" && (
            <>
              <h2>Privacy Policy</h2>
              <p>Founded in 2013 by Mark Essien, Hotels.ng is an online travel agency specialising in hotel bookings within Nigeria. Hotels.ng has since grown from a small Nigerian startup to one of Africa’s largest hotel booking platforms.</p> 
               <p>Founded in 2013 by Mark Essien, Hotels.ng is an online travel agency specialising in hotel bookings within Nigeria. Hotels.ng has since grown from a small Nigerian startup to one of Africa’s largest hotel booking platforms.</p>
               <p>Founded in 2013 by Mark Essien, Hotels.ng is an online travel agency specialising in hotel bookings within Nigeria. Hotels.ng has since grown from a small Nigerian startup to one of Africa’s largest hotel booking platforms.</p>
            </>
          )}

          {activeTab === "mission" && (
            <>
              <h2>Mission</h2>
              <p>Founded in 2013 by Mark Essien, Hotels.ng is an online travel agency specialising in hotel bookings within Nigeria. Hotels.ng has since grown from a small Nigerian startup to one of Africa’s largest hotel booking platforms.</p> 
               <p>Founded in 2013 by Mark Essien, Hotels.ng is an online travel agency specialising in hotel bookings within Nigeria. Hotels.ng has since grown from a small Nigerian startup to one of Africa’s largest hotel booking platforms.</p>
               <p>Founded in 2013 by Mark Essien, Hotels.ng is an online travel agency specialising in hotel bookings within Nigeria. Hotels.ng has since grown from a small Nigerian startup to one of Africa’s largest hotel booking platforms.</p>

              <h2>Vision</h2>
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium, cumque, inventore quidem asperiores possimus dolores iusto consequatur maiores ex libero nisi vero ullam itaque sunt modi praesentium, molestiae distinctio corrupti.</p>

              </>
          )}

          {activeTab === "board" && <h2>Board of Directors</h2>}
          {activeTab === "ceo" && <h2>CEO Biography</h2>}
          {activeTab === "team" && <h2>Team</h2>}
          {activeTab === "investor" && <h2>Investors</h2>}
          {activeTab === "csr" && <h2>CSR</h2>}
          {activeTab === "contact" && <h2>Contact</h2>}
        </div>

      </div>
    </div>
  );
};

export default Privacy;