import { describe, expect, it } from "vitest"
import { normalize } from "./UppgiftPage.helper"

describe("UppgiftPage.helper", () => {
	describe("normalize", () => {
		it("should convert string to lowercase", () => {
			expect(normalize("HELLO WORLD")).toBe("hello world")
			expect(normalize("MixEd CaSe")).toBe("mixed case")
		})

		it("should trim whitespace from beginning and end", () => {
			expect(normalize("  hello  ")).toBe("hello")
			expect(normalize("\t\nhello\t\n")).toBe("hello")
		})

		it("should replace multiple whitespace with single space", () => {
			expect(normalize("hello    world")).toBe("hello world")
			expect(normalize("hello\t\tworld")).toBe("hello world")
			expect(normalize("hello\n\nworld")).toBe("hello world")
			expect(normalize("hello   \t\n   world")).toBe("hello world")
		})

		it("should normalize Swedish diacritics (åäö)", () => {
			expect(normalize("åäö")).toBe("aao")
			expect(normalize("ÅÄÖ")).toBe("aao")
		})

		it("should normalize other European diacritics", () => {
			expect(normalize("café")).toBe("cafe")
			expect(normalize("naïve")).toBe("naive")
			expect(normalize("résumé")).toBe("resume")
			expect(normalize("piñata")).toBe("pinata")
			expect(normalize("Zürich")).toBe("zurich")
		})

		it("should handle mixed diacritics and case", () => {
			expect(normalize("CAFÉ")).toBe("cafe")
			expect(normalize("Åsa")).toBe("asa")
			expect(normalize("Göteborg")).toBe("goteborg")
		})

		it("should handle empty string", () => {
			expect(normalize("")).toBe("")
		})

		it("should handle whitespace-only string", () => {
			expect(normalize("   ")).toBe("")
			expect(normalize("\t\n")).toBe("")
		})

		it("should handle single character", () => {
			expect(normalize("a")).toBe("a")
			expect(normalize("A")).toBe("a")
			expect(normalize("å")).toBe("a")
			expect(normalize("Å")).toBe("a")
		})

		it("should handle complex Swedish text", () => {
			expect(normalize("Södersjukhuset")).toBe("sodersjukhuset")
			expect(normalize("Karolinska sjukhuset")).toBe("karolinska sjukhuset")
			expect(normalize("  Danderyd   sjukhus  ")).toBe("danderyd sjukhus")
		})

		it("should handle text with numbers and special characters", () => {
			expect(normalize("Akuten 123")).toBe("akuten 123")
			expect(normalize("Building A-1")).toBe("building a-1")
			expect(normalize("Room 42B")).toBe("room 42b")
		})

		it("should handle multiple consecutive operations correctly", () => {
			const input = "  SÖDERSJUKHUSET   AKUTMOTTAGNINGEN  "
			expect(normalize(input)).toBe("sodersjukhuset akutmottagningen")
		})

		it("should be idempotent (running twice gives same result)", () => {
			const input = "  Göteborg Sjukhus  "
			const normalized = normalize(input)
			expect(normalize(normalized)).toBe(normalized)
		})

		it("should handle strings with only diacritics", () => {
			expect(normalize("ñññ")).toBe("nnn")
			expect(normalize("éééé")).toBe("eeee")
		})

		it("should handle mixed content with various unicode characters", () => {
			expect(normalize("  Café Zürich 123  åäö  ")).toBe("cafe zurich 123 aao")
		})

		it("should preserve non-letter characters properly", () => {
			expect(normalize("test-case")).toBe("test-case")
			expect(normalize("room_42")).toBe("room_42")
			expect(normalize("building.a")).toBe("building.a")
		})

		it("should handle real-world Swedish hospital/location names", () => {
			expect(normalize("Akademiska sjukhuset")).toBe("akademiska sjukhuset")
			expect(normalize("Universitetssjukhuset Örebro")).toBe("universitetssjukhuset orebro")
			expect(normalize("Skånes universitetssjukhus")).toBe("skanes universitetssjukhus")
		})

		it("should handle text with mixed whitespace types", () => {
			expect(normalize("hello\tworld\ntest")).toBe("hello world test")
			expect(normalize("line1\r\nline2")).toBe("line1 line2")
		})
	})
})
