import { expect, test } from "@playwright/test"

const position1 = {
  id: "pos-1",
  sweref99Coordinates: { northing: 6580824, easting: 674032 },
  address: "Stockholm",
}

const position2 = {
  id: "pos-2",
  sweref99Coordinates: { northing: 6579000, easting: 673000 },
  address: "Uppsala",
}

test.describe("UppgiftPage", () => {
  test.beforeEach(async ({ page }) => {
    // Default: successful fetch of a position
    await page.route("**/api/positions", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(position1),
      })
    })

    await page.goto("/")
    await expect(page.getByText("Koordinater:")).toBeVisible()
  })

  test("loads page and shows coordinates", async ({ page }) => {
    await expect(page.getByText("Koordinater:")).toBeVisible()

    // Coordinates are rendered like: Nxxxx Exxxx
    await expect(page.getByText(/N\d+\s+E\d+/)).toBeVisible()
  })

  test("disables submit button until answer is entered", async ({ page }) => {
    const submit = page.getByRole("button", { name: "Svara" })
    await expect(submit).toBeDisabled()

    const input = page.getByLabel("Namn på platsen")
    await input.fill("Test")
    await expect(submit).toBeEnabled()
  })

  test("shows loading spinner while fetching", async ({ page }) => {
    // Override route to delay response so we can see the spinner
    await page.unroute("**/*")
    await page.route("**/api/positions", async (route) => {
      await new Promise((r) => setTimeout(r, 100))
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(position1),
      })
    })

    await page.goto("/")

    await expect(page.getByText("Koordinater:")).toBeVisible()
  })

  test("shows error state", async ({ page }) => {
    await page.unroute("**/*")

    await page.route("**/api/positions", async (route) => {
      await new Promise((r) => setTimeout(r, 100))
      await route.fulfill({
        status: 500,
        body: "fail",
      })
    })

    await page.goto("/")
    await expect(page.getByText("Request failed: 500 Internal Server Error")).toBeVisible()
  })

  test("submits answer and shows success message", async ({ page }) => {
    await page.route("**/api/positions/check", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
            correct: true,
        }),
      })
    })

    const input = page.getByLabel("Namn på platsen")
    await input.fill("Södersjukhuset")

    await page.getByRole("button", { name: "Svara" }).click()

    await expect(page.getByText("Rätt! 🎉")).toBeVisible()
    await expect(page.getByRole("button", { name: "Visa ledtråd" })).toBeVisible()
  })

  test("submits incorrect answer and shows warning", async ({ page }) => {
    await page.route("**/api/positions/check*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          correct: false,
        }),
      })
    })

    await page.getByLabel("Namn på platsen").fill("Fel svar")
    await page.getByRole("button", { name: "Svara" }).click()

    await expect(page.getByText("Inte riktigt.")).toBeVisible()
  })

  test("toggles hint visibility", async ({ page }) => {
    await page.route("**/api/positions/check", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(false),
      })
    })

    await page.getByLabel("Namn på platsen").fill("X")
    await page.getByRole("button", { name: "Svara" }).click()

    const toggle = page.getByRole("button", { name: "Visa ledtråd" })
    await expect(toggle).toBeVisible()

    await toggle.click()
    await expect(page.getByText("Ledtråd (adress):")).toBeVisible()
    await expect(page.getByText(position1.address)).toBeVisible()

    await page.getByRole("button", { name: "Dölj ledtråd" }).click()
    await expect(page.getByText("Ledtråd (adress):")).toHaveCount(0)
  })



  test("loads a new task and resets state when clicking Ny uppgift", async ({ page }) => {
    // checkAnswer returns false so 'submitted' becomes true
    await page.route("**/api/positions/check", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(false),
      })
    })

    // For subsequent "Ny uppgift" we return a new position
    let uppgiftCall = 0
    await page.unroute("**/*")
    await page.route("**/api/positions*", async (route) => {
      uppgiftCall += 1
      const payload = uppgiftCall === 1 ? position1 : position2
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(payload),
      })
    })

    await page.goto("/")
    await expect(page.getByText(/N\d+\s+E\d+/)).toBeVisible()

    // Submit once
    await page.getByLabel("Namn på platsen").fill("X")
    await page.getByRole("button", { name: "Svara" }).click()
    await expect(page.getByText("Inte riktigt.")).toBeVisible()
    await expect(page.getByRole("button", { name: "Visa ledtråd" })).toBeVisible()

    // Click "Ny uppgift" and verify reset
    await page.getByRole("button", { name: "Ny uppgift" }).click()

    // Coordinates should update (position2)
    await expect(page.getByText(new RegExp(`N${position2.sweref99Coordinates.northing}\\s+E${position2.sweref99Coordinates.easting}`))).toBeVisible()

    // Input cleared, result/hint button removed
    await expect(page.getByLabel("Namn på platsen")).toHaveValue("")
    await expect(page.getByText("Inte riktigt.")).toHaveCount(0)
    await expect(page.getByRole("button", { name: "Visa ledtråd" })).toHaveCount(0)
  })
})
