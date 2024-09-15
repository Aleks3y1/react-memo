import React, { useState } from "react";
import styles from "./AchiveDescription.module.css";

const AchiveDescription = ({ children, description, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div style={style} className={styles.itemContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {isHovered && <div className={styles.overlay}></div>}
      <div className={styles.content}>
        {children}
        <div
          className={styles.description}
          style={{ visibility: isHovered ? "visible" : "hidden", opacity: isHovered ? 1 : 0 }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

export default AchiveDescription;
