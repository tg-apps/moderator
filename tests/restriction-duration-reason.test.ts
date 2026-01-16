import { describe, it, expect } from "bun:test";

import { getRestrictionDurationAndReason } from "../src/utils/restriction-duration-reason";

describe("getRestrictionDurationAndReason", () => {
  describe("empty strings", () => {
    it("empty string", () => {
      expect(getRestrictionDurationAndReason("")).toMatchObject({
        durationSeconds: 0,
        humanReadable: "навсегда",
        reason: null,
      });
    });

    it("empty, untrimmed string", () => {
      expect(getRestrictionDurationAndReason(" ")).toMatchObject({
        durationSeconds: 0,
        humanReadable: "навсегда",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("  ")).toMatchObject({
        durationSeconds: 0,
        humanReadable: "навсегда",
        reason: null,
      });
    });
  });

  describe("duration only", () => {
    it("number-only duration", () => {
      expect(getRestrictionDurationAndReason("1")).toMatchObject({
        durationSeconds: 60,
        humanReadable: "на 1 минуту",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("5")).toMatchObject({
        durationSeconds: 300,
        humanReadable: "на 5 минут",
        reason: null,
      });
    });

    describe("number+letter one-word duration only", () => {
      it("hours", () => {
        expect(getRestrictionDurationAndReason("1ч")).toMatchObject({
          durationSeconds: 3600,
          humanReadable: "на 1 час",
          reason: null,
        });

        expect(getRestrictionDurationAndReason("1h")).toMatchObject({
          durationSeconds: 3600,
          humanReadable: "на 1 час",
          reason: null,
        });
      });

      it("days", () => {
        expect(getRestrictionDurationAndReason("1д")).toMatchObject({
          durationSeconds: 3600 * 24,
          humanReadable: "на 1 день",
          reason: null,
        });

        expect(getRestrictionDurationAndReason("1d")).toMatchObject({
          durationSeconds: 3600 * 24,
          humanReadable: "на 1 день",
          reason: null,
        });

        expect(getRestrictionDurationAndReason("3д")).toMatchObject({
          durationSeconds: 3600 * 24 * 3,
          humanReadable: "на 3 дня",
          reason: null,
        });

        expect(getRestrictionDurationAndReason("3d")).toMatchObject({
          durationSeconds: 3600 * 24 * 3,
          humanReadable: "на 3 дня",
          reason: null,
        });
      });

      it("weeks", () => {
        expect(getRestrictionDurationAndReason("1н")).toMatchObject({
          durationSeconds: 3600 * 24 * 7,
          humanReadable: "на 1 неделю",
          reason: null,
        });

        expect(getRestrictionDurationAndReason("1w")).toMatchObject({
          durationSeconds: 3600 * 24 * 7,
          humanReadable: "на 1 неделю",
          reason: null,
        });

        expect(getRestrictionDurationAndReason("2w")).toMatchObject({
          durationSeconds: 3600 * 24 * 7 * 2,
          humanReadable: "на 2 недели",
          reason: null,
        });

        expect(getRestrictionDurationAndReason("2w")).toMatchObject({
          durationSeconds: 3600 * 24 * 7 * 2,
          humanReadable: "на 2 недели",
          reason: null,
        });
      });
    });

    it("number+letter multi-word duration only", () => {
      expect(getRestrictionDurationAndReason("1 ч")).toMatchObject({
        durationSeconds: 3600,
        humanReadable: "на 1 час",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 h")).toMatchObject({
        durationSeconds: 3600,
        humanReadable: "на 1 час",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 д")).toMatchObject({
        durationSeconds: 3600 * 24,
        humanReadable: "на 1 день",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 d")).toMatchObject({
        durationSeconds: 3600 * 24,
        humanReadable: "на 1 день",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("3 д")).toMatchObject({
        durationSeconds: 3600 * 24 * 3,
        humanReadable: "на 3 дня",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("3 дня")).toMatchObject({
        durationSeconds: 3600 * 24 * 3,
        humanReadable: "на 3 дня",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("3 d")).toMatchObject({
        durationSeconds: 3600 * 24 * 3,
        humanReadable: "на 3 дня",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 н")).toMatchObject({
        durationSeconds: 3600 * 24 * 7,
        humanReadable: "на 1 неделю",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 w")).toMatchObject({
        durationSeconds: 3600 * 24 * 7,
        humanReadable: "на 1 неделю",
        reason: null,
      });
    });

    it("number+word multi-word duration only", () => {
      expect(getRestrictionDurationAndReason("1 minute")).toMatchObject({
        durationSeconds: 60,
        humanReadable: "на 1 минуту",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("5 минут")).toMatchObject({
        durationSeconds: 300,
        humanReadable: "на 5 минут",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 час")).toMatchObject({
        durationSeconds: 3600,
        humanReadable: "на 1 час",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 hour")).toMatchObject({
        durationSeconds: 3600,
        humanReadable: "на 1 час",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 день")).toMatchObject({
        durationSeconds: 3600 * 24,
        humanReadable: "на 1 день",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 day")).toMatchObject({
        durationSeconds: 3600 * 24,
        humanReadable: "на 1 день",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("3 дня")).toMatchObject({
        durationSeconds: 3600 * 24 * 3,
        humanReadable: "на 3 дня",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("3 days")).toMatchObject({
        durationSeconds: 3600 * 24 * 3,
        humanReadable: "на 3 дня",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 неделя")).toMatchObject({
        durationSeconds: 3600 * 24 * 7,
        humanReadable: "на 1 неделю",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 неделю")).toMatchObject({
        durationSeconds: 3600 * 24 * 7,
        humanReadable: "на 1 неделю",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("5 недель")).toMatchObject({
        durationSeconds: 3600 * 24 * 7 * 5,
        humanReadable: "на 5 недель",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("1 week")).toMatchObject({
        durationSeconds: 3600 * 24 * 7,
        humanReadable: "на 1 неделю",
        reason: null,
      });

      expect(getRestrictionDurationAndReason("2 weeks")).toMatchObject({
        durationSeconds: 3600 * 24 * 7 * 2,
        humanReadable: "на 2 недели",
        reason: null,
      });
    });
  });

  describe("reason only", () => {
    it("one-word reason only", () => {
      expect(getRestrictionDurationAndReason("спам")).toMatchObject({
        durationSeconds: 0,
        humanReadable: "навсегда",
        reason: "спам",
      });

      expect(getRestrictionDurationAndReason("spam")).toMatchObject({
        durationSeconds: 0,
        humanReadable: "навсегда",
        reason: "spam",
      });

      expect(getRestrictionDurationAndReason("advertising")).toMatchObject({
        durationSeconds: 0,
        humanReadable: "навсегда",
        reason: "advertising",
      });
    });

    it("multi-word reason only", () => {
      expect(getRestrictionDurationAndReason("просто так")).toMatchObject({
        durationSeconds: 0,
        humanReadable: "навсегда",
        reason: "просто так",
      });

      expect(getRestrictionDurationAndReason("breaking rules")).toMatchObject({
        durationSeconds: 0,
        humanReadable: "навсегда",
        reason: "breaking rules",
      });
    });
  });

  describe("duration + reason", () => {
    it("one-word duration + one-word reason", () => {
      expect(getRestrictionDurationAndReason("1д спам")).toMatchObject({
        durationSeconds: 3600 * 24,
        humanReadable: "на 1 день",
        reason: "спам",
      });

      expect(getRestrictionDurationAndReason("1d spam")).toMatchObject({
        durationSeconds: 3600 * 24,
        humanReadable: "на 1 день",
        reason: "spam",
      });
    });

    it("multi-word duration + one-word reason", () => {
      expect(getRestrictionDurationAndReason("1 д спам")).toMatchObject({
        durationSeconds: 3600 * 24,
        humanReadable: "на 1 день",
        reason: "спам",
      });

      expect(getRestrictionDurationAndReason("1 d spam")).toMatchObject({
        durationSeconds: 3600 * 24,
        humanReadable: "на 1 день",
        reason: "spam",
      });

      expect(getRestrictionDurationAndReason("1 day spam")).toMatchObject({
        durationSeconds: 3600 * 24,
        humanReadable: "на 1 день",
        reason: "spam",
      });

      expect(getRestrictionDurationAndReason("3 hours spam")).toMatchObject({
        durationSeconds: 3600 * 3,
        humanReadable: "на 3 часа",
        reason: "spam",
      });
    });

    it("one-word duration + multi-word reason", () => {
      expect(
        getRestrictionDurationAndReason("3ч breaking rules")
      ).toMatchObject({
        durationSeconds: 3600 * 3,
        humanReadable: "на 3 часа",
        reason: "breaking rules",
      });

      expect(
        getRestrictionDurationAndReason("1w breaking rules")
      ).toMatchObject({
        durationSeconds: 3600 * 24 * 7,
        humanReadable: "на 1 неделю",
        reason: "breaking rules",
      });
    });

    it("multi-word duration + multi-word reason", () => {
      expect(
        getRestrictionDurationAndReason("5 минут breaking rules")
      ).toMatchObject({
        durationSeconds: 300,
        humanReadable: "на 5 минут",
        reason: "breaking rules",
      });

      expect(
        getRestrictionDurationAndReason("3 days breaking rules")
      ).toMatchObject({
        durationSeconds: 3600 * 24 * 3,
        humanReadable: "на 3 дня",
        reason: "breaking rules",
      });
    });
  });
});
