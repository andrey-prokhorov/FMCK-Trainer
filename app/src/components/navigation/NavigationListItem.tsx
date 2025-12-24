//NavigationListItem

import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type React from "react";

interface NavigationListItemProps {
	to: string;
	icon: React.ReactElement;
	text: string;
	close: () => void;
}

export default function NavigationListItem({
	to,
	icon,
	text,
	close,
}: NavigationListItemProps) {
	return (
		<Link
			to={to}
			onClick={close}
			style={{ textDecoration: "none", color: "inherit" }}
			activeProps={{
				style: { textDecoration: "none", color: "inherit" },
			}}
		>
			{({ isActive }) => (
				<ListItemButton
					sx={{
						borderRadius: 2,
						mb: 1,
						bgcolor: isActive ? "#0891b2" : "transparent",
						"&:hover": {
							bgcolor: isActive ? "#0e7490" : "rgba(255,255,255,0.08)",
						},
					}}
				>
					<ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
						{icon}
					</ListItemIcon>
					<ListItemText primary={text} sx={{ fontWeight: 600 }} />
				</ListItemButton>
			)}
		</Link>
	);
}
