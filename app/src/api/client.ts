import type { Position } from "@/types/position"

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ""

export const checkAnswer = async (positionId: string, answer: string): Promise<boolean> => {
	const res = await fetch(`${apiBaseUrl}/positions/check`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			id: positionId,
			name: answer,
		}),
	})

	if (!res.ok) {
		throw new Error(`Request failed: ${res.status} ${res.statusText}`)
	}

	const result = (await res.json()) as { correct: boolean }

	return result.correct
}

export const fetchUppgiftPosition = async (): Promise<Position> => {
	const res = await fetch(`${apiBaseUrl}/positions`, {
		headers: { Accept: "application/json" },
	})

	if (!res.ok) {
		throw new Error(`Request failed: ${res.status} ${res.statusText}`)
	}

	const data = (await res.json()) as Position

	if (!data?.id) {
		throw new Error("API returned an unexpected payload.")
	}
	return data
}
