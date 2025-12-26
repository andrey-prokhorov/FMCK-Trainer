import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
	Box,
	Container,
	Link,
	List,
	ListItem,
	ListItemIcon,
	Typography,
} from "@mui/material";

export const AboutPage = () => {
	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 6 }}>
				<Typography variant="h4" gutterBottom>
					Om applikationen
				</Typography>

				<Typography variant="body1">
					Denna lösning är byggd i C# .NET (Backend), Vite, React och TypeScript
					(Frontend) och kan användas internt inom FMCK (Frivilliga
					Motorcykelkåren) för att öva på att hitta platser med
					SWEREF-koordinater.
				</Typography>

				<Typography variant="body1" paragraph>
					Mer information om organisationen finns på{" "}
					<Link
						href="https://fmck.se/"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://fmck.se/
					</Link>
				</Typography>

				<Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
					Övningstyper
				</Typography>

				<Typography variant="body1">
					Appen stödjer två typer av övningar:
				</Typography>

				<List>
					<ListItem>
						<ListItemIcon>
							<CheckCircleOutlineIcon color="primary" />
						</ListItemIcon>
						<Typography variant="body1">
							Man får koordinater och ska ange namnet på platsen (t.ex. kyrka,
							sjukhus etc.).
						</Typography>
					</ListItem>

					<ListItem>
						<ListItemIcon>
							<CheckCircleOutlineIcon color="primary" />
						</ListItemIcon>
						<Typography variant="body1" color="text.secondary">
							Man får namnet på platsen och ska ange rätt koordinater (Under
							utveckling. Kommer snart).
						</Typography>
					</ListItem>
				</List>
			</Box>
		</Container>
	);
};
