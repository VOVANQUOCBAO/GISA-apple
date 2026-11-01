# Kiểm tra bố cục toàn bộ URL con — 27/10/2026

## Phạm vi

- **216 URL**: 202 URL trong `sitemap.xml` (trang chủ, 8 nhóm nội dung, toàn bộ trang chi tiết chuyên gia / dự án / bài báo / khóa học / đối tác / sáng kiến / tin tức) cộng 14 URL chức năng: 3 trang đăng ký, liên hệ, tìm kiếm, 2 landing page, 6 trang danh sách trang 2.
- Mỗi URL được kiểm tra ở **EN 1440px**, **EN 390px** và **VI 1440px** — 648 lượt tải trang tự động, cộng ảnh chụp toàn trang và kiểm tra bằng mắt.
- Chia thành **8 agent** theo nhóm nội dung; mỗi agent chạy scanner, xác minh từng phát hiện bằng ảnh chụp có viền đỏ, rồi chụp thêm 4 trang đại diện ở desktop và mobile.

## Kết quả sau khi sửa

| Hạng mục | Kết quả |
| --- | --- |
| Tràn ngang viewport | 0 |
| Chữ bị cắt bởi khung / line-clamp | 0 |
| Khối chữ lệch tâm trong section căn giữa | 0 |
| Prose EN căn giữa / căn phải ngoài ý muốn | 0 |
| Ảnh poster, banner thiết kế bị cắt chữ | 0 |
| Lỗi tải trang trong 648 lượt | 0 |

Các cảnh báo `image-crop` còn lại là **ảnh chụp/thumbnail** (chân dung chuyên gia, ảnh dự án, collage trang chủ) được crop có chủ đích — không phải artwork có chữ.

## Lỗi đã xác nhận và đã sửa

### 1. Đoạn dẫn trang Lĩnh vực hoạt động bị căn giữa từng dòng

- URL: `/gioi-thieu/linh-vuc-hoat-dong` (EN, mọi độ rộng).
- Hiện tượng: 5 dòng so le hai bên thay vì thẳng hai biên (ảnh 2 của yêu cầu).
- Sửa: bỏ `text-align: center`, dùng `justify` + `text-align-last: start` cho `.fieldsIntro`.
- File: `src/components/templates/about-static-template.module.css`.

### 2. Khung ảnh hero trong trang con cao hơn artwork

- URL: toàn bộ trang hub/static có hero (`/cong-dong`, `/cong-dong/kinh-te-ben-vung`, `/mang-luoi/doi-tac`, `/ung-dung/kinh-te-ben-vung`, `/dao-tao/gisa-core`…).
- Hiện tượng: khung 550×637 dùng `object-fit: cover` cho banner 16:9, cắt mất 28–52% chiều ngang; banner mất chữ và icon hai mép (ảnh 1 của yêu cầu).
- Sửa: khung theo đúng tỉ lệ artwork (`height: auto`, ảnh `position: static`), caption chuyển xuống dải dưới ảnh; mobile bỏ `aspect-ratio` cố định.
- File: `src/components/templates/templates.module.css`.

### 3. Hero trang chi tiết sáng kiến / tin tức cắt 65% banner

- URL: `/cong-dong/chuong-trinh-ho-tro-doanh-nghiep-chuyen-doi-xanh`, `/cong-dong/ban-do-du-lieu-ben-vung-dia-phuong`, `/cong-dong/cum-nong-nghiep-thong-minh-ben-vung`, `/cong-dong/mo-hinh-phat-trien-kinh-te-tuan-hoan-tai-dia-phuong`.
- Hiện tượng: khung 345×555 (tỉ lệ 0,62) cho banner 1,78 — tiêu đề chỉ còn “N VỮNG”, mô tả và nhãn SDG bị xén.
- Sửa: media 16:9, căn giữa, mở rộng cột ảnh (1.08fr / 0.92fr), bỏ `min-height` ép khung.
- File: `src/components/templates/ecosystem-detail-template.module.css`.

