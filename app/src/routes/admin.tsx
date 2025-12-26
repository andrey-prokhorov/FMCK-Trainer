import { createFileRoute } from "@tanstack/react-router";
import AdminPage from "@/components/pages/Admin/AdminPage";

export const Route = createFileRoute("/admin")({
	component: AdminPage,
});
