interface RestrictionDurationAndReason {
  durationSeconds: number;
  until_date: number;
  humanReadable: string;
  reason: string | null;
}

export function getRestrictionDurationAndReason(
  input: string,
): RestrictionDurationAndReason {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return {
      durationSeconds: 0,
      until_date: 0,
      humanReadable: "навсегда",
      reason: null,
    };
  }

  const words = trimmedInput.split(/\s+/);
  let numStr: string | undefined = "";
  let unitStr: string | undefined = undefined;
  let durationWordCount = 0;

  const firstWord = words[0];
  const digitLetterMatch = firstWord?.match(/^(\d+)([a-zA-Zа-яА-Я]+)$/);
  if (digitLetterMatch) {
    numStr = digitLetterMatch[1];
    unitStr = digitLetterMatch[2];
    durationWordCount = 1;
  } else if (firstWord?.match(/^\d+$/)) {
    numStr = firstWord;
    durationWordCount = 1;
    if (words.length > 1) {
      const secondWord = words[1];
      if (secondWord?.match(/^[a-zA-Zа-яА-Я]+$/)) {
        unitStr = secondWord;
        durationWordCount = 2;
      }
    }
  }

  if (!numStr) {
    // No duration, whole input is reason
    return {
      durationSeconds: 0,
      until_date: 0,
      humanReadable: "навсегда",
      reason: trimmedInput,
    };
  }

  const number = parseInt(numStr, 10);
  const unit = getUnit(unitStr);
  if (!unit) {
    // Invalid unit, treat as reason (though not expected in tests)
    return {
      durationSeconds: 0,
      until_date: 0,
      humanReadable: "навсегда",
      reason: trimmedInput,
    };
  }

  const durationSeconds = number * unit.multiplier;
  const humanReadable = getHumanReadable(number, unit.type);
  const reason = words.slice(durationWordCount).join(" ").trim() || null;

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const until_date =
    durationSeconds === 0 ? 0 : currentTimestamp + durationSeconds;

  return {
    durationSeconds,
    until_date,
    humanReadable,
    reason,
  };
}

function getUnit(
  unitStr?: string,
): { type: string; multiplier: number } | null {
  if (!unitStr) {
    return { type: "minute", multiplier: 60 } as const;
  }

  const lower = unitStr.toLowerCase();
  if (
    [
      "m",
      "min",
      "minute",
      "minutes",
      "м",
      "мин",
      "минута",
      "минуты",
      "минут",
    ].some((u) => lower.startsWith(u))
  ) {
    return { type: "minute", multiplier: 60 } as const;
  }
  if (
    ["h", "hour", "hours", "ч", "час", "часа", "часов"].some((u) =>
      lower.startsWith(u),
    )
  ) {
    return { type: "hour", multiplier: 3600 } as const;
  }
  if (
    ["d", "day", "days", "д", "день", "дня", "дней"].some((u) =>
      lower.startsWith(u),
    )
  ) {
    return { type: "day", multiplier: 86400 } as const;
  }
  if (
    ["w", "week", "weeks", "н", "неделя", "недели", "неделю", "недель"].some(
      (u) => lower.startsWith(u),
    )
  ) {
    return { type: "week", multiplier: 604800 } as const;
  }
  return null;
}

function getHumanReadable(num: number, type: string): string {
  let unitWord: string;
  if (type === "minute") {
    unitWord = declinateRu(num, "минуту", "минуты", "минут");
  } else if (type === "hour") {
    unitWord = declinateRu(num, "час", "часа", "часов");
  } else if (type === "day") {
    unitWord = declinateRu(num, "день", "дня", "дней");
  } else if (type === "week") {
    unitWord = declinateRu(num, "неделю", "недели", "недель");
  } else {
    throw new Error("Invalid type");
  }
  return `на ${num} ${unitWord}`;
}

function declinateRu(
  n: number,
  one: string,
  few: string,
  many: string,
): string {
  const absN = Math.abs(n);
  const mod100 = absN % 100;
  const mod10 = absN % 10;
  if (mod100 > 10 && mod100 < 20) {
    return many;
  }
  if (mod10 > 1 && mod10 < 5) {
    return few;
  }
  if (mod10 === 1) {
    return one;
  }
  return many;
}
