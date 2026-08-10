# Admin Claude Instructions
> Version: 1.0 (Tripora - Booking Platform, Admin/Partner-facing)

Tài liệu quy định toàn bộ tiêu chuẩn phát triển cho app **`admin/`** của dự án Tripora — Next.js độc lập dùng chung Backend API (`backend/`) với `frontend/`, phục vụ **Admin** (vận hành hệ thống) và **Partner** (quản lý dịch vụ của chính mình). AI phải tuân thủ cả tài liệu `.claude/` gốc (ưu tiên theo thứ tự: Business Rules -> Architecture -> admin/CLAUDE.md -> Coding Style -> Folder Structure), chỉ tài liệu này bổ sung các quy tắc riêng cho `admin/`.

## 1. PHẠM VI & ĐỐI TƯỢNG SỬ DỤNG
- **2 nhóm người dùng dùng chung 1 app**, phân biệt bằng Role đăng nhập (`ADMIN`/`SUPER_ADMIN` vs `PARTNER`) — UI ẩn/hiện menu theo Role, Backend luôn là nơi kiểm tra quyền thật (403 nếu vượt quyền).
- **Admin**: Duyệt/từ chối Partner (`verification.status`), duyệt/từ chối Property/Product trước khi publish (`status`), quản lý Booking (xem/hủy/hỗ trợ refund), quản lý Coupon, quản lý Commission/Payout, quản lý User (khóa/mở), xem Activity Log & báo cáo (theo `Database_and_workflows.md` mục 42 - Admin Workflow).
- **Partner**: Quản lý hồ sơ Partner của chính mình, CRUD Property/Room/Product/Restaurant/Vehicle thuộc `partnerId` của mình (submit chờ Admin duyệt, không tự publish thẳng), xem Booking/doanh thu/Commission/Payout liên quan tới mình, trả lời Review/Chat với Traveler.
- **KHÔNG** xây lại tính năng dành cho Traveler ở đây (tìm kiếm/đặt Property, tạo Trip, Wishlist cá nhân... thuộc `frontend/`).

## 2. TECH STACK & FRAMEWORK
Giống hệt `frontend/` để tái sử dụng kinh nghiệm dev: React, Next.js (App Router, cấm Pages Router/API Route riêng), TypeScript strict-mode (cấm `any`/`as`), Tailwind CSS, Redux Toolkit, RTK Query, React Hook Form, Zod, shadcn/ui. Ưu tiên component dạng Table/Form quản trị (Data Table có filter/sort/pagination, Approve/Reject Dialog có lý do từ chối).

## 3. STATE MANAGEMENT & API CALLS
- **Server Data**: RTK Query, tách API theo domain quản trị (`features/partner-verification/api`, `features/property-approval/api`...). Cấm gọi trực tiếp API Traveler không cần thiết cho tác vụ quản trị.
- **Global UI State**: Redux Toolkit chỉ dùng cho Auth (session Admin/Partner), Theme, Sidebar, Modal xác nhận (Approve/Reject/Suspend).
- Không dùng chung Redux Store/RTK Query cache với `frontend/` (2 app độc lập, chỉ dùng chung backend REST API).

## 4. BUSINESS LOGIC & PHÂN QUYỀN (QUAN TRỌNG NHẤT Ở APP NÀY)
- Mọi action nhạy cảm (Approve Partner, Approve Property/Product, Force Cancel Booking, Refund thủ công, khóa User) phải có Dialog xác nhận + ghi rõ lý do khi Reject/Suspend (Backend lưu vào Activity Log — theo `business-rules.md` mục 5).
- Route/menu phải guard theo Role ngay ở Frontend (UX), nhưng KHÔNG được coi đó là lớp bảo mật — mọi API vẫn phải tự kiểm tra quyền ở Backend (403 nếu vượt quyền), tuyệt đối không tin dữ liệu Role đọc từ JWT decode phía client để hiện dữ liệu nhạy cảm mà chưa gọi API xác thực.
- Partner chỉ được thấy/thao tác dữ liệu thuộc `partnerId` của chính mình — mọi danh sách (Property/Booking/Commission...) phải filter theo Partner đang đăng nhập, không hiển thị dropdown "xem Partner khác" (đó là đặc quyền của Admin).

## 5. UX & PERFORMANCE
- Ưu tiên Data Table hiệu năng tốt (pagination server-side, không tải hết dữ liệu về Client) cho danh sách Booking/User/Partner có thể rất lớn.
- Đầy đủ Loading/Empty/Error State cho mọi bảng và form duyệt. Toast thông báo rõ kết quả Approve/Reject/thao tác hàng loạt.
- CẤM: Axios, gọi API trực tiếp trong UI, hardcode Role/Permission, tự tính lại Commission/Payout ở Frontend (luôn lấy số liệu tính sẵn từ Backend).

