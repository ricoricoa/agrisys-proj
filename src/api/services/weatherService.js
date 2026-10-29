export async function getWeatherForLand(latitude, longitude) {
  if (!process.env.OPENWEATHER_API_KEY) return null;
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.search = new URLSearchParams({ lat: latitude, lon: longitude, appid: process.env.OPENWEATHER_API_KEY, units: "metric" });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Weather service request failed.");
  return response.json();
}
