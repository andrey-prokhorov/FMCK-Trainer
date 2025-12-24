import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Container,
	Divider,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

type Coordinates = {
	lat: number;
	lon: number;
};

type Position = {
	id: string;
	name: string;
	coordinates: Coordinates;
	address: string;
};

function normalize(s: string) {
	return (
		s
			.trim()
			.toLowerCase()
			// normalisera diakritiska tecken (åäö etc) och ta bort accenter
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			// ta bort extra whitespace
			.replace(/\s+/g, " ")
	);
}

export default function PositionsQuizPage() {
	const [position, setPosition] = useState<Position | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [answer, setAnswer] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [showHint, setShowHint] = useState(false);

	const fetchRandomPosition = useCallback(async () => {
		setLoading(true);
		setError(null);
		setSubmitted(false);
		setShowHint(false);
		setAnswer("");

		try {
			const res = await fetch("http://localhost:5116/api/positions", {
				headers: { Accept: "application/json" },
			});

			if (!res.ok) {
				throw new Error(`Request failed: ${res.status} ${res.statusText}`);
			}

			const data = (await res.json()) as Position;

			// Skydd om API:t råkar returnera null/empty
			if (!data?.id) {
				throw new Error("API returned an unexpected payload.");
			}

			setPosition(data);
		} catch (e: any) {
			setError(e?.message ?? "Unknown error");
			setPosition(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRandomPosition();
	}, [fetchRandomPosition]);

	const isCorrect = useMemo(() => {
		if (!submitted || !position) return false;
		return normalize(answer) === normalize(position.name);
	}, [submitted, answer, position]);

	const canSubmit = useMemo(() => {
		return !!position && !loading && answer.trim().length > 0 && !submitted;
	}, [position, loading, answer, submitted]);

	const onSubmit = () => setSubmitted(true);

	const onNext = () => fetchRandomPosition();

	return (
		<Container maxWidth="sm" sx={{ py: 4 }}>
			<Stack spacing={2}>
				<Typography variant="h4" fontWeight={700}>
					Uppgift
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Åk till platsen och ange namnet
				</Typography>

				<Card variant="outlined">
					<CardContent>
						{loading && (
							<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
								<CircularProgress />
							</Box>
						)}

						{!loading && error && (
							<Alert
								severity="error"
								action={
									<Button
										color="inherit"
										size="small"
										onClick={fetchRandomPosition}
									>
										Försök igen
									</Button>
								}
							>
								{error}
							</Alert>
						)}

						{!loading && !error && position && (
							<Stack spacing={2}>
								<Typography variant="h6" fontWeight={700}>
									Koordinater: (WGS-84)
								</Typography>

								<Stack spacing={0.5}>
									<Typography variant="body2" color="text.secondary">
										Latitude
									</Typography>
									<Typography variant="body1" fontFamily="monospace">
										{position.coordinates.lat}
									</Typography>

									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mt: 1 }}
									>
										Longitude
									</Typography>
									<Typography variant="body1" fontFamily="monospace">
										{position.coordinates.lon}
									</Typography>
								</Stack>

								<Divider />

								<TextField
									label="Namn på platsen"
									placeholder="Skriv namnet (t.ex. Akutmottagningen, Södersjukhuset)"
									value={answer}
									onChange={(e) => setAnswer(e.target.value)}
									fullWidth
									disabled={submitted}
									onKeyDown={(e) => {
										if (e.key === "Enter" && canSubmit) onSubmit();
									}}
								/>

								<Stack direction="row" spacing={1} flexWrap="wrap">
									<Button
										variant="contained"
										onClick={onSubmit}
										disabled={!canSubmit}
									>
										Svara
									</Button>

									<Button
										variant="outlined"
										onClick={() => setShowHint((v) => !v)}
										disabled={submitted === false && !position}
									>
										{showHint ? "Dölj ledtråd" : "Visa ledtråd"}
									</Button>

									<Button variant="text" onClick={onNext} disabled={loading}>
										Ny uppgift
									</Button>
								</Stack>

								{showHint && (
									<Alert severity="info">
										<Typography variant="body2" sx={{ mb: 0.5 }}>
											Ledtråd (adress):
										</Typography>
										<Typography variant="body2" fontFamily="monospace">
											{position.address}
										</Typography>
									</Alert>
								)}

								{submitted && (
									<Alert severity={isCorrect ? "success" : "warning"}>
										{isCorrect ? (
											<>Rätt! 🎉</>
										) : (
											<>
												Inte riktigt. Rätt svar är:{" "}
												<strong>{position.name}</strong>
											</>
										)}
									</Alert>
								)}
							</Stack>
						)}
					</CardContent>
				</Card>

				<Typography variant="caption" color="text.secondary">
					Tips: Matchningen är exakt men normaliserar whitespace och accenter.
				</Typography>
			</Stack>
		</Container>
	);
}
