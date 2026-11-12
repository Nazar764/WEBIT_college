const sensors = [
  {
    id: "NS-01",
    district: "Галицький район",
    address: "просп. Свободи, 14",
    noise: 52,
    status: "normal",
  },
  {
    id: "NS-02",
    district: "Франківський район",
    address: "вул. Наукова, 8",
    noise: 68,
    status: "warning",
  },
  {
    id: "NS-03",
    district: "Шевченківський район",
    address: "просп. Чорновола, 21",
    noise: 83,
    status: "critical",
  },
  {
    id: "NS-04",
    district: "Сихівський район",
    address: "вул. Зелена, 102",
    noise: 49,
    status: "normal",
  },
  {
    id: "NS-05",
    district: "Личаківський район",
    address: "вул. Пасічна, 30",
    noise: 71,
    status: "warning",
  },
  {
    id: "NS-06",
    district: "Залізничний район",
    address: "вул. Городоцька, 155",
    noise: 86,
    status: "critical",
  },
];

const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");
const sensorList = document.querySelector("#sensor-list");

function createIcon(path) {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("class", "sensor-card__icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.8");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.setAttribute("aria-hidden", "true");

  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  shape.setAttribute("d", path);
  icon.append(shape);
  return icon;
}

function createDetail(iconPath, text) {
  const detail = document.createElement("p");
  detail.className = "sensor-card__detail";
  detail.append(createIcon(iconPath), document.createTextNode(text));
  return detail;
}

function createSensorCard(sensor) {
  const status = sensor.status;
  const statusLabels = {
    normal: "normal",
    warning: "warning",
    critical: "critical",
  };

  const card = document.createElement("article");
  card.className = `sensor-card sensor-card--${status}`;

  const header = document.createElement("header");
  header.className = "sensor-card__header";

  const title = document.createElement("h2");
  title.textContent = sensor.id;

  const badge = document.createElement("span");
  badge.className = `status-badge status-badge--${status}`;
  badge.textContent = statusLabels[status];
  header.append(title, badge);

  const noise = document.createElement("p");
  noise.className = "sensor-card__noise";
  noise.append(createIcon("M12 3v18 M7 7v10 M17 7v10 M3 10v4 M21 10v4"));
  noise.append(document.createTextNode("Рівень шуму:"));

  const noiseValue = document.createElement("strong");
  noiseValue.className = "sensor-card__noise-value";
  noiseValue.textContent = `${sensor.noise} дБ`;
  noise.append(noiseValue);

  card.append(
    header,
    createDetail("M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", sensor.district),
    createDetail("M4 21h16 M6 21V5l6-2v18 M14 21V9l4-2v14 M9 7v.01 M9 11v.01 M9 15v.01 M16 11v.01 M16 15v.01", sensor.address),
    noise,
  );

  return card;
}

function renderSensors(sensorArray) {
  sensorList.replaceChildren(...sensorArray.map(createSensorCard));
}

function applyFilters() {
  const selectedDistrict = districtFilter.value;
  const criticalOnly = criticalFilter.checked;
  const filteredSensors = sensors.filter((sensor) => {
    const matchesDistrict =
      selectedDistrict === "all" || sensor.district === selectedDistrict;
    const matchesStatus = !criticalOnly || sensor.status === "critical";
    return matchesDistrict && matchesStatus;
  });
  renderSensors(filteredSensors);
}

const districts = [...new Set(sensors.map((sensor) => sensor.district))];
districtFilter.append(
  ...districts.map((district) => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    return option;
  }),
);

districtFilter.addEventListener("change", applyFilters);
criticalFilter.addEventListener("change", applyFilters);

renderSensors(sensors);