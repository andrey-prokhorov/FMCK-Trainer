import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import {
	AppBar,
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	Toolbar,
	Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import NavigationListItem from "./NavigationListItem";

const drawerWidth = 320;

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);

	const close = () => setIsOpen(false);
	const open = () => setIsOpen(true);

	return (
		<>
			<AppBar position="static" color="default" elevation={4}>
				<Toolbar sx={{ bgcolor: "#1f2937", color: "white" }}>
					<IconButton
						edge="start"
						onClick={open}
						aria-label="Open menu"
						sx={{ color: "inherit" }}
					>
						<MenuIcon />
					</IconButton>

					<Typography
						variant="h6"
						sx={{
							ml: 2,
							fontWeight: 700,
							display: "flex",
							alignItems: "center",
							gap: 2,
						}}
					>
						<Link
							to="/"
							style={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<img
								src="/logo.webp"
								alt="FRIVILLIGA MOTORCYKELKÅREN"
								style={{ height: 40, display: "block" }}
							/>
						</Link>
						FMCK Trainer
					</Typography>
				</Toolbar>
			</AppBar>

			<Drawer
				anchor="left"
				open={isOpen}
				onClose={close}
				sx={{
					width: drawerWidth,
					bgcolor: "#111827",
					color: "white",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1.5 }}>
					<Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
						Navigation
					</Typography>

					<IconButton
						onClick={close}
						aria-label="Close menu"
						sx={{ color: "inherit" }}
					>
						<CloseIcon />
					</IconButton>
				</Box>

				<Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

				<Box sx={{ p: 1, overflowY: "auto", flex: 1 }}>
					<List disablePadding>
						<NavigationListItem
							to="/"
							icon={<HomeIcon />}
							text="Uppgift"
							close={close}
						/>
						<NavigationListItem
							to="/admin"
							icon={<SettingsIcon />}
							text="Admin"
							close={close}
						/>
					</List>
				</Box>
			</Drawer>
		</>
	);
}