## 6. DOD (DEFINITION OF DONE)
Build thành công; không lỗi TS/ESLint; Responsive (ít nhất Desktop — Admin/Partner chủ yếu dùng màn lớn, Mobile là tối ưu thêm không bắt buộc như `frontend/`); đủ UI State; đúng phân quyền theo `business-rules.md`; không đổi code ngoài phạm vi; cập nhật CHANGELOG.md và PROJECT_STATUS.md.

## 7. DESIGN SYSTEM (ADMIN DASHBOARD REFERENCE)
> Phân tích từ ảnh reference phong cách "Dark Sidebar Admin Dashboard" (Sidebar tối cố định, vùng nội dung sáng, card bo lớn kèm biểu đồ/bảng dữ liệu dày đặc). **Chỉ lấy bố cục/tỉ lệ/thành phần UI làm tham chiếu — KHÔNG copy tên thương hiệu/logo/màu trong ảnh, giữ nguyên "Tripora Admin".** Màu sắc thực tế lấy từ logo chính thức (navy `#14365C` + teal `#0C8788`, xem 7.4), không phải màu đỏ trong ảnh reference gốc. Áp dụng cho toàn bộ layout `admin/` (Dashboard, Partner/Property Approval, Booking Management, Reports...). Biến CSS khai báo tại `:root` (Light, mặc định) và `.dark` (Dark) trong `src/app/globals.css`, đúng convention shadcn/ui — riêng token Sidebar là ngoại lệ cố định, xem 7.3.

### 7.1 Layout Tổng Quan
- **Sidebar** (trái, cố định, luôn tối — xem 7.3): logo (`shared/components/logo.tsx`, dùng `public/logo-icon.png`) + icon brand navy, ô Search, menu chia nhóm bằng label nhỏ viết hoa/muted (ví dụ: *Member Management*, *Booking Management*, *Financial*, *Administration*), mỗi item = icon + label, item active có nền navy-tối (`--sidebar-active`, tint tối của `--sidebar-primary`) bo `--radius-md`. Nút **Logout** cố định cuối Sidebar, dạng outline pill màu `--primary` (navy).
- **Header** (trên, theo theme): breadcrumb/tiêu đề trang bên trái; bên phải: bộ lọc ngày, icon trạng thái kết nối/hỗ trợ, chuông Notification (badge số), avatar + tên + Role ("Admin"/"Partner").
- **Content Area** (theo theme): nền `--background`, gồm nhiều Card trắng/tối xếp lưới — mỗi Card có: icon badge tròn nhỏ (nền tint `--primary`) + tiêu đề bên trái, dãy số liệu tổng hợp dạng `label: value` bên phải (ví dụ `Total Members  1225   Active  900   Inactive  200`), bên dưới là biểu đồ hoặc bảng dữ liệu.

### 7.2 Border Radius Scale
| Token | ~Px | Dùng cho |
| :--- | :--- | :--- |
| `--radius-sm` | 8px | input, icon-button nhỏ trong Header |
| `--radius-md` | 12px | Sidebar item active, badge icon tròn trong Card |
| `--radius-lg` (base) | 14px | Stat/Chart Card, Data Table container |
| `--radius-xl` | 18px | Card lớn gộp nhiều biểu đồ (ví dụ khối "Sessions") |
| `rounded-full` (Tailwind) | 9999px | Status Badge/Pill, Avatar, nút Logout, nút Search icon |

### 7.3 Background & Surface
- **Sidebar**: **cố định tối ở cả Light/Dark/System** (không đổi theo theme — là chrome thương hiệu, giống cách `frontend/` cố định Hero/Trusted-by, xem `frontend/CLAUDE.md` mục 6.2) — nền gần đen (`#0D0D10`), text item thường màu xám nhạt, label nhóm màu xám mờ hơn nữa.
- **Light** (mặc định, khớp ảnh mẫu): Content Area nền xám rất nhạt (`--background`), Card nền trắng đặc + shadow rất nhẹ, không glassmorphism.
- **Dark** (suy luận theo tông thương hiệu, ảnh mẫu không có ví dụ Dark thật): Content Area nền tối (gần màu Sidebar nhưng có thể nhỉnh sáng hơn 1 chút để phân biệt vùng), Card nền tối hơn nền 1 bậc kèm border mờ, chữ sáng.

