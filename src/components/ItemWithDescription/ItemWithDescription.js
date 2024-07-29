import React, { useState } from "react";
import styles from "./ItemWithDescription.module.css";

const ItemWithDescription = ({ children, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className={styles.itemContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {isHovered && <div className={styles.overlay}></div>}
      <div className={styles.content}>
        {children}
        {isHovered && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  );
};

export default ItemWithDescription;
