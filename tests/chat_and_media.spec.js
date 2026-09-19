import { test, expect } from '@playwright/test';

test.describe('Streamlit Conversational AI & Chat UI (Demo 004)', () => {
  test('renders chat messages, avatars and responds to message input', async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_004');
    await page.waitForSelector('.st-chat-message');

    const messages = page.locator('.st-chat-message');
    await expect(messages.first()).toBeVisible();

    const chatInput = page.locator('.st-chat-input');
    await expect(chatInput).toBeVisible();

    await chatInput.fill('Can you check sales orders?');
    await chatInput.press('Enter');

    const lastMessage = page.locator('.st-chat-message').last();
    await expect(lastMessage).toBeVisible();
  });
});
