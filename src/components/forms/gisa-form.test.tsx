import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GisaForm } from './gisa-form';
import { SimulatedFormAdapter } from './simulated-form-adapter';
import type { FormSubmissionAdapter } from './form-types';

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Họ và tên/), 'Nguyễn An');
  await user.type(screen.getByLabelText(/^Email/), 'an@example.com');
  await user.type(
    screen.getByLabelText(/^Nội dung/),
    'Tôi muốn tìm hiểu thêm thông tin từ GISA.',
  );
  await user.click(
    screen.getByLabelText(/Tôi xác nhận thông tin đã cung cấp là chính xác/i),
  );
}

test('empty submit focuses error summary and does not claim real delivery', async () => {
  const user = userEvent.setup();
  render(<GisaForm kind="tu-van" adapter={new SimulatedFormAdapter(0)} />);

  await user.click(
    screen.getByRole('button', { name: 'Kiểm tra thông tin' }),
  );

  const summary = screen.getByRole('alert');
  expect(summary).toHaveFocus();
  expect(summary).toHaveTextContent('Vui lòng kiểm tra các trường');
  expect(document.body).not.toHaveTextContent('đã gửi tới GISA');
});

test('empty partnership submit includes the required organization error', async () => {
  const user = userEvent.setup();
  render(<GisaForm kind="hop-tac" adapter={new SimulatedFormAdapter(0)} />);

  await user.click(
    screen.getByRole('button', { name: 'Kiểm tra thông tin' }),
  );

  expect(
    screen.getByRole('link', { name: 'Vui lòng nhập tên tổ chức.' }),
  ).toHaveAttribute('href', '#organization');
});

test('connects field errors and requires an organization for partnership', async () => {
  const user = userEvent.setup();
  render(<GisaForm kind="hop-tac" adapter={new SimulatedFormAdapter(0)} />);

  await user.type(screen.getByLabelText(/^Họ và tên/), 'Nguyễn An');
  await user.type(screen.getByLabelText(/^Email/), 'khong-hop-le');
  await user.type(screen.getByLabelText(/Số điện thoại/), '123');
  await user.type(screen.getByLabelText(/^Nội dung/), 'Nội dung hợp lệ để thử.');
  await user.click(
    screen.getByLabelText(/Tôi xác nhận thông tin đã cung cấp là chính xác/i),
  );
  await user.click(
    screen.getByRole('button', { name: 'Kiểm tra thông tin' }),
  );

  expect(screen.getByLabelText(/^Email/)).toHaveAccessibleDescription(
    'Vui lòng nhập địa chỉ email hợp lệ.',
  );
  expect(screen.getByLabelText(/Số điện thoại/)).toHaveAccessibleDescription(
    'Số điện thoại phải có 8–20 ký tự hợp lệ.',
  );
  expect(screen.getByLabelText(/^Tổ chức/)).toHaveAccessibleDescription(
    'Vui lòng nhập tên tổ chức.',
  );
  expect(
    screen.getByRole('link', { name: 'Vui lòng nhập tên tổ chức.' }),
  ).toHaveAttribute('href', '#organization');
});

test('announces pending and simulated success without a real-delivery claim', async () => {
  let resolveSubmission!: (value: { status: 'simulated_success' }) => void;
  const adapter: FormSubmissionAdapter = {
    submit: () =>
      new Promise((resolve) => {
        resolveSubmission = resolve;
      }),
  };
  const user = userEvent.setup();
  render(<GisaForm kind="lien-he" adapter={adapter} />);
  await fillValidForm(user);

  await user.click(
    screen.getByRole('button', { name: 'Kiểm tra thông tin' }),
  );
  expect(
    screen.getByRole('button', { name: 'Đang kiểm tra…' }),
  ).toBeDisabled();

  resolveSubmission({ status: 'simulated_success' });
  expect(
    await screen.findByText(
      'Đã kiểm tra thông tin. Bạn có thể rà soát lại các trường trước khi rời trang.',
    ),
  ).toBeVisible();
});

test('shows the simulated error state for the reserved error email', async () => {
  const user = userEvent.setup();
  render(<GisaForm kind="tu-van" adapter={new SimulatedFormAdapter(0)} />);
  await user.type(screen.getByLabelText(/^Họ và tên/), 'Nguyễn An');
  await user.type(
    screen.getByLabelText(/^Email/),
    'an@simulate-error.invalid',
  );
  await user.type(
    screen.getByLabelText(/^Nội dung/),
    'Tôi muốn kiểm tra trạng thái lỗi mô phỏng.',
  );
  await user.click(
    screen.getByLabelText(/Tôi xác nhận thông tin đã cung cấp là chính xác/i),
  );
  await user.click(
    screen.getByRole('button', { name: 'Kiểm tra thông tin' }),
  );

  expect(
    await screen.findByText(
      'Không thể hoàn tất thao tác. Vui lòng kiểm tra thông tin và thử lại.',
    ),
  ).toBeVisible();
});
