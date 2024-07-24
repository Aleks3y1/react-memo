export const getLeaderboard = async () => {
  const response = await fetch("https://wedev-api.sky.pro/api/leaderboard");
  if (!response.ok) {
    throw new Error("Ошибка получения список лидеров");
  }
  const result = await response.json();
  return result;
};

export const addLeader = async (name, time) => {
  const payload = JSON.stringify({ name, time });

  const response = await fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "POST",
    body: payload,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("Ошибка:", errorText);
    throw new Error("Ошибка добавление лидера");
  }

  const result = await response.json();
  return result;
};
