# Admin thân thiện cho người không biết code — bản brainstorm

Mục tiêu: người quản trị nội dung (không phải lập trình viên) tự tạo/sửa nội dung bằng cách
thao tác trực tiếp trên trang, xem trước đúng như khách sẽ thấy, rồi mới đăng lên `gisa.edu.vn`.

Tài liệu này là ý tưởng + so sánh hướng đi, chưa phải đặc tả kỹ thuật.

> Bản chạy thử của hướng "xem trước trước, chọn backend sau" đã dựng xong:
> xem [admin-local.md](admin-local.md).

---

## 1. Hiện trạng (đọc từ code)

Đang tồn tại **hai hệ admin cho cùng một việc** — đăng tin tức:

| Hệ | Vị trí | Trạng thái |
|---|---|---|
| Admin PHP tự viết | `infinity-admin/` (InfinityFree + MySQL/SQLite) | Đầy đủ: đăng/sửa/ẩn/xoá, upload ảnh, panel SEO, API JSON. `NEWS_SOURCE=php` để bật |
| Sanity Studio | `studio/` + `src/sanity/` | Đã có schema, Presentation tool, draft-mode, `VisualEditing`, `data-sanity` click-to-edit. Mặc định khi `NEWS_SOURCE` trống |

Cả hai cùng ghi vào `/tin-tuc/*` của Next.js. Chỉ một cái được bật tại một thời điểm, nhưng
người quản trị có thể không biết mình đang sửa ở đâu.

### Vì sao admin PHP hiện tại khó dùng với người không biết code

| Điều đang có | Người dùng cảm thấy gì |
|---|---|
| Nội dung là danh sách "khối" (đoạn văn / H2 / H3 / danh sách / trích dẫn / ảnh), mỗi khối là một cụm ô nhập + nút ↑ ↓ × | Phải *nghĩ bằng cấu trúc* trước khi viết, giống lập trình hơn là viết bài |
| Trường ẩn `body_json`, `assetId`, `/media/inline/...` | Thuật ngữ kỹ thuật lộ ra ngoài |
| Không có xem trước. Muốn thấy kết quả phải **đăng thật**, rồi mở `/bai-viet/{slug}` (bản PHP) hoặc chờ **tới 60 giây** ISR của Next | Không dám bấm Đăng. Sửa xong không biết có đẹp không |
| Panel "Đo SEO" chấm điểm + danh sách lỗi **chặn** nút Đăng (`analysis['blocking']`) | Bị chặn bởi thứ mình không hiểu: "Chưa thể đăng: ..." |
| Rất nhiều trường cùng lúc (tiêu đề, slug, giới thiệu, SEO title, SEO description, ảnh bìa, alt, nguồn, ngày kiểm chứng…) | Quá tải, dễ bỏ qua trường quan trọng |
| Đổi slug sau khi đăng → URL cũ 404, **không có redirect tự động** | Một cú bấm làm chết link đã chia sẻ |
| Không có lịch sử phiên bản / hoàn tác | Thử nghiệm là mất bài |

Điểm mấu chốt: vấn đề không phải "giao diện xấu", mà là **thiếu vòng phản hồi**. Người viết
không nhìn thấy kết quả trước khi cam kết, và bị chặn bởi quy tắc mà họ không được giải thích.

---

## 2. "Như Canva" nên hiểu cho đúng

Canva tạo cảm giác dễ vì 5 thứ, **không phải** vì kéo thả tự do:

1. **Thao tác trực tiếp** — thấy chữ thì bấm vào chữ mà sửa, không đi tìm ô nhập ở nơi khác.
2. **Phản hồi tức thì** — mọi thay đổi hiện ra ngay, không có trạng thái "đã lưu nhưng vô hình".
3. **Tự do có giới hạn** — template và khối dựng sẵn; người dùng không thể làm ra thứ xấu/vỡ.
4. **Hoàn tác** — thử là an toàn.
5. **Xem trước / xuất bản rõ ràng** — biết chính xác cái gì sẽ ra ngoài.

