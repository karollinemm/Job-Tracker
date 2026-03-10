import { validateProspect } from "../prospect-helpers";

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
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
