export const normalize = (s: string) => {
	return (
		s
			.trim()
			.toLowerCase()
			// normalisera diakritiska tecken (åäö etc) och ta bort accenter
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			// ta bort extra whitespace
			.replace(/\s+/g, " ")
	)
}
