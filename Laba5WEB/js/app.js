import { NoiseSensor } from "./models/NoiseSensor.js";
import { MonitoringSystem } from "./services/MonitoringSystem.js";

const sensorsData = [
  {
    id: "GAL-001",
    district: "Галицький",
    location: "пл. Ринок, 1",
    noiseLevel: 52,
    measurements: [48, 50, 52],
  },
  {
    id: "GAL-002",
    district: "Галицький",
    location: "просп. Свободи, 20",
    noiseLevel: 68,
    measurements: [61, 65, 68],
  },
  {
    id: "FRA-001",
    district: "Франківський",
    location: "вул. Наукова, 7",
    noiseLevel: 57,
    measurements: [53, 55, 57],
  },
  {
    id: "FRA-002",
    district: "Франківський",
    location: "вул. Володимира Великого, 10",
    noiseLevel: 73,
    measurements: [66, 70, 73],
  },
  {
    id: "SHE-001",
    district: "Шевченківський",
    location: "вул. Замарстинівська, 15",
    noiseLevel: 49,
    measurements: [46, 47, 49],
  },
  {
    id: "SHE-002",
    district: "Шевченківський",
    location: "вул. Мазепи, 12",
    noiseLevel: 82,
    measurements: [74, 79, 82],
  },
];

const statusLabels = {
  normal: "Норма",
  warning: "Попередження",
  critical: "Критичний рівень",
};

const monitoringSystem = new MonitoringSystem();
const sensors = sensorsData.map((data) => NoiseSensor.fromObject(data));

sensors.forEach((sensor) => monitoringSystem.addSensor(sensor));

function renderSensorCard(sensor) {
  const status = sensor.getStatus();
  const card = document.createElement("article");
  card.className = `sensor-card sensor-card--${status}`;

  const header = document.createElement("div");
  header.className = "sensor-card__header";

  const title = document.createElement("h3");
  title.className = "sensor-card__district";
  title.textContent = sensor.district;

  const badge = document.createElement("span");
  badge.className = `status-badge status-badge--${status}`;
  badge.textContent = statusLabels[status];
  header.append(title, badge);

  const location = document.createElement("p");
  location.className = "sensor-card__location";
  location.textContent = sensor.location;

  const level = document.createElement("p");
  level.className = "sensor-card__level";
  level.innerHTML = `${sensor.noiseLevel}<span> дБ</span>`;

  const details = document.createElement("p");
  details.className = "sensor-card__details";
  details.textContent = `ID: ${sensor.id} · Вимірювань: ${sensor.measurements.length}`;

  card.append(header, location, level, details);
  return card;
}

function renderApp() {
  const average = monitoringSystem.getAverageNoiseLevel();
  const averageElement = document.querySelector("#average-noise");
  const countElement = document.querySelector("#sensor-count");
  const criticalElement = document.querySelector("#critical-count");
  const cardsElement = document.querySelector("#sensor-cards");

  if (!averageElement || !countElement || !criticalElement || !cardsElement) {
    throw new Error("Не знайдено необхідні елементи інтерфейсу моніторингу.");
  }

  averageElement.textContent =
    average === null ? "—" : `${average.toFixed(1)} дБ`;
  countElement.textContent = String(monitoringSystem.sensors.length);
  criticalElement.textContent = String(
    monitoringSystem.getCriticalSensors().length,
  );

  cardsElement.replaceChildren(
    ...monitoringSystem.sensors.map((sensor) => renderSensorCard(sensor)),
  );
}

renderApp();

console.group("Акустична варта — перевірка модульної системи класів");
console.log("Усі датчики:", monitoringSystem.sensors);
console.log("Середній рівень шуму:", monitoringSystem.getAverageNoiseLevel());
console.log("Датчик GAL-001:", monitoringSystem.findSensorById("GAL-001"));
console.log(
  "Датчики Галицького району:",
  monitoringSystem.getSensorsByDistrict("Галицький"),
);
console.log("Критичні датчики:", monitoringSystem.getCriticalSensors());
console.log(
  "Перевірка значення 72:",
  NoiseSensor.isValidNoiseLevel(72),
);
console.groupEnd();
