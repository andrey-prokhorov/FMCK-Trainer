import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Paper,
	Snackbar,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PositionsResponse } from "@/types/api";
import type { Position } from "@/types/position";
import { toForm, validate } from "./AdminPage.helper";
import type { PositionFormState } from "./AdminPage.types";

export default function AdminPage() {
	const [rows, setRows] = useState<Position[]>([]);
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);

	const [snack, setSnack] = useState<{
		open: boolean;
		message: string;
		severity: "success" | "error" | "info";
	}>({ open: false, message: "", severity: "info" });

	// Dialog state
	const [dialogOpen, setDialogOpen] = useState(false);
	const [mode, setMode] = useState<"create" | "edit">("create");
	const [editing, setEditing] = useState<Position | null>(null);

	const [form, setForm] = useState<PositionFormState>(toForm());
	const [errors, setErrors] = useState<
		Partial<Record<keyof PositionFormState, string>>
	>({});

	// Delete confirm
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState<Position | null>(null);

	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

	const showSnack = (
		message: string,
		severity: "success" | "error" | "info" = "info",
	) => setSnack({ open: true, message, severity });

	const loadAll = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`${apiBaseUrl}/positions/all`, {
				headers: { Accept: "application/json" },
			});
			if (!res.ok)
				throw new Error(`Failed to load: ${res.status} ${res.statusText}`);

			const data = (await res.json()) as PositionsResponse | Position[];
			const list = Array.isArray(data) ? data : data.positions;

			setRows(list ?? []);
		} catch (e: unknown) {
			setSnack({
				open: true,
				message: (e as Error)?.message ?? "Failed to load positions",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadAll();
	}, [loadAll]);

	const openCreate = () => {
		setMode("create");
		setEditing(null);
		setForm(toForm());
		setErrors({});
		setDialogOpen(true);
	};

	const openEdit = (p: Position) => {
		setMode("edit");
		setEditing(p);
		setForm(toForm(p));
		setErrors({});
		setDialogOpen(true);
	};

	const closeDialog = () => {
		if (actionLoading) return;
		setDialogOpen(false);
	};

	const onChange =
		(key: keyof PositionFormState) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setForm((prev) => ({ ...prev, [key]: e.target.value }));
			setErrors((prev) => ({ ...prev, [key]: undefined }));
		};

	const canSubmit = useMemo(() => {
		const errs = validate(form);
		return Object.keys(errs).length === 0 && !actionLoading;
	}, [form, actionLoading]);

	const submit = async () => {
		const errs = validate(form);
		setErrors(errs);
		if (Object.keys(errs).length > 0) return;

		const lat = Number(form.lat);
		const lon = Number(form.lon);

		const payload = {
			name: form.name.trim(),
			coordinates: { lat, lon },
			address: form.address.trim(),
		};

		setActionLoading(true);
		try {
			if (mode === "create") {
				const res = await fetch(`${apiBaseUrl}/positions`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify(payload),
				});
				if (!res.ok)
					throw new Error(`Create failed: ${res.status} ${res.statusText}`);
				const created = (await res.json()) as Position;

				setRows((prev) => [created, ...prev]);
				showSnack("Created position", "success");
				setDialogOpen(false);
			} else {
				if (!editing) throw new Error("No item selected to edit");

				const res = await fetch(`${apiBaseUrl}/positions/${editing.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify(payload),
				});
				if (!res.ok)
					throw new Error(`Update failed: ${res.status} ${res.statusText}`);
				const updated = (await res.json()) as Position;

				setRows((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
				showSnack("Updated position", "success");
				setDialogOpen(false);
			}
		} catch (e: unknown) {
			showSnack((e as Error)?.message ?? "Save failed", "error");
		} finally {
			setActionLoading(false);
		}
	};

	const openDelete = (p: Position) => {
		setDeleting(p);
		setDeleteOpen(true);
	};

	const closeDelete = () => {
		if (actionLoading) return;
		setDeleteOpen(false);
		setDeleting(null);
	};

	const confirmDelete = async () => {
		if (!deleting) return;

		setActionLoading(true);
		try {
			const res = await fetch(`${apiBaseUrl}/positions/${deleting.id}`, {
				method: "DELETE",
			});
			if (!res.ok && res.status !== 204)
				throw new Error(`Delete failed: ${res.status} ${res.statusText}`);

			setRows((prev) => prev.filter((p) => p.id !== deleting.id));
			showSnack("Deleted position", "success");
			closeDelete();
		} catch (e: unknown) {
			showSnack((e as Error)?.message ?? "Delete failed", "error");
		} finally {
			setActionLoading(false);
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Stack spacing={2}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					spacing={2}
				>
					<Box>
						<Typography variant="h4" fontWeight={800}>
							Positions admin
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Manage positions (add, edit, delete)
						</Typography>
					</Box>

					<Stack direction="row" spacing={1}>
						<Tooltip title="Reload">
							<span>
								<IconButton
									onClick={loadAll}
									disabled={loading || actionLoading}
								>
									<RefreshIcon />
								</IconButton>
							</span>
						</Tooltip>

						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={openCreate}
							disabled={actionLoading}
						>
							Add new
						</Button>
					</Stack>
				</Stack>

				<Paper variant="outlined">
					<Box sx={{ p: 2 }}>
						<Typography variant="h6" fontWeight={700}>
							All positions
						</Typography>
						<Divider sx={{ my: 1.5 }} />

						{loading ? (
							<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
								<CircularProgress />
							</Box>
						) : rows.length === 0 ? (
							<Alert severity="info">No positions found.</Alert>
						) : (
							<Box sx={{ overflowX: "auto" }}>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell width={280}>
												<strong>Name</strong>
											</TableCell>
											<TableCell width={160}>
												<strong>Latitude</strong>
											</TableCell>
											<TableCell width={160}>
												<strong>Longitude</strong>
											</TableCell>
											<TableCell>
												<strong>Address</strong>
											</TableCell>
											<TableCell width={140} align="right">
												<strong>Actions</strong>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((p) => (
											<TableRow key={p.id} hover>
												<TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
												<TableCell sx={{ fontFamily: "monospace" }}>
													{p.coordinates.lat}
												</TableCell>
												<TableCell sx={{ fontFamily: "monospace" }}>
													{p.coordinates.lon}
												</TableCell>
												<TableCell>{p.address}</TableCell>
												<TableCell align="right">
													<Tooltip title="Edit">
														<span>
															<IconButton
																size="small"
																onClick={() => openEdit(p)}
																disabled={actionLoading}
															>
																<EditIcon fontSize="small" />
															</IconButton>
														</span>
													</Tooltip>
													<Tooltip title="Delete">
														<span>
															<IconButton
																size="small"
																onClick={() => openDelete(p)}
																disabled={actionLoading}
															>
																<DeleteIcon fontSize="small" />
															</IconButton>
														</span>
													</Tooltip>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Box>
						)}
					</Box>
				</Paper>
			</Stack>

			{/* Create/Edit dialog */}
			<Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
				<DialogTitle sx={{ fontWeight: 800 }}>
					{mode === "create" ? "Add position" : "Edit position"}
				</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1 }}>
						<TextField
							label="Name"
							value={form.name}
							onChange={onChange("name")}
							error={!!errors.name}
							helperText={errors.name}
							fullWidth
							autoFocus
						/>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextField
								label="Latitude (WGS-84)"
								value={form.lat}
								onChange={onChange("lat")}
								error={!!errors.lat}
								helperText={errors.lat}
								fullWidth
							/>
							<TextField
								label="Longitude (WGS-84)"
								value={form.lon}
								onChange={onChange("lon")}
								error={!!errors.lon}
								helperText={errors.lon}
								fullWidth
							/>
						</Stack>

						<TextField
							label="Address"
							value={form.address}
							onChange={onChange("address")}
							error={!!errors.address}
							helperText={errors.address}
							fullWidth
							multiline
							minRows={2}
						/>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button onClick={closeDialog} disabled={actionLoading}>
						Cancel
					</Button>
					<Button variant="contained" onClick={submit} disabled={!canSubmit}>
						{actionLoading ? "Saving..." : "Save"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete confirm dialog */}
			<Dialog open={deleteOpen} onClose={closeDelete} fullWidth maxWidth="xs">
				<DialogTitle sx={{ fontWeight: 800 }}>Delete position?</DialogTitle>
				<DialogContent>
					<Typography variant="body2" color="text.secondary">
						This will permanently remove:
					</Typography>
					<Typography sx={{ mt: 1, fontWeight: 700 }}>
						{deleting?.name}
					</Typography>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button onClick={closeDelete} disabled={actionLoading}>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={confirmDelete}
						disabled={actionLoading}
					>
						{actionLoading ? "Deleting..." : "Delete"}
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snack.open}
				autoHideDuration={4000}
				onClose={() => setSnack((s) => ({ ...s, open: false }))}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setSnack((s) => ({ ...s, open: false }))}
					severity={snack.severity}
					sx={{ width: "100%" }}
				>
					{snack.message}
				</Alert>
			</Snackbar>
		</Container>
	);
}
