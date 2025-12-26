import { createFileRoute } from "@tanstack/react-router";
import { UppgiftPage } from "@/components/pages/Uppgift/UppgiftPage";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return <UppgiftPage />;
}