### Điều **không** nên copy: canvas tự do

Kéo chữ/ảnh đặt ở toạ độ bất kỳ sẽ phá:

- **responsive** — một bố cục pixel không co giãn được cho 390px;
- **accessibility** — thứ tự đọc, heading, alt do máy dựng sẽ sai;
- **SEO** — heading/đoạn văn rời rạc, không còn cấu trúc ngữ nghĩa;
- **hợp đồng nội dung** — site chỉ nhận 5 loại block đã định nghĩa (`infinity-admin/lib/blocks.php`),
  và Next parse qua Zod, sai là fail;
- **bảo trì** — mỗi lần đổi thiết kế phải migrate dữ liệu canvas.

Mục tiêu đúng là: **WYSIWYG trên trang thật** — chỉnh sửa trực tiếp trên bản render của
chính component sẽ dùng ở production, trong khuôn khổ template + thư viện khối.

---

## 3. Ba hướng đi

### A. Nâng cấp admin PHP (thêm preview + sửa trực tiếp)

Giữ nguyên hosting InfinityFree, thêm iframe xem trước trỏ về Next, thêm overlay
contenteditable.

- Ưu: không thêm nhà cung cấp, không đổi hạ tầng, admin quen thuộc.
- Nhược: phải tự viết rich text, drag-drop, undo bằng PHP + JS thuần; rất khó để "mượt như Canva";
  dễ lệch giữa bản preview PHP và bản Next; giới hạn hosting (inode 97%, không websocket, không Node).
- Công: trung bình–lớn, và **trần phát triển thấp**.

### B. Sanity Studio + Presentation (đã có ~70%)

Trong repo đã dựng: schema `post`, `presentationTool`, `previewUrl` với draft-mode,
`VisualEditing` + `createDataAttribute` để bấm vào chữ trên trang thật mà sửa,
`PreviewRefresh`.

- Ưu: đúng mô hình mong muốn **có sẵn**: sửa trên trang, draft ≠ published, nút Publish,
  lịch sử phiên bản, undo, hotspot/crop ảnh, phân quyền, preview mobile. Miễn phí ở mức dùng của GISA.
- Nhược: UI phần lớn tiếng Anh; schema hiện **quá mỏng** so với hợp đồng frontend (thiếu
  `seo`, `publishedAt`, `evidenceStatus`, `sourceUrl/Label`, `checkedAt`, `tags`, `body` chưa map
  đủ block); người dùng vẫn phải học một công cụ mới; phải deploy studio, cấu hình token, CORS.
- Công: nhỏ–trung bình để đạt chất lượng dùng thật (schema + tiếng Việt hoá nhãn + quyền + test preview).

### C. Admin riêng trong Next.js (`/admin`) + database

Rich text (Lexical/Tiptap), block kéo thả, preview **cùng cây React** (không iframe), publish ghi
DB rồi `revalidateTag`.

- Ưu: một codebase, giao diện đồng bộ thương hiệu, kiểm soát 100%, mở đường cho sửa cả trang chủ.
- Nhược: nhiều việc nhất: auth, DB (Postgres/KV), lưu ảnh, lịch sử, bảo mật, rate limit. Tính bằng
  tuần–tháng, không phải ngày.
- Công: lớn, nhưng **trần cao nhất**.

### So sánh nhanh

| | A. PHP + preview | B. Sanity | C. Admin trong Next |
|---|---|---|---|
| Thời gian tới "dùng được" | 2–3 tuần | 1–2 tuần | 6–10 tuần |
| Cảm giác "Canva" | 3/5 | 4/5 | 5/5 |
| Chi phí hạ tầng | 0 | 0 → ~$15/tháng | Vercel + DB |
| Sửa được trang chủ / trang tĩnh | Không | Có (cần schema mới) | Có |
| Rủi ro lệch preview | Cao | Thấp (render thật) | Rất thấp |
| Bảo trì lâu dài | Nặng | Nhẹ (SaaS lo) | Trung bình |

### Đề xuất

