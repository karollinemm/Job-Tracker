import { validateProspect, getRelativeAge, parseSalaryToNumber } from "../prospect-helpers";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });

  test("accepts a valid prospect with salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: "$150,000",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a valid prospect without salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a prospect with empty string salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: "",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a prospect with null salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: null,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects an invalid status", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      status: "InvalidStatus",
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Status must be one of/);
  });

  test("rejects an invalid interest level", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      interestLevel: "VeryHigh",
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Interest level must be one of/);
  });

  test("accepts a fully populated prospect", () => {
    const result = validateProspect({
      companyName: "Meta",
      roleTitle: "Product Manager",
      status: "Applied",
      interestLevel: "High",
      salary: "$200,000 - $250,000",
      dateApplied: "2025-01-15",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("dateApplied validation", () => {
  test("accepts a valid ISO date string", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      dateApplied: "2025-06-01T00:00:00Z",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a simple date string", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      dateApplied: "2025-03-15",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a Date object", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      dateApplied: new Date("2025-01-01"),
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects an invalid date string", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      dateApplied: "not-a-date",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Date applied must be a valid date");
  });

  test("accepts when dateApplied is omitted", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts when dateApplied is null", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      dateApplied: null,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("getRelativeAge", () => {
  const now = new Date("2025-06-10T12:00:00Z");

  test("returns 'Added today' for same day", () => {
    const date = new Date("2025-06-10T08:00:00Z");
    expect(getRelativeAge(date, now)).toBe("Added today");
  });

  test("returns 'Added 1 day ago' for yesterday", () => {
    const date = new Date("2025-06-09T12:00:00Z");
    expect(getRelativeAge(date, now)).toBe("Added 1 day ago");
  });

  test("returns 'Added 5 days ago'", () => {
    const date = new Date("2025-06-05T12:00:00Z");
    expect(getRelativeAge(date, now)).toBe("Added 5 days ago");
  });

  test("returns 'Added 29 days ago' for just under a month", () => {
    const date = new Date("2025-05-12T12:00:00Z");
    expect(getRelativeAge(date, now)).toBe("Added 29 days ago");
  });

  test("returns 'Added 1 month ago' for 30 days", () => {
    const date = new Date("2025-05-11T12:00:00Z");
    expect(getRelativeAge(date, now)).toBe("Added 1 month ago");
  });

  test("returns 'Added 3 months ago' for 90 days", () => {
    const date = new Date("2025-03-12T12:00:00Z");
    expect(getRelativeAge(date, now)).toBe("Added 3 months ago");
  });

  test("returns 'In the future' for future dates", () => {
    const date = new Date("2025-07-01T12:00:00Z");
    expect(getRelativeAge(date, now)).toBe("In the future");
  });
});

describe("parseSalaryToNumber", () => {
  test("parses formatted currency string", () => {
    expect(parseSalaryToNumber("$150,000")).toBe(150000);
  });

  test("parses plain number string", () => {
    expect(parseSalaryToNumber("120000")).toBe(120000);
  });

  test("returns 0 for null", () => {
    expect(parseSalaryToNumber(null)).toBe(0);
  });

  test("returns 0 for undefined", () => {
    expect(parseSalaryToNumber(undefined)).toBe(0);
  });

  test("returns 0 for empty string", () => {
    expect(parseSalaryToNumber("")).toBe(0);
  });

  test("returns 0 for non-numeric string", () => {
    expect(parseSalaryToNumber("Negotiable")).toBe(0);
  });

  test("concatenates all digits from range string", () => {
    expect(parseSalaryToNumber("$100,000 - $150,000")).toBe(100000150000);
  });

  test("parses salary with dollar sign only", () => {
    expect(parseSalaryToNumber("$80000")).toBe(80000);
  });
});