### 4. Poster khóa học trong chapter bị cắt hai bên

- URL: `/dao-tao/gisa-core` và các trang cùng template.
- Hiện tượng: khung 16:10 (1,6) cho poster 16:9 (1,78), mất chữ “Con người”, “Phát triển” ở mép.
- Sửa: `aspect-ratio: 16 / 9`.
- File: `src/components/templates/capability-static-template.module.css`.

### 5. Card sáng kiến / tin tức cắt banner

- URL: `/cong-dong`, `/cong-dong/kinh-te-ben-vung`.
- Hiện tượng: thumbnail 422×272 cắt tiêu đề “VÌ MỤC TIÊU…” và các ô icon hai mép.
- Sửa: riêng ảnh `banner-*` dùng `object-fit: contain` trong card.
- File: `src/components/templates/ecosystem-listing-template.module.css`.

### 6. Card nhóm công cụ bị cắt icon/nhãn ở 390px

- URL: 6 trang `/tu-van/cong-cu/cong-cu-*`.
- Hiện tượng: khung fallback cao 11,5rem, nội dung dài hơn nên icon bị cắt nửa trên, nhãn “TOOL GROUP” bị đẩy ra ngoài.
- Sửa: fallback `position: relative`, khung cao theo nội dung ở mobile.
- File: `src/components/templates/project-tool-detail-template.module.css`.

### 7. Landing page: trích dẫn và CTA lệch trục

- URL: `/landing-lp`.
- Hiện tượng: dấu nháy và nút căn giữa nhưng 3 dòng triết lý và câu kết lại nằm sát trái (x=64) do luật justify tiếng Anh toàn cục đè lên `text-align: center`.
- Sửa: đánh dấu các khối này `data-copy="statement"`, loại khỏi hợp đồng justify; giữ căn giữa của component.
- File: `src/app/landing-lp/landing.client.tsx`, `src/app/landing-lp/landing.module.css`, `src/app/globals.css`.

### 8. Lưới chuyên gia tiếng Việt so le

- URL: `/chuyen-gia` (VI, 1440px).
- Hiện tượng: card 1 rộng 735px nằm ngang, card 2 rộng 517px nằm dọc, các hàng cao thấp khác nhau; bản EN đã đều 623px.
- Sửa: áp dụng lưới 2 cột đều cho cả VI và EN, thống nhất tỉ lệ ảnh/chữ.
- File: `src/components/templates/expert-listing-template.module.css`.

### 9. Hợp đồng typography EN

- Cập nhật selector trong `tests/e2e/english-typography.spec.ts` để loại `[data-copy="statement"]` (trích dẫn/statement cố ý căn giữa), không nới lỏng hợp đồng cho prose thường.

## Ảnh đối chiếu

| Trước | Sau |
| --- | --- |
| `before-community-hero-cropped.png` | `after-community-hero-full.png` |
| `before-fields-intro-centered.png` | `after-fields-intro-justified.png` |
| `before-tool-card-clipped-mobile.png` | `after-tool-card-mobile.png` |
| `before-experts-vi-uneven.png` | `after-experts-vi-even.png` |
| `before-landing-statement-left.png` | `after-landing-statement-centered.png` |
| `before-course-banner-cropped.png` | `after-course-hero-full.png` |

## Ghi chú

- `/landing-lp` và `/landing-bdt` có vài khối căn phải/accordion đóng; đã kiểm tra là chủ đích, không phải lỗi.
- Citation bài báo ở 390px vẫn justify theo hợp đồng chung; một số dòng có khoảng trắng rộng do DOI/từ dài. Đây là đánh đổi typography, không phải lỗi bố cục; nếu muốn có thể chuyển riêng citation sang ragged-right.
- Ảnh chân dung chuyên gia, ảnh dự án và collage trang chủ vẫn dùng crop nghệ thuật; không cắt mất chữ.