1. **Chốt một nguồn dữ liệu duy nhất.** Hai admin cùng ghi tin tức là nguồn gốc của mọi lẫn lộn.
2. **Xây lớp xem trước trước, backend sau.** Preview là thứ tạo ra 80% cảm giác "dễ dùng",
   và nó độc lập với việc chọn A, B hay C.
3. Nếu mục tiêu chỉ là tin tức: đi **B** (tận dụng phần đã có), giữ PHP làm kho lưu trữ.
4. Nếu mục tiêu là admin sửa được **cả trang chủ, trang giới thiệu…**: đi **C**, và làm theo giai đoạn.

---

## 4. Kiến trúc đề xuất: preview-first

Nguyên tắc duy nhất: **chỉ có một renderer**. Bản xem trước phải dùng đúng component mà
production dùng, nếu không "WYSIWYG" sẽ nói dối.

```
┌─────────────────────┐        lưu nháp (JSON)        ┌──────────────────────────┐
│  Admin (PHP/Sanity) │ ────────────────────────────► │ Draft store (MySQL/Sanity)│
│  panel + toolbar    │ ◄──── postMessage / poll ───── │                           │
└─────────┬───────────┘                               └────────────┬──────────────┘
          │ iframe (token ngắn hạn, noindex)                       │
          ▼                                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Next.js  /xem-truoc/[...]  → cùng TemplateRouter + EcosystemDetailTemplate   │
│ - đọc draft qua token, không đọc published                                   │
│ - revalidate = 0, robots: noindex                                            │
│ - overlay: viền khối, tay cầm kéo, nút "+", thanh "Bản nháp / Đăng"           │
└──────────────────────────────────────────────────────────────────────────────┘
```

Hệ quả quan trọng:

- **Preview thuộc về Next, không thuộc PHP.** PHP chỉ giữ dữ liệu và API; Next render.
- Bản nháp và bản đã đăng dùng **cùng một schema JSON** → không có chuyện "preview khác thật".
- Chia sẻ link duyệt: token có hạn (24h), mở được trên điện thoại, không cần tài khoản.
  Đây là tính năng có giá trị lớn với tổ chức: gửi link cho lãnh đạo duyệt thay vì họp.
- Ảnh preview tải từ cùng nguồn `/media` (đã có `CONTENT_MEDIA_ORIGIN`).

---

