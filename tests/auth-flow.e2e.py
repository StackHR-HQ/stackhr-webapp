"""Browser test for signup, email verification, and a subsequent login.

Runs against the frontend's built-in mock auth service; it does not create
accounts in an external backend.
"""

from time import time

from playwright.sync_api import expect, sync_playwright


email = f"browser-test-{int(time() * 1000)}@example.com"
company_name = "Browser Test Company"
password = "correct horse battery staple"

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    page.goto("http://127.0.0.1:5173/signup")
    page.wait_for_load_state("networkidle")
    page.locator("#companyName").fill(company_name)
    page.locator("#email").fill(email)
    page.locator("#password").fill(password)
    page.locator("#confirmPassword").fill(password)
    page.get_by_role("button", name="Create workspace").click()
    expect(page).to_have_url("http://127.0.0.1:5173/verify-email")

    page.get_by_label("Digit 1 of 6").press_sequentially("123456")
    page.get_by_role("button", name="Verify email").click()
    expect(page).to_have_url("http://127.0.0.1:5173/onboarding")

    # Verify the same newly-created account can start a fresh session.
    page.evaluate("localStorage.clear(); sessionStorage.clear()")
    page.goto("http://127.0.0.1:5173/login")
    page.wait_for_load_state("networkidle")
    page.locator("#orgSlug").fill("browser-test-company")
    page.locator("#email").fill(email)
    page.locator("#password").fill(password)
    page.get_by_role("button", name="Continue to StackHR").click()
    expect(page).to_have_url("http://127.0.0.1:5173/")

    browser.close()
