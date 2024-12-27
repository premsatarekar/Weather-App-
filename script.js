const apiKey = "02790941235894ed48125102da582b00";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    try {
        if (!city.trim()) {
            alert("Please enter a city name.");
            return;
        }

        // Show loading indicator
        document.querySelector(".city").innerHTML = "Loading...";
        document.querySelector(".temp").innerHTML = "";
        document.querySelector(".humidity").innerHTML = "";
        document.querySelector(".wind").innerHTML = "";
        document.querySelector(".time").innerHTML = "";

        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error("City not found.");
        }

        const data = await response.json();
        console.log(data);

        // Update weather data
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = `${Math.round(data.main.temp)}°C`;
        document.querySelector(".humidity").innerHTML = `Humidity: ${data.main.humidity}%`;
        document.querySelector(".wind").innerHTML = `Wind: ${data.wind.speed} km/h`;

        // Calculate local time for the city
        const timezoneOffset = data.timezone * 1000; // Offset in milliseconds
        const localTime = new Date(new Date().getTime() + timezoneOffset);
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const day = dayNames[localTime.getUTCDay()];
        const date = localTime.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
        const time = localTime.toLocaleTimeString("en-GB", { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true // Display in 12-hour format with AM/PM
        });

        // Display local time, day, and date
        document.querySelector(".time").innerHTML = `${day}, ${date} ${time}`;

        // Update weather icon based on conditions
        const weatherCondition = data.weather[0].main;
        const weatherIcons = {
            "Clouds": "images/clouds.png",
            "Clear": "images/clear.png",
            "Rain": "images/rain.png",
            "Drizzle": "images/drizzle.png",
            "Mist": "images/mist.png",
            "Wind": "images/wind.png",
            "Snow": "images/snow.png"
        };
        weatherIcon.src = weatherIcons[weatherCondition] || "images/default.png";

        document.querySelector(".weather").style.display = "block";
    } catch (error) {
        console.error(error);
        document.querySelector(".city").innerHTML = "City not found.";
        document.querySelector(".temp").innerHTML = "";
        document.querySelector(".humidity").innerHTML = "";
        document.querySelector(".wind").innerHTML = "";
        document.querySelector(".time").innerHTML = "";
    }
}

// Add click event to search button
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Optional: Add 'Enter' key functionality
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});
