import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GisaForm } from './gisa-form';
import type { FormSubmissionAdapter } from './form-types';

async function fillValidProfessionalForm(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.type(screen.getByLabelText(/^Họ và tên/), 'Nguyễn An');
  await user.type(screen.getByLabelText(/^Email/), 'an@example.com');
  await user.type(screen.getByLabelText(/^Số điện thoại/), '0818711799');
  await user.type(screen.getByLabelText(/^Tổ chức/), 'Công ty An Việt');
  await user.type(screen.getByLabelText(/^Chức vụ/), 'Giám đốc');
  await user.type(screen.getByLabelText(/^Ngành nghề/), 'Giáo dục');
  await user.type(
    screen.getByLabelText(/^Nội dung/),
    'Tôi muốn tìm hiểu thêm thông tin từ GISA.',
  );
  await user.click(screen.getByLabelText(/đồng ý để GISA/i));
}

test('empty submit focuses error summary and does not claim delivery', async () => {
  const user = userEvent.setup();
  const adapter: FormSubmissionAdapter = {
    submit: async () => ({ message: 'Đã nhận.', status: 'success' }),
  };
  render(<GisaForm kind="lien-he" adapter={adapter} />);

  await user.click(screen.getByRole('button', { name: 'Gửi thông tin' }));

  const summary = screen.getByRole('alert');
  expect(summary).toHaveFocus();
  expect(summary).toHaveTextContent('Vui lòng kiểm tra các trường');
  expect(document.body).not.toHaveTextContent('Đã nhận.');
});

test('contact and partnership require professional organization details', async () => {
  const user = userEvent.setup();
  render(<GisaForm kind="hop-tac" />);

  await user.click(screen.getByRole('button', { name: 'Gửi thông tin' }));

  expect(
    screen.getByRole('link', { name: 'Vui lòng nhập tên tổ chức.' }),
  ).toHaveAttribute('href', '#organization');
  expect(
    screen.getByRole('link', { name: 'Vui lòng nhập số điện thoại.' }),
  ).toHaveAttribute('href', '#phone');
  expect(
    screen.getByRole('link', { name: 'Vui lòng nhập chức vụ.' }),
  ).toHaveAttribute('href', '#jobTitle');
  expect(
    screen.getByRole('link', { name: 'Vui lòng nhập ngành nghề.' }),
  ).toHaveAttribute('href', '#industry');
});

test('connects field errors to invalid inputs', async () => {
  const user = userEvent.setup();
  render(<GisaForm kind="hop-tac" />);

  await user.type(screen.getByLabelText(/^Họ và tên/), 'Nguyễn An');
  await user.type(screen.getByLabelText(/^Email/), 'khong-hop-le');
  await user.type(screen.getByLabelText(/Số điện thoại/), '123');
  await user.type(screen.getByLabelText(/^Nội dung/), 'Nội dung hợp lệ để thử.');
  await user.click(screen.getByLabelText(/đồng ý để GISA/i));
  await user.click(screen.getByRole('button', { name: 'Gửi thông tin' }));

  expect(screen.getByLabelText(/^Email/)).toHaveAccessibleDescription(
    'Vui lòng nhập địa chỉ email hợp lệ.',
  );
  expect(screen.getByLabelText(/Số điện thoại/)).toHaveAccessibleDescription(
    'Số điện thoại phải có 8–20 ký tự hợp lệ.',
  );
  expect(screen.getByLabelText(/^Tổ chức/)).toHaveAccessibleDescription(
    'Vui lòng nhập tên tổ chức.',
  );
});

test('announces pending and success only after the adapter succeeds', async () => {
  let resolveSubmission!: (value: {
    message: string;
    status: 'success';
  }) => void;
  const adapter: FormSubmissionAdapter = {
    submit: () =>
      new Promise((resolve) => {
        resolveSubmission = resolve;
      }),
  };
  const user = userEvent.setup();
  render(<GisaForm kind="lien-he" adapter={adapter} />);
  await fillValidProfessionalForm(user);

  await user.click(screen.getByRole('button', { name: 'Gửi thông tin' }));
  expect(screen.getByRole('button', { name: 'Đang gửi…' })).toBeDisabled();

  resolveSubmission({ message: 'GISA đã tiếp nhận thông tin của bạn.', status: 'success' });
  expect(
    await screen.findByText('GISA đã tiếp nhận thông tin của bạn.'),
  ).toBeVisible();
});

test('keeps entered data when delivery fails', async () => {
  const adapter: FormSubmissionAdapter = {
    submit: async () => ({
      message: 'Kênh tiếp nhận trực tuyến chưa được cấu hình.',
      status: 'error',
    }),
  };
  const user = userEvent.setup();
  render(<GisaForm kind="lien-he" adapter={adapter} />);
  await fillValidProfessionalForm(user);

  await user.click(screen.getByRole('button', { name: 'Gửi thông tin' }));

  expect(
    await screen.findByText('Kênh tiếp nhận trực tuyến chưa được cấu hình.'),
  ).toBeVisible();
  expect(screen.getByLabelText(/^Email/)).toHaveValue('an@example.com');
  expect(screen.getByLabelText(/^Nội dung/)).toHaveValue(
    'Tôi muốn tìm hiểu thêm thông tin từ GISA.',
  );
});

test('course enquiry does not require professional profile or a message', async () => {
  const adapter: FormSubmissionAdapter = {
    submit: async () => ({ message: 'Đã tiếp nhận.', status: 'success' }),
  };
  const user = userEvent.setup();
  render(<GisaForm kind="khoa-hoc" adapter={adapter} />);

  await user.type(screen.getByLabelText(/^Họ và tên/), 'Học Viên');
  await user.type(screen.getByLabelText(/^Email/), 'hocvien@example.com');
  await user.type(screen.getByLabelText(/^Số điện thoại/), '0818711799');
  await user.click(screen.getByLabelText(/đồng ý để GISA/i));
  await user.click(screen.getByRole('button', { name: 'Gửi thông tin' }));

  expect(await screen.findByText('Đã tiếp nhận.')).toBeVisible();
  expect(screen.getByLabelText(/^Tổ chức/)).not.toBeRequired();
  expect(screen.getByLabelText(/^Nội dung/)).not.toBeRequired();
});
