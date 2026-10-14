export const NOISE_LIMITS = Object.freeze({
  normalMax: 55,
  warningMax: 70,
});

export class NoiseSensor {
  constructor(id, district, location, noiseLevel, measurements = []) {
    if (!Array.isArray(measurements)) {
      throw new TypeError("Історія вимірювань має бути масивом.");
    }

    if (!NoiseSensor.isValidNoiseLevel(noiseLevel)) {
      throw new RangeError("Рівень шуму має бути числом від 0 до 200.");
    }

    if (!measurements.every(NoiseSensor.isValidNoiseLevel)) {
      throw new RangeError("Усі вимірювання мають бути числами від 0 до 200.");
    }

    this.id = id;
    this.district = district;
    this.location = location;
    this.noiseLevel = noiseLevel;
    this.measurements = [...measurements];
  }

  getStatus() {
    if (this.noiseLevel <= NOISE_LIMITS.normalMax) {
      return "normal";
    }

    if (this.noiseLevel <= NOISE_LIMITS.warningMax) {
      return "warning";
    }

    return "critical";
  }

  updateNoiseLevel(value) {
    if (!NoiseSensor.isValidNoiseLevel(value)) {
      throw new RangeError("Рівень шуму має бути скінченним числом від 0 до 200.");
    }

    this.noiseLevel = value;
    return this.noiseLevel;
  }

  addMeasurement(value) {
    this.updateNoiseLevel(value);
    this.measurements.push(value);
    return this.measurements.length;
  }

  static isValidNoiseLevel(value) {
    return Number.isFinite(value) && value >= 0 && value <= 200;
  }

  static fromObject(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new TypeError("Дані датчика мають бути звичайним об'єктом.");
    }

    const { id, district, location, noiseLevel, measurements = [] } = data;
    return new NoiseSensor(id, district, location, noiseLevel, measurements);
  }
}
