import React, { useState } from "react";
import "./AboutModal.css";

function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAboutButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="about-modal">
      <button onClick={handleAboutButtonClick}>About</button>
      {isOpen && (
        <div className="modal-content">
          {/* Your about text here */}
          <p>Click outside this box to close it.</p>
        </div>
      )}
    </div>
  );
}

export default AboutModal;
