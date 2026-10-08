import React, { useState } from "react";
import "./AboutUs.css";

const AboutUs = () => {
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
            <li onClick={() => setActiveTab("story")}>Our Story</li>
            <li onClick={() => setActiveTab("mission")}>Mission, Vision & Values</li>
            <li onClick={() => setActiveTab("board")}>Board of Directors</li>
            <li onClick={() => setActiveTab("ceo")}>CEO's Biography</li>
            <li onClick={() => setActiveTab("team")}>Team</li>
            <li onClick={() => setActiveTab("investor")}>Investor</li>
            <li onClick={() => setActiveTab("csr")}>CSR</li>
            <li onClick={() => setActiveTab("contact")}>Contact</li>
          </ul>
        </div>

        {/* Content (SIDE ME properly aligned) */}
        <div className="content">
          {activeTab === "story" && (
            <>
              <h2>Our Story</h2>
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

              <h2>Values</h2>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus vitae commodi voluptatibus facilis, facere nihil eum dolor eos quasi maiores id doloribus nulla tempore possimus rerum ex inventore fugiat nobis quos atque quis. Vel impedit vero maiores cumque sit minus, quisquam assumenda, error, quidem alias atque veritatis iusto eius quia natus ipsum culpa. Qui ullam, voluptate dolorum dolor perspiciatis officiis debitis facere tempora consectetur ipsa, velit possimus sapiente earum laudantium eveniet unde necessitatibus? Nam id repellat quasi velit aliquid eius voluptatibus in minus, ipsa corporis dignissimos voluptatem eveniet minima repellendus iusto consequuntur aut qui nostrum eaque placeat. Maiores repellat quas minus. Inventore nihil repellat quod! Voluptas, incidunt qui? Eum ipsam tenetur, cupiditate voluptate veniam reiciendis vel! Distinctio mollitia praesentium asperiores exercitationem est dignissimos, dolores non nulla vel vitae amet ut iste pariatur quaerat quia illo velit. Beatae, possimus. Similique eveniet fugiat in ipsum magnam quas exercitationem incidunt vero minus assumenda, rem sapiente id beatae doloribus! Molestiae pariatur laborum doloremque accusantium sequi impedit quis, quisquam, temporibus beatae animi recusandae exercitationem provident? Ea eius praesentium in. Impedit at consequatur quia quod praesentium enim reprehenderit, assumenda animi veniam commodi dolores qui nemo excepturi doloribus dolor fuga deleniti officiis! Quod perspiciatis voluptatem eligendi quas sed libero voluptas est eum fuga, incidunt dolore expedita esse modi, itaque autem aliquid a in id magni provident quis temporibus. Odio architecto vitae numquam. Dolorum aliquid asperiores corrupti ullam dignissimos non culpa magnam blanditiis voluptatibus soluta amet, exercitationem consequatur. Eius alias veniam earum quam fugit commodi consequuntur ut eveniet.</p>
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

export default AboutUs;