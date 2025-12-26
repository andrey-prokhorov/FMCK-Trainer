import { render, screen } from "@testing-library/react";
import { AboutPage } from "./AboutPage";

describe("AboutPage", () => {
	it("renders heading", () => {
		render(<AboutPage />);
		expect(screen.getByText("Om applikationen")).toBeInTheDocument();
	});
});
