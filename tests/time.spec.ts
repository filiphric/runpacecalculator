import { test, expect } from '@playwright/test';

test.describe('Running Pace Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('calculates time for 5:00 pace and 10 km distance', async ({ page }) => {
    await page.getByTestId('pace-input').pressSequentially('500');
    await page.getByTestId('distance-input').pressSequentially('10')
    await expect(page.getByTestId('time-output')).toHaveText('50:00');
  });

  test('calculates time for 10:05 pace and 11 km distance', async ({ page }) => {
    await page.getByTestId('pace-input').fill('1005');
    await page.getByTestId('distance-input').fill('11');
    await expect(page.getByTestId('time-output')).toHaveText('1:50:55');
  });

  test('calculates time for 4:50 pace and 2 km distance', async ({ page }) => {
    await page.getByTestId('pace-input').fill('450');
    await page.getByTestId('distance-input').fill('2');
    await expect(page.getByTestId('time-output')).toHaveText('9:40');
  });

  test('shifts focus from pace to distance field when tab is pressed', async ({ page }) => {
    await page.getByTestId('pace-input').focus();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('distance-input')).toBeFocused();
  });
});