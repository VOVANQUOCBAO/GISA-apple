import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { SiteHeader } from './site-header';

describe('SiteHeader keyboard behavior', () => {
  test('mobile menu exposes expanded state and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const trigger = screen.getByRole('button', { name: 'Mở menu' });

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  test('desktop submenu uses a button and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const trigger = screen.getByRole('button', {
      name: 'Mở menu Giới thiệu',
    });

    // Driven from the keyboard on purpose. The submenu now also opens on hover,
    // and `user.click()` moves the pointer first — so a click would open the menu
    // on hover and then toggle it straight back shut, which is correct behaviour
    // but tests nothing. Enter on the focused button is the path this test is
    // actually guarding: the control is a real button, operable without a mouse.
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Câu chuyện GISA' })).toBeVisible();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });
});
