const noiseLevels = [
  42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76, 53, 47,
  88, 69, 74, 82, 95, 51, 71, -1, 85, 63, 79, 39, 141, 86,
];

const warningLevel = 70;
const criticalLevel = 85;
const minValidLevel = 30;
const maxValidLevel = 130;

// Arrow Function: визначає, чи входить вимірювання до допустимого діапазону.
const isValidLevel = (level) =>
  Number.isFinite(level) &&
  level >= minValidLevel &&
  level <= maxValidLevel;

// Function Expression: пропускає некоректні значення та обчислює статистику.
const analyzeNoiseData = function (levels) {
  let validCount = 0;
  let normalCount = 0;
  let warningCount = 0;
  let criticalCount = 0;
  let sum = 0;
  let min = null;
  let max = null;

  for (const level of levels) {
    if (!isValidLevel(level)) {
      continue;
    }

    validCount += 1;
    sum += level;

    // Ручний пошук мінімуму та максимуму згідно з методичкою
    if (min === null || level < min) {
      min = level;
    }
    if (max === null || level > max) {
      max = level;
    }

    if (level >= criticalLevel) {
      criticalCount += 1;
    } else if (level >= warningLevel) {
      warningCount += 1;
    } else {
      normalCount += 1;
    }
  }

  return {
    validCount,
    normalCount,
    warningCount,
    criticalCount,
    average: validCount > 0 ? sum / validCount : null,
    min,
    max,
  };
};

// Function Declaration: повертає перше критичне вимірювання або null.
function findFirstCritical(levels) {
  for (let index = 0; index < levels.length; index += 1) {
    if (isValidLevel(levels[index]) && levels[index] >= criticalLevel) {
      return { index, level: levels[index] };
    }
  }

  return null;
}

// Шукає три поспіль валідні безпечні значення після першого критичного.
function findRecovery(levels, firstCriticalIndex) {
  let index = firstCriticalIndex + 1;
  let consecutiveSafeCount = 0;
  let recoveryStartIndex = -1;

  while (index < levels.length && consecutiveSafeCount < 3) {
    const level = levels[index];

    if (isValidLevel(level) && level <= warningLevel) {
      if (consecutiveSafeCount === 0) {
        recoveryStartIndex = index;
      }
      consecutiveSafeCount += 1;

      if (consecutiveSafeCount === 3) {
        return {
          index: recoveryStartIndex,
          confirmedAtIndex: index,
        };
      }
    } else {
      consecutiveSafeCount = 0;
      recoveryStartIndex = -1;
    }

    index += 1;
  }

  return null;
}

// do...while: перевіряє всі значення та виводить позиції некоректних вимірювань.
function reportInvalidLevels(levels) {
  if (!Array.isArray(levels)) {
    console.error("Вхідні дані мають бути масивом вимірювань.");
    return;
  }

  let index = 0;
  do {
    if (index < levels.length && !isValidLevel(levels[index])) {
      console.error(
        `Некоректне вимірювання на позиції ${index + 1} (індекс ${index}):`,
        levels[index],
      );
    }
    index += 1;
  } while (index < levels.length);
}

function reportThresholdWarnings(levels) {
  for (let index = 0; index < levels.length; index += 1) {
    const level = levels[index];

    if (!isValidLevel(level) || level < warningLevel) {
      continue;
    }

    if (level >= criticalLevel) {
      console.warn(
        `Критичний рівень шуму на позиції ${index + 1}: ${level} дБ (поріг ${criticalLevel} дБ).`,
      );
    } else {
      console.warn(
        `Перевищено рівень попередження на позиції ${index + 1}: ${level} дБ (поріг ${warningLevel} дБ).`,
      );
    }
  }
}

console.group("Акустична варта — звіт моніторингу");

reportInvalidLevels(noiseLevels);

const analysis = analyzeNoiseData(noiseLevels);

console.table([
  { Категорія: "Безпечний рівень", Кількість: analysis.normalCount },
  { Категорія: "Попередження", Кількість: analysis.warningCount },
  { Категорія: "Критичний рівень", Кількість: analysis.criticalCount },
  { Категорія: "Усього коректних", Кількість: analysis.validCount },
]);

console.log("Середній рівень:", analysis.average, "дБ");
console.log("Мінімальний рівень:", analysis.min, "дБ");
console.log("Максимальний рівень:", analysis.max, "дБ");

reportThresholdWarnings(noiseLevels);

const firstCritical = findFirstCritical(noiseLevels);
if (firstCritical) {
  console.log(
    `Перше критичне вимірювання: позиція ${firstCritical.index + 1}, ${firstCritical.level} дБ.`,
  );

  const recovery = findRecovery(noiseLevels, firstCritical.index);
  if (recovery) {
    console.log(
      `Відновлення почалося на позиції ${recovery.index + 1}; три безпечні вимірювання поспіль підтверджено на позиції ${recovery.confirmedAtIndex + 1}.`,
    );
  } else {
    console.log("Після першого критичного вимірювання відновлення не підтверджено.");
  }
} else {
  console.log("Критичних вимірювань не виявлено.");
}

console.groupEnd();
