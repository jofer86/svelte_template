import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('authentication - should show login form', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});

test('authentication - should show register form', async ({ page }) => {
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page.url()).toContain('/register');
});

test('authentication - should show error on invalid login', async ({ page }) => {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('wrongpassword');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});