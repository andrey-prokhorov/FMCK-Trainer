import type { Position } from "@/types/position";
import type { PositionFormState } from "./AdminPage.types";

export const toForm = (p?: Position): PositionFormState => {
	return {
		name: p?.name ?? "",
		lat: p ? String(p.coordinates.lat) : "",
		lon: p ? String(p.coordinates.lon) : "",
		address: p?.address ?? "",
	};
};

export const parseNumber = (value: string): number | null => {
	if (!value.trim()) return null;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
};

export const validate = (form: PositionFormState) => {
	const errors: Partial<Record<keyof PositionFormState, string>> = {};

	if (!form.name.trim()) errors.name = "Name is required";
	const lat = parseNumber(form.lat);
	const lon = parseNumber(form.lon);
	if (lat === null) errors.lat = "Latitude must be a number";
	if (lon === null) errors.lon = "Longitude must be a number";
	if (lat !== null && (lat < -90 || lat > 90))
		errors.lat = "Latitude must be between -90 and 90";
	if (lon !== null && (lon < -180 || lon > 180))
		errors.lon = "Longitude must be between -180 and 180";
	if (!form.address.trim()) errors.address = "Address is required";

	return errors;
};
