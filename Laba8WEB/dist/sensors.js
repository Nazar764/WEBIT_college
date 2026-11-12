"use strict";
const API_URL = "https://6af59668f6270fa08d6844a5.mockapi.io/api/v1/sensors";
function renderSensors(sensors) {
    const container = document.querySelector("#sensors");
    const loadState = document.querySelector("#load-state");
    if (!container) {
        return;
    }
    container.replaceChildren();
    sensors.forEach((sensor) => {
        const card = document.createElement("article");
        card.classList.add("sensor-card", `sensor-card--${sensor.status}`);
        const header = document.createElement("header");
        header.className = "sensor-card__header";
        const title = document.createElement("h2");
        title.textContent = sensor.name;
        const status = document.createElement("span");
        status.classList.add("status-badge", `status-badge--${sensor.status}`);
        status.textContent = sensor.status;
        header.append(title, status);
        const district = document.createElement("p");
        district.className = "sensor-card__detail";
        district.textContent = `Район: ${sensor.district}`;
        const noise = document.createElement("p");
        noise.className = "sensor-card__detail sensor-card__noise";
        noise.textContent = `Рівень шуму: ${sensor.noiseLevel} дБ`;
        card.append(header, district, noise);
        container.append(card);
    });
    if (loadState) {
        loadState.textContent = `Завантажено сенсорів: ${sensors.length}`;
        loadState.className = "load-state";
    }
}
async function loadSensors() {
    try {
        const response = await fetch(API_URL, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const sensors = await response.json();
        renderSensors(sensors);
    }
    catch (error) {
        console.error("Не вдалося завантажити сенсори:", error);
        const loadState = document.querySelector("#load-state");
        if (loadState) {
            loadState.textContent = "Не вдалося завантажити дані. Перевірте API та підключення.";
            loadState.className = "load-state load-state--error";
        }
    }
}
loadSensors();
