export const LevelStyle = (currentLevel, level) => {
  const isLevelSelected = currentLevel === level;

  return {
    backgroundColor: isLevelSelected ? "#0080c1" : "#fff",
    color: isLevelSelected ? "#fff" : "#0080c1",
  };
};
