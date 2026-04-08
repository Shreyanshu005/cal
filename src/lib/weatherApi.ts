export interface WeatherForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  icon: string;
}

export interface WeatherData {
  today: WeatherForecastDay;
  forecast: WeatherForecastDay[];
  locationName: string;
}

const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2 || code === 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌧️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '☁️';
};

export const fetchWeather = async (): Promise<WeatherData | null> => {
  try {
    const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (!geoRes.ok) throw new Error('Failed to fetch location');
    const geoData = await geoRes.json();
    
    const lat = geoData.latitude;
    const lon = geoData.longitude;
    const locationName = geoData.city && geoData.region ? `${geoData.city}, ${geoData.region}` : geoData.city || 'Local Forecast';

    if (!lat || !lon) throw new Error('Location data incomplete');

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    if (!weatherRes.ok) throw new Error('Failed to fetch weather');
    
    const weatherData = await weatherRes.json();
    const daily = weatherData.daily;

    if (!daily || !daily.time) throw new Error('Weather data unavailable');

    const forecast: WeatherForecastDay[] = daily.time.map((date: string, index: number) => ({
      date,
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      weatherCode: daily.weathercode[index],
      icon: getWeatherIcon(daily.weathercode[index])
    }));

    return {
      today: forecast[0],
      forecast: forecast,
      locationName
    };

  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};