### 7.4 Color Tokens
> Cập nhật từ logo chính thức (`admin/public/logo.png` — full lockup, `admin/public/logo-icon.png` — icon riêng dùng cho Sidebar/Login nhỏ): Navy `#14365C` (icon la bàn + wordmark) + Teal `#0C8788` (vệt swoosh). Màu lấy chính xác qua sample pixel từ file logo, không phải ước lượng mắt thường. Navy gốc quá tối để dùng trực tiếp trên nền gần đen (Sidebar cố định + Content Area Dark theme) — riêng 2 vùng đó dùng bản navy **sáng hơn** `#4C7EB0` để đủ contrast, xem ghi chú theo từng dòng.

| Token | Light | Dark |
| :--- | :--- | :--- |
| `--sidebar` (cố định 2 theme) | `#0D0D10` | `#0D0D10` |
| `--sidebar-foreground` | `#A6A8AE` | `#A6A8AE` |
| `--sidebar-primary`/`--sidebar-ring` (navy sáng — nền Sidebar gần đen) | `#4C7EB0` | `#4C7EB0` |
| `--sidebar-active` (nền item active, tint navy tối) | `#132B44` | `#132B44` |
| `--background` | `#F5F6F8` | `#0E1013` |
| `--foreground` | `#16171B` | `#F2F3F5` |
| `--card` | `#FFFFFF` | `#181A1F` |
| `--card-foreground` | `#16171B` | `#F2F3F5` |
| `--primary` (Brand navy) | `#14365C` | `#4C7EB0` (**lightened** — Content Area Dark cũng nền gần đen `#0E1013`, navy gốc mất contrast) |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--secondary` | `#F0F1F3` | `#1E2126` |
| `--secondary-foreground` | `#16171B` | `#E7E9EE` |
| `--muted` | `#F3F4F6` | `#1A1C21` |
| `--muted-foreground` | `#6B7280` | `#8B90A0` |
| `--accent` (tint teal nhạt cho icon badge/hover) | `#E3F5F4` | `#0F2C2C` |
| `--accent-foreground` (Brand teal) | `#0C8788` | `#3FD9D0` |
| `--destructive` | `#DC2626` | `#F87171` |
| `--border` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.08)` |
| `--ring` | `#14365C` | `#4C7EB0` |
| `--chart-1` (navy, chuỗi chính — đồng bộ `--primary`) | `#14365C` | `#4C7EB0` |
| `--chart-2` (đen/tối, chuỗi phụ) | `#16171B` | `#C7CBD1` |
| `--chart-3` (xám, chuỗi nền) | `#C7CBD1` | `#3A3D44` |
| `--chart-4` (cyan, chuỗi phụ trong combo chart) | `#22B8CF` | `#3FD3E8` |

### 7.5 Status Badge Palette
Dùng cho mọi trạng thái nghiệp vụ hiển thị dạng pill trong Data Table/List (Booking status, Partner verification, Refund/Payout status...) — KHÔNG dùng `--primary` cho badge trạng thái (giữ `--primary` riêng cho hành động/thương hiệu):
| Ý nghĩa | Ví dụ áp dụng (Tripora) | Light | Dark |
| :--- | :--- | :--- | :--- |
| Info (vai trò/loại) | Role badge (Traveler/Partner) | nền `#E7F0FF` / chữ `#2563EB` | nền `#16233D` / chữ `#7FADFF` |
| Special (nổi bật/đặc biệt) | Booking `type` đặc biệt, Partner tier | nền `#F1E9FE` / chữ `#7C3AED` | nền `#241A3B` / chữ `#B79CFB` |
| Pending/Warning | Booking `PENDING`/`PAYMENT_PENDING`, Partner `PENDING` | nền `#FFF3E0` / chữ `#B7791F` | nền `#3A2A0F` / chữ `#F5B94D` |
| Success | Booking `CONFIRMED`/`COMPLETED`, Payout `PAID` | nền `#E6F7EC` / chữ `#16A34A` | nền `#122B1B` / chữ `#4ADE80` |
| Danger | Booking `CANCELLED`, Partner `REJECTED` | nền `#FDE9E9` / chữ `#DC2626` | nền `#3A1518` / chữ `#F87171` |