## 5. Giao diện đề xuất

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ GISA  •  Tin tức › Hội thảo Mekong 2026        [Lưu nháp ✓ 2 giây trước]      │
│                                    [🖥][📱]  [Xem trước]  [Đăng ▾]  [⋯]      │
├────────────┬───────────────────────────────────────────────┬─────────────────┤
│ + Thêm mới │                                               │ ĐANG CHỌN       │
│            │   ┌─────────────────────────────────────┐     │ ┌─ Tiêu đề ───┐ │
│ ▸ Bài viết │   │  Hội thảo quốc tế về thương mại     │     │ │ Kiểu: H1 ▾  │ │
│ ▸ Trang    │   │  nông sản bền vững tại Mekong       │     │ └─────────────┘ │
│ ▸ Media    │   │  ─────────────────────────────────  │     │ ┌─ Đoạn văn ──┐ │
│            │   │  Ngày 12/10, tại Cần Thơ…           │     │ │ [nội dung]  │ │
│ ────────── │   │                                     │     │ └─────────────┘ │
│ Bản nháp 3 │   │  ▢ Ảnh: hội thảo (bấm để đổi)       │     │ ┌─ Ảnh ───────┐ │
│ Đã đăng 12 │   │                                     │     │ │ Mô tả ảnh   │ │
│            │   └─────────────────────────────────────┘     │ │ Crop/Focus  │ │
│            │        ↑ hover: viền + tay cầm ⋮⋮ + nút ＋    │ └─────────────┘ │
├────────────┴───────────────────────────────────────────────┴─────────────────┤
│ Trạng thái: Nháp • Có 2 thay đổi chưa đăng    ✓ Tiêu đề  ✓ Ảnh  ! Mô tả ảnh  │
└──────────────────────────────────────────────────────────────────────────────┘
```

Bốn thành phần làm nên sự "thân thiện":

1. **Bấm vào đâu sửa ở đó** — chữ trên preview là `contenteditable`; gõ trực tiếp. Không cần
   hiểu "khối" là gì.
2. **Bảng phải chỉ hiện thứ đang chọn** — không bày 15 trường cùng lúc.
3. **Phản hồi tức thì** — autosave 2 giây, chấm "đã lưu", không có nút Lưu nào để quên.
4. **Đăng là một hành động có xác nhận** — hiện đúng những gì thay đổi (tiêu đề, ảnh, URL),
   kèm câu "sẽ hiển thị sau ~60 giây", và luôn có **Hoàn tác**.

Thêm hai chi tiết nhỏ nhưng đổi cảm nhận:

- **Thư viện khối có hình thu nhỏ** (Đoạn văn, Tiêu đề mục, Danh sách, Trích dẫn, Ảnh, Ảnh + chú thích).
  Người dùng chọn bằng mắt, không bằng tên.
- **Chế độ "chọn – soi"**: bấm một khối trên preview thì panel phải nhảy tới đúng trường và
  ngược lại. Đây là 80% cảm giác Canva với 20% công sức, và có thể làm **trước** khi làm
  contenteditable thật.

---

## 6. Luồng đăng bài cho người không biết code

1. **Tạo** → chọn "Tin tức", nhập tiêu đề. Slug, SEO title, ngày đăng **tự sinh**; người dùng
   không phải quyết định gì cả.
2. **Viết** → gõ thẳng trên trang. Enter = đoạn mới. Gõ `/` = chèn khối. Kéo `⋮⋮` = đổi thứ tự.
3. **Ảnh** → kéo ảnh vào vị trí; tự nén, tự lấy kích thước, hỏi mô tả ảnh bằng một câu tiếng Việt
   ("Ảnh này cho người khiếm thị biết điều gì?").
4. **Xem** → nút Desktop/Mobile ngay trên thanh công cụ; số liệu hiển thị y như thật.
5. **Kiểm tra** → một danh sách ngắn, mỗi mục là một câu + nút "Sửa ngay":
   - "Tiêu đề dài 71 ký tự, Google sẽ cắt ở ~60" → [Rút gọn]
   - "Ảnh chưa có mô tả" → [Thêm mô tả]
   - "Chưa ghi nguồn kiểm chứng" → [Thêm nguồn]
   Không có điểm số trừu tượng, không có lỗi chặn mà không kèm cách sửa.
6. **Đăng** → hộp thoại xác nhận ngắn: "Bài sẽ xuất hiện tại `/tin-tuc/…` sau ~60 giây." →
   toast có [Xem trên web] và [Hoàn tác].
7. **Duyệt (tuỳ chọn)** → gửi link xem trước; người duyệt bấm "Duyệt" hoặc để lại ghi chú.

---

## 7. Từ điển: thuật ngữ kỹ thuật → ngôn ngữ người dùng

| Trong code | Hiển thị cho người dùng |
|---|---|
| block / body_json | "Đoạn nội dung" (không nhắc chữ JSON) |
| slug | "Đường dẫn" — kèm "Tự động tạo, chỉ sửa khi thật cần" |
| meta description | "Mô tả hiện trên Google" |
| alt | "Mô tả ảnh" + ví dụ |
| seo_score | "Mức độ sẵn sàng" (3 mức: Cần bổ sung / Ổn / Tốt) |
| evidenceStatus | "Nguồn thông tin" — 2 lựa chọn + ô dán link |
| assetId / media path | Ẩn hoàn toàn |
| draft / hidden | "Bản nháp" / "Đã ẩn" |
| revalidate 60s | "Lên sóng trong khoảng 1 phút" |

---

## 8. Lộ trình đề xuất

| Giai đoạn | Nội dung | Công | Giá trị |
|---|---|---|---|
| **0 — Dọn chướng ngại** | Đổi nhãn theo bảng trên; trợ giúp tại chỗ; lỗi kèm nút sửa; autosave nháp; "Xem bản nháp" (mở bản PHP); lịch sử phiên bản + hoàn tác; redirect tự động khi đổi slug | 0,5–1 tuần | Cao, rẻ nhất |
| **1 — Xem trước thật** | Route `/xem-truoc` dùng đúng template; token; iframe trong admin; chuyển Desktop/Mobile; tự refresh khi gõ; nút Đăng kèm xác nhận | 1,5–2 tuần | **Cao nhất** |
| **2 — Sửa trực tiếp** | Chọn–soi hai chiều; contenteditable; kéo thả khối; `/` chèn; crop/focal ảnh; hoàn tác | 3–4 tuần | Cao |
| **3 — Cả website** | Trang chủ + trang tĩnh theo **section dựng sẵn** (hero, số liệu, danh sách card, CTA); lịch đăng; phân quyền biên tập/duyệt | 4–6 tuần | Cao, đổi kiến trúc |
| **4 — Vòng vận hành** | Link duyệt cho lãnh đạo; ghi chú trên preview; kiểm tra link hỏng; nhắc bài cũ thiếu nguồn; thống kê đọc | 2–3 tuần | Trung bình |

Điểm cần nhấn: **giai đoạn 0 và 1 độc lập với việc chọn backend**. Có thể làm ngay, và nếu sau này
đổi từ PHP sang Sanity hay admin mới thì vẫn giữ nguyên.

---

## 9. Nguyên tắc để admin không tự phá website

- **Không kéo thả tự do.** Chỉ đổi thứ tự và chọn trong thư viện khối. Đây là điều bảo vệ
  responsive, accessibility và hợp đồng nội dung.
- **Không cho chọn màu/font tuỳ ý.** Chỉ 3 cấp tiêu đề và 3 cỡ ảnh (nhỏ / vừa / toàn chiều rộng),
  map vào đúng CSS sẵn có.
- **Đổi slug → tự tạo redirect 301.** Người dùng không thể làm chết một URL.
- **Ảnh thiếu mô tả là lỗi mềm**, hiện ngay tại ảnh, không phải lỗi chặn ở cuối trang.
- **Lưu nháp trước, kiểm tra sau.** Không bao giờ để người dùng mất bài vì một quy tắc SEO.
- **Mọi kiểm tra chạy trên bản nháp**, hiện ngay khi gõ — không dồn về lúc bấm Đăng.

---

## 10. Rủi ro cần biết trước

| Rủi ro | Cách giảm |
|---|---|
| Hai admin ghi cùng dữ liệu | Chốt một nguồn; cái còn lại chuyển read-only hoặc xoá |
| Preview lệch bản thật | Chỉ dùng một renderer; test tự động so preview với production |
| `contenteditable` phá accessibility / tiếng Việt | Giữ mô hình block bên dưới; test bàn phím; test dấu tiếng Việt |
| Hosting InfinityFree giới hạn (inode, không Node, không websocket) | Preview chạy trên Vercel, PHP chỉ là API |
| Người dùng vẫn sợ vì tiếng Anh | Việt hoá nhãn + video 3 phút + một buổi hướng dẫn |
| Sửa cả website cần schema mới | Làm giai đoạn 3 sau khi giai đoạn 1–2 đã ổn định |

---

## 11. Cần chốt trước khi làm

1. **Admin nào là nguồn thật?** PHP (InfinityFree) hay Sanity, hay sẽ xây mới trong Next?
2. **Phạm vi**: chỉ tin tức, hay cả trang chủ + trang tĩnh? (Quyết định kiến trúc.)
3. **Ai đăng bài**: một người, hay có biên tập + người duyệt? (Quyết định có cần workflow.)
4. **Ngân sách hạ tầng**: ở lại gói miễn phí, hay chấp nhận ~$15/tháng cho SaaS?
5. **Ưu tiên trước mắt**: chỉ cần "xem trước rồi đăng" cho an tâm, hay cần "sửa tay như Canva" ngay?
