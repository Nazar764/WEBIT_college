const API_URL = "https://6af59668f6270fa08d6844a5.mockapi.io/api/v1/sensors";

const sensorsList = document.querySelector("#sensors-list");
const loadState = document.querySelector("#load-state");

function createSensorCard(sensor) {
  const card = document.createElement("article");
  card.classList.add("sensor-card");
  if (sensor.status === "inactive") {
    card.classList.add("sensor-card--inactive");
  }

  const header = document.createElement("header");
  header.className = "sensor-card__header";

  const title = document.createElement("h2");
  title.textContent = sensor.name;

  const badge = document.createElement("span");
  badge.className = "status-badge";
  if (sensor.status === "inactive") {
    badge.classList.add("status-badge--inactive");
  }
  badge.textContent = sensor.status;
  header.append(title, badge);

  const district = document.createElement("p");
  district.className = "sensor-card__district";
  district.textContent = `Район: ${sensor.district}`;

  const noise = document.createElement("p");
  noise.className = "sensor-card__noise";
  noise.append(document.createTextNode("Рівень шуму: "));

  const noiseValue = document.createElement("strong");
  noiseValue.textContent = `${sensor.noiseLevel} дБ`;
  noise.append(noiseValue);

  card.append(header, district, noise);
  return card;
}

function renderSensors(sensors) {
  sensorsList.replaceChildren();

  if (sensors.length === 0) {
    loadState.textContent = "Сенсорів поки немає.";
    loadState.className = "load-state load-state--empty";
    return;
  }

  sensors.forEach((sensor) => {
    sensorsList.append(createSensorCard(sensor));
  });
  loadState.textContent = `Завантажено сенсорів: ${sensors.length}`;
  loadState.className = "load-state";
}

async function loadSensors() {
  if (!API_URL) {
    loadState.textContent = "Вкажіть endpoint MockAPI у константі API_URL у файлі app.js.";
    loadState.className = "load-state load-state--error";
    return;
  }

  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const sensors = await response.json();
    if (!Array.isArray(sensors)) {
      throw new TypeError("API має повернути масив сенсорів.");
    }

    renderSensors(sensors);
  } catch (error) {
    console.error("Не вдалося завантажити сенсори:", error);
    sensorsList.replaceChildren();
    loadState.textContent = "Не вдалося завантажити дані. Перевірте URL API та підключення.";
    loadState.className = "load-state load-state--error";
  }
}

loadSensors();