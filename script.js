const API_KEY = "88cd80ff127810bd1ff4f7ff9543b4e4"
const searchBtn = document.getElementById("search-btn")
const CURRENT_API_URL = "https://api.openweathermap.org/data/2.5/weather?q"
const SEVENDAYS_API_URL = "https://api.openweathermap.org/data/2.5/forecast?q"

let currentCityData = {
    temp: "",
    humidity: "",
    wind: "",
    lat: "",
    lon:"",
}

searchBtn.addEventListener('click', async () => {
    const searchedCity = document.getElementById("search-input").value
    try {
        const response = await fetch(`${CURRENT_API_URL}=${searchedCity}&appid=${API_KEY}`)
        const data = await response.json();
        console.log(data)
        const currentTemprature = Number(data.main.temp -273.15);
        currentCityData = {
            temp: currentTemprature.toFixed(2),
            lat: data.coord.lat,
            log: data.coord.lon
        }

        console.log(currentCityData)
    } catch (error) {
        console.log(error)
    }

    try {
        const response = await fetch(`${SEVENDAYS_API_URL}=${searchedCity}&appid=${API_KEY}`)
        const data = await response.json();
        console.log(data)
    } catch (error) {
        console.log(error)
    }

})
