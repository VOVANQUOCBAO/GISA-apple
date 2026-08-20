import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { RisesFoldPanorama, type RiseValue } from './rises-fold-panorama';

const values: RiseValue[] = [
  { code: 'R', color: '#087d86', label: 'Reliability', text: 'Tin cậy.' },
  { code: 'I', color: '#68a92d', label: 'Innovation', text: 'Đổi mới.' },
  { code: 'S', color: '#4a94df', label: 'Science', text: 'Khoa học.' },
  { code: 'E', color: '#f07b22', label: 'Efficiency', text: 'Hiệu quả.' },
  { code: 'S', color: '#35a657', label: 'Sustainability', text: 'Bền vững.' },
];

describe('RisesFoldPanorama', () => {
  test('renders one centered pictogram for each RISES value', () => {
    const { container } = render(<RisesFoldPanorama values={values} />);

    expect(container.querySelectorAll('button svg')).toHaveLength(5);
  });

  test('shows detail only while a panel is previewed', () => {
    render(<RisesFoldPanorama values={values} />);

    const science = screen.getByRole('button', { name: /03\. Science/ });
    expect(document.querySelector('[data-active="true"]')).toBeNull();

    fireEvent.mouseEnter(science);
    expect(science).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(science);
    expect(document.querySelector('[data-active="true"]')).toBeNull();
  });

  test('opens a selected fold and supports arrow-key navigation', () => {
    render(<RisesFoldPanorama values={values} />);

    const innovation = screen.getByRole('button', { name: /02\. Innovation/ });
    const science = screen.getByRole('button', { name: /03\. Science/ });
    const efficiency = screen.getByRole('button', { name: /04\. Efficiency/ });

    expect(innovation).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(science);
    expect(science).toHaveAttribute('aria-pressed', 'true');
    expect(innovation).toHaveAttribute('aria-pressed', 'false');

    fireEvent.keyDown(science, { key: 'ArrowRight' });
    expect(efficiency).toHaveAttribute('aria-pressed', 'true');
    expect(science).toHaveAttribute('aria-pressed', 'false');
  });
});
