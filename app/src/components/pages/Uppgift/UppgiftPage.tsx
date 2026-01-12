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
} from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { checkAnswer, fetchUppgiftPosition } from "@/api/client"
import type { Position } from "@/types/position"

export const UppgiftPage = () => {
	const [position, setPosition] = useState<Position | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [answer, setAnswer] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [showHint, setShowHint] = useState(false)
	const [checking, setChecking] = useState(false)
	const [isCorrect, setIsCorrect] = useState(false)

	const fetchRandomPosition = useCallback(async () => {
		setLoading(true)
		setError(null)
		setSubmitted(false)
		setShowHint(false)
		setAnswer("")
		setChecking(false)
		setIsCorrect(false)

		try {
			const data = null //await fetchUppgiftPosition()

			setPosition(data)
		} catch (e: unknown) {
			setError((e as Error)?.message ?? "Unknown error")
			setPosition(null)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchRandomPosition()
	}, [fetchRandomPosition])

	const canSubmit = useMemo(() => {
		return !!position && !loading && !checking && answer.trim().length > 0
	}, [position, loading, checking, answer])

	const onSubmit = async () => {
		if (!position) return

		setChecking(true)
		setSubmitted(true)

		try {
			const result = await checkAnswer(position.id, answer)

			setIsCorrect(result)
		} catch (e: unknown) {
			setError((e as Error)?.message ?? "Failed to check answer")
			setSubmitted(false)
		} finally {
			setChecking(false)
		}
	}

	const onNext = () => fetchRandomPosition()

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
									<Button color="inherit" size="small" onClick={fetchRandomPosition}>
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
									Koordinater:
								</Typography>

								<Stack spacing={0.5}>
									<Typography variant="body1" fontFamily="monospace">
										N{position.sweref99Coordinates.northing} E{position.sweref99Coordinates.easting}
									</Typography>
								</Stack>

								<Stack spacing={4}>
									<Divider />

									<TextField
										label="Namn på platsen"
										placeholder="Skriv namnet (t.ex. Södersjukhuset)"
										value={answer}
										onChange={(e) => setAnswer(e.target.value)}
										fullWidth
										disabled={loading || checking}
										onKeyDown={(e) => {
											if (e.key === "Enter" && canSubmit) onSubmit()
										}}
									/>
								</Stack>

								<Stack direction="row" spacing={1} flexWrap="wrap">
									<Button variant="contained" onClick={onSubmit} disabled={!canSubmit}>
										{checking ? "Kontrollerar..." : "Svara"}
									</Button>

									{submitted && (
										<Button variant="outlined" onClick={() => setShowHint((v) => !v)}>
											{showHint ? "Dölj ledtråd" : "Visa ledtråd"}
										</Button>
									)}

									<Button variant="text" onClick={onNext} disabled={loading || checking}>
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
									<Alert severity={isCorrect ? "success" : "warning"}>{isCorrect ? "Rätt! 🎉" : "Inte riktigt."}</Alert>
								)}
							</Stack>
						)}
					</CardContent>
				</Card>

				<Typography variant="caption" color="text.secondary">
					Koordinater är SWEREF 99 TM.
				</Typography>
			</Stack>
		</Container>
	)
}
