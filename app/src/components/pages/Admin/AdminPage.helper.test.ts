import { describe, expect, it } from "vitest";
import type { Position } from "@/types/position";
import { parseNumber, toForm, validate } from "./AdminPage.helper";
import type { PositionFormState } from "./AdminPage.types";

describe("Tests of AdminPage helper functions", () => {
	describe("toForm", () => {
		it("should convert a position to form state", () => {
			const position: Position = {
				id: "1",
				name: "Test Location",
				coordinates: { lat: 59.3293, lon: 18.0686 },
				sweref99Coordinates: { northing: 6580994, easting: 674032 },
				address: "123 Test Street, Stockholm",
			};

			const result = toForm(position);

			expect(result).toEqual({
				name: "Test Location",
				lat: "59.3293",
				lon: "18.0686",
				address: "123 Test Street, Stockholm",
			});
		});

		it("should return empty form state when position is undefined", () => {
			const result = toForm(undefined);

			expect(result).toEqual({
				name: "",
				lat: "",
				lon: "",
				address: "",
			});
		});

		it("should return empty form state when position is undefined", () => {
			const result = toForm(undefined);

			expect(result).toEqual({
				name: "",
				lat: "",
				lon: "",
				address: "",
			});
		});

		it("should handle position with zero coordinates", () => {
			const position: Position = {
				id: "2",
				name: "Equator Location",
				coordinates: { lat: 0, lon: 0 },
				sweref99Coordinates: { northing: 0, easting: 0 },
				address: "0 Equator Street",
			};

			const result = toForm(position);

			expect(result).toEqual({
				name: "Equator Location",
				lat: "0",
				lon: "0",
				address: "0 Equator Street",
			});
		});

		it("should handle position with negative coordinates", () => {
			const position: Position = {
				id: "3",
				name: "Southern Location",
				coordinates: { lat: -45.123, lon: -120.456 },
				sweref99Coordinates: { northing: 1000000, easting: 500000 },
				address: "123 Southern Street",
			};

			const result = toForm(position);

			expect(result).toEqual({
				name: "Southern Location",
				lat: "-45.123",
				lon: "-120.456",
				address: "123 Southern Street",
			});
		});
	});

	describe("parseNumber", () => {
		it("should parse valid integer string", () => {
			expect(parseNumber("42")).toBe(42);
		});

		it("should parse negative numbers", () => {
			expect(parseNumber("-25")).toBe(-25);
			expect(parseNumber("-3.14")).toBe(-3.14);
		});

		it("should parse zero", () => {
			expect(parseNumber("0")).toBe(0);
			expect(parseNumber("0.0")).toBe(0);
		});

		it("should return null for empty string", () => {
			expect(parseNumber("")).toBeNull();
		});

		it("should return null for whitespace only", () => {
			expect(parseNumber("   ")).toBeNull();
			expect(parseNumber("\t")).toBeNull();
			expect(parseNumber("\n")).toBeNull();
		});

		it("should return null for invalid number strings", () => {
			expect(parseNumber("abc")).toBeNull();
			expect(parseNumber("12.34.56")).toBeNull();
			expect(parseNumber("12abc")).toBeNull();
			expect(parseNumber("abc123")).toBeNull();
		});

		it("should parse numbers with leading/trailing whitespace", () => {
			expect(parseNumber("  42  ")).toBe(42);
			expect(parseNumber("\t3.14\n")).toBe(3.14);
		});

		it("should handle scientific notation", () => {
			expect(parseNumber("1e5")).toBe(100000);
			expect(parseNumber("2.5e-3")).toBe(0.0025);
		});

		it("should return null for Infinity and NaN strings", () => {
			expect(parseNumber("Infinity")).toBeNull();
			expect(parseNumber("-Infinity")).toBeNull();
			expect(parseNumber("NaN")).toBeNull();
		});
	});

	describe("validate", () => {
		const validForm: PositionFormState = {
			name: "Test Location",
			lat: "59.3293",
			lon: "18.0686",
			address: "123 Test Street",
		};

		it("should return no errors for valid form", () => {
			const errors = validate(validForm);
			expect(errors).toEqual({});
		});

		it("should require name", () => {
			const form = { ...validForm, name: "" };
			const errors = validate(form);
			expect(errors.name).toBe("Name is required");
		});

		it("should require name (whitespace only)", () => {
			const form = { ...validForm, name: "   " };
			const errors = validate(form);
			expect(errors.name).toBe("Name is required");
		});

		it("should require latitude to be a number", () => {
			const form = { ...validForm, lat: "invalid" };
			const errors = validate(form);
			expect(errors.lat).toBe("Latitude must be a number");
		});

		it("should require longitude to be a number", () => {
			const form = { ...validForm, lon: "invalid" };
			const errors = validate(form);
			expect(errors.lon).toBe("Longitude must be a number");
		});

		it("should validate latitude range (too low)", () => {
			const form = { ...validForm, lat: "-91" };
			const errors = validate(form);
			expect(errors.lat).toBe("Latitude must be between -90 and 90");
		});

		it("should validate latitude range (too high)", () => {
			const form = { ...validForm, lat: "91" };
			const errors = validate(form);
			expect(errors.lat).toBe("Latitude must be between -90 and 90");
		});

		it("should accept latitude boundary values", () => {
			const form1 = { ...validForm, lat: "-90" };
			const form2 = { ...validForm, lat: "90" };
			expect(validate(form1).lat).toBeUndefined();
			expect(validate(form2).lat).toBeUndefined();
		});

		it("should validate longitude range (too low)", () => {
			const form = { ...validForm, lon: "-181" };
			const errors = validate(form);
			expect(errors.lon).toBe("Longitude must be between -180 and 180");
		});

		it("should validate longitude range (too high)", () => {
			const form = { ...validForm, lon: "181" };
			const errors = validate(form);
			expect(errors.lon).toBe("Longitude must be between -180 and 180");
		});

		it("should accept longitude boundary values", () => {
			const form1 = { ...validForm, lon: "-180" };
			const form2 = { ...validForm, lon: "180" };
			expect(validate(form1).lon).toBeUndefined();
			expect(validate(form2).lon).toBeUndefined();
		});

		it("should require address", () => {
			const form = { ...validForm, address: "" };
			const errors = validate(form);
			expect(errors.address).toBe("Address is required");
		});

		it("should require address (whitespace only)", () => {
			const form = { ...validForm, address: "   " };
			const errors = validate(form);
			expect(errors.address).toBe("Address is required");
		});

		it("should handle multiple validation errors", () => {
			const form: PositionFormState = {
				name: "",
				lat: "invalid",
				lon: "200",
				address: "",
			};
			const errors = validate(form);

			expect(errors).toEqual({
				name: "Name is required",
				lat: "Latitude must be a number",
				lon: "Longitude must be between -180 and 180",
				address: "Address is required",
			});
		});

		it("should handle empty coordinate fields", () => {
			const form = { ...validForm, lat: "", lon: "" };
			const errors = validate(form);
			expect(errors.lat).toBe("Latitude must be a number");
			expect(errors.lon).toBe("Longitude must be a number");
		});

		it("should handle whitespace-only coordinate fields", () => {
			const form = { ...validForm, lat: "   ", lon: "   " };
			const errors = validate(form);
			expect(errors.lat).toBe("Latitude must be a number");
			expect(errors.lon).toBe("Longitude must be a number");
		});

		it("should accept valid decimal coordinates", () => {
			const form = {
				...validForm,
				lat: "59.32932",
				lon: "18.06861",
			};
			const errors = validate(form);
			expect(errors.lat).toBeUndefined();
			expect(errors.lon).toBeUndefined();
		});

		it("should accept valid negative coordinates", () => {
			const form = {
				...validForm,
				lat: "-45.123",
				lon: "-120.456",
			};
			const errors = validate(form);
			expect(errors.lat).toBeUndefined();
			expect(errors.lon).toBeUndefined();
		});

		it("should accept zero coordinates", () => {
			const form = {
				...validForm,
				lat: "0",
				lon: "0",
			};
			const errors = validate(form);
			expect(errors.lat).toBeUndefined();
			expect(errors.lon).toBeUndefined();
		});
	});
});
