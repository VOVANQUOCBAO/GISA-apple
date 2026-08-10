export const EDITORIAL_EMPTY_COPY = {
  filtered: {
    description: 'Hãy thử một từ khóa khác hoặc điều chỉnh tiêu chí đang chọn.',
    title: 'Không có kết quả phù hợp',
  },
  pending: {
    description: 'Các hồ sơ đang được chuẩn bị để giới thiệu đầy đủ bối cảnh và nguồn tham chiếu.',
    title: 'Hồ sơ sẽ được bổ sung',
  },
  scope: {
    description: 'GISA sẽ bổ sung hồ sơ khi có nội dung phù hợp với phạm vi chuyên môn này.',
    title: 'Chưa có nội dung trong phạm vi này',
  },
  static: 'GISA sẽ bổ sung nội dung khi có đủ thông tin và nguồn tham chiếu phù hợp.',
} as const;
