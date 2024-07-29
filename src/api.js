export const getLeaderboard = async () => {
  const response = await fetch("https://wedev-api.sky.pro/api/v2/leaderboard");
  if (!response.ok) {
    throw new Error("Ошибка получения список лидеров");
  }
  const result = await response.json();
  return result;
};

export async function addLeader(name, time, achievements) {
  const response = await fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "POST",
    body: JSON.stringify({
      name,
      time,
      achievements,
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка при добавлении лидера");
  }

  return await response.json();
}