### 7.6 Component Pattern quan sát từ ảnh
- **Sidebar**: nhóm menu có tiêu đề nhỏ viết hoa (`text-xs`, muted, letter-spacing rộng), item = icon 18-20px + label, item active nền `--sidebar-active` bo `--radius-md` + chữ/icon màu `--primary`.
- **Header**: nền `--background`/`--card`, cụm icon phụ (kết nối/hỗ trợ/thông báo) căn phải, cuối cùng là Avatar + tên + Role, có border/divider mảnh giữa các cụm.
- **Stat + Chart Card**: icon badge tròn nhỏ (nền `--accent`, icon `--primary`) + tiêu đề Card bên trái tiêu đề khối; hàng số liệu tổng hợp `label: value` (label `--muted-foreground`, value bold `--foreground`) căn phải cùng hàng tiêu đề; phía dưới là 1 biểu đồ (bar/donut/line/gauge/horizontal-bar) dùng đúng `--chart-1..4` ở 7.4, có dropdown filter nhỏ (Weekly/Monthly) góc trên phải khối chart.
- **Gauge/Donut Chart**: số liệu phần trăm lớn (`text-2xl`~`text-4xl` bold) đặt giữa vòng tròn.
- **Data Table** (ví dụ "Recent Check-ins"/"Recent Bookings"): header cột `text-xs` muted viết hoa nhẹ, hàng dữ liệu có Avatar+tên+email (2 dòng) ở cột chính, cột Status dùng Badge theo 7.5, cột thời gian có icon đồng hồ nhỏ đi kèm giờ; góc phải tiêu đề bảng có filter (Today/Weekly) + link "See all".
- **List Widget nhỏ** (ví dụ "Incomplete Profiles"): Tabs chuyển nhóm dữ liệu ở đầu, mỗi dòng = Avatar + tên + Badge vai trò (7.5) + text phụ (`text-xs muted`) + icon edit bên phải.

### 7.7 Typography Accent
- **Font chữ**: `Google Sans` (text) + `Google Sans Code` (monospace) qua `next/font/google`, khai báo ở `src/app/layout.tsx` với `variable: "--font-sans"`/`"--font-mono"` (khớp trực tiếp token Tailwind, không đặt tên khác như `--font-geist-sans`) — đồng bộ với `frontend/`. Subsets bắt buộc gồm `latin` + `vietnamese`. Không tự đổi sang font khác khi chưa có yêu cầu.
- Tiêu đề trang (Header breadcrumb): bold, `text-lg`~`text-xl`, kèm icon nhỏ bên trái.
- Số liệu tổng hợp trong Card (`label: value`): `value` bold `text-sm`~`text-base`, `label` `text-xs muted-foreground`, đặt liền kề theo hàng ngang, phân tách bằng khoảng trắng đều nhau (không dùng bảng/table cho hàng này).
- Số phần trăm trong Gauge/Donut: rất lớn, bold, đặt giữa biểu đồ.
- Bảng dữ liệu: header cột `text-xs font-medium muted-foreground`, nội dung `text-sm`.

### 7.8 Theme: Light / Dark / System (bắt buộc đủ 3 chế độ)
- Dùng `next-themes` (`attribute="class"`, `defaultTheme="light"` — khớp ảnh mẫu, `enableSystem`). `ThemeToggle` dùng chung ở `shared/components/`, đặt trong cụm icon ở Header, là dropdown **3 lựa chọn** Light/Dark/System (không phải switch 2 trạng thái) — đồng bộ cách làm với `frontend/` (xem `frontend/CLAUDE.md` mục 6.7).
- **Light**: áp dụng bảng token 7.4 cột Light (từ ảnh mẫu thật).
- **Dark**: áp dụng bảng token 7.4 cột Dark — là **suy luận giữ tông thương hiệu** (ảnh mẫu chỉ có Light), cần duyệt lại với người dùng khi có ảnh/yêu cầu Dark cụ thể hơn.
- **System**: theo `prefers-color-scheme` của OS.
- **Sidebar là ngoại lệ cố định** (xem 7.3) — không đổi theo theme dù Light/Dark/System, luôn tối để giữ nhận diện "khu vực quản trị".

### 7.9 Áp dụng
Mọi Card/Table/Badge/Chart mới bắt buộc dùng token ở trên qua Tailwind theme (`bg-card`, `text-muted-foreground`, `rounded-[var(--radius-lg)]`, `--chart-1..4`...). Cấm hardcode mã màu/bo góc tuỳ tiện, trừ ngoại lệ Sidebar cố định đã nêu ở 7.3. Không dùng `--primary` cho Status Badge (dùng bảng 7.5) để tránh nhầm lẫn giữa "hành động/thương hiệu" và "trạng thái dữ liệu". Tên thương hiệu, logo luôn là **Tripora Admin** — ảnh tham khảo chỉ dùng để học phong cách trình bày.
