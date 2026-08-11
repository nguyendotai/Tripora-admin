# Admin Claude Instructions
> Tripora Admin — Next.js độc lập, dùng chung Backend API với `frontend/`. Roadmap theo phase: xem `../phases/README.md` (V1 → V9).

Tài liệu quy định tiêu chuẩn phát triển `admin/`. AI phải tuân thủ `.claude/` gốc trước (Business Rules -> Architecture -> `admin/CLAUDE.md` -> Coding Style -> Folder Structure); tài liệu này chỉ bổ sung quy tắc riêng cho `admin/`.

## 1. Phạm vi & đối tượng sử dụng
- Người dùng: **Admin** (vận hành hệ thống). Từ **V7** (Provider Marketplace) sẽ thêm nhóm **Provider/Organization** (Owner/Manager/Booking Staff/Finance Staff/Guide) dùng chung app này, phân biệt bằng Role đăng nhập — UI ẩn/hiện menu theo Role, Backend luôn là nơi kiểm tra quyền thật (403 nếu vượt quyền).
- **V1 (hiện tại)**: Dashboard tổng quan, quản lý Users, quản lý Destinations, quản lý Blog/Travel Guide, Moderate Reviews, Reports cơ bản (xem checklist "Admin" ở `../phases/v1-travel-discovery.md`).
- Tính năng duyệt Provider/Property/Product, quản lý Booking/Refund/Coupon/Commission/Payout chỉ thêm khi tới phase tương ứng (V2 Hotel Booking → V7 Marketplace) — không code trước.
- **KHÔNG** xây tính năng dành cho Traveler/Guest ở đây (khám phá/lập Trip, Wishlist cá nhân... thuộc `frontend/`).

## 2. Tech Stack & Framework
Giống `frontend/` để tái sử dụng kinh nghiệm dev: React, Next.js (App Router, cấm Pages Router/API Route riêng), TypeScript strict-mode (cấm `any`/`as`), Tailwind CSS, Redux Toolkit, RTK Query, React Hook Form, Zod, shadcn/ui. Ưu tiên component dạng Table/Form quản trị (Data Table có filter/sort/pagination, Approve/Reject Dialog có lý do từ chối khi tới phase có luồng duyệt).

## 3. State Management & API Calls
- **Server Data**: RTK Query, tách API theo domain quản trị (`features/user-management/api`, `features/destination-management/api`...).
- **Global UI State**: Redux Toolkit chỉ dùng cho Auth (session Admin), Theme, Sidebar, Modal xác nhận.
- Không dùng chung Redux Store/RTK Query cache với `frontend/` (2 app độc lập, chỉ dùng chung Backend REST API).

## 4. Business Logic & Phân quyền (quan trọng nhất ở app này)
- Mọi action nhạy cảm (xoá/khoá User, ẩn Review vi phạm, và từ V2+: Approve Property/Product, Force Cancel Booking, Refund thủ công...) phải có Dialog xác nhận + ghi rõ lý do khi Reject/Suspend (Backend lưu Activity Log).
- Route/menu guard theo Role ở Frontend chỉ là UX — KHÔNG phải lớp bảo mật, mọi API vẫn tự kiểm tra quyền ở Backend (403 nếu vượt quyền), không tin dữ liệu Role decode từ JWT phía client để hiện dữ liệu nhạy cảm mà chưa gọi API xác thực.
- Từ V7 (multi-tenant): Provider chỉ được thấy/thao tác dữ liệu thuộc Organization của chính mình — mọi danh sách phải filter theo Organization đang đăng nhập.

## 5. UX & Performance
- Ưu tiên Data Table hiệu năng tốt (pagination server-side, không tải hết dữ liệu về Client) cho danh sách có thể rất lớn (Users, Bookings khi có).
- Đầy đủ Loading/Empty/Error State cho mọi bảng và form. Toast thông báo rõ kết quả thao tác.
- CẤM: Axios, gọi API trực tiếp trong UI, hardcode Role/Permission, tự tính lại số liệu tài chính ở Frontend (luôn lấy số liệu tính sẵn từ Backend).

## 6. DOD (Definition of Done)
Build thành công; không lỗi TS/ESLint; Responsive (ít nhất Desktop — Mobile là tối ưu thêm không bắt buộc); đủ UI State; đúng phân quyền theo `business-rules.md`; cập nhật `CHANGELOG.md`, `PROJECT_STATUS.md`, và % trong file phase tương ứng ở `../phases/`.

## 7. Design System (Brand Tripora Admin — áp dụng xuyên suốt mọi phase)
> Bản sắc thương hiệu (logo, màu, layout) áp dụng cho toàn bộ `admin/` bất kể phase — chỉ nội dung/tính năng thay đổi theo roadmap. Phân tích gốc từ ảnh reference "Dark Sidebar Admin Dashboard" — **chỉ lấy bố cục/tỉ lệ, không copy thương hiệu/màu trong ảnh gốc**, màu thật lấy từ logo chính thức (7.4). Biến CSS tại `:root` (Light) và `.dark` (Dark) trong `src/app/globals.css` — riêng token Sidebar là ngoại lệ cố định (7.3).

### 7.1 Layout tổng quan
- **Sidebar** (trái, cố định, luôn tối — 7.3): logo (`shared/components/logo.tsx`) + icon brand navy, ô Search, menu chia nhóm bằng label nhỏ viết hoa/muted, mỗi item = icon + label, item active nền `--sidebar-active` bo `--radius-md`. Nút **Logout** cố định cuối Sidebar, outline pill `--primary`.
- **Header** (trên, theo theme): breadcrumb/tiêu đề trang bên trái; bên phải: bộ lọc, chuông Notification, avatar + tên + Role.
- **Content Area** (theo theme): nền `--background`, nhiều Card trắng/tối xếp lưới — icon badge tròn nhỏ + tiêu đề bên trái, số liệu tổng hợp `label: value` bên phải, bên dưới là biểu đồ/bảng dữ liệu.

### 7.2 Border Radius Scale
| Token | ~Px | Dùng cho |
| :--- | :--- | :--- |
| `--radius-sm` | 8px | input, icon-button nhỏ trong Header |
| `--radius-md` | 12px | Sidebar item active, badge icon tròn trong Card |
| `--radius-lg` (base) | 14px | Stat/Chart Card, Data Table container |
| `--radius-xl` | 18px | Card lớn gộp nhiều biểu đồ |
| `rounded-full` | 9999px | Status Badge/Pill, Avatar, nút Logout, nút Search icon |

### 7.3 Background & Surface
- **Sidebar**: cố định tối ở cả Light/Dark/System — nền gần đen (`#0D0D10`), text item xám nhạt, label nhóm xám mờ hơn.
- **Light** (mặc định): Content Area nền xám rất nhạt (`--background`), Card nền trắng đặc + shadow rất nhẹ.
- **Dark** (suy luận theo tông thương hiệu): Content Area nền tối, Card tối hơn nền 1 bậc kèm border mờ, chữ sáng.

### 7.4 Color Tokens
> Lấy từ logo chính thức (`admin/public/logo.png`, `admin/public/logo-icon.png`): Navy `#14365C` + Teal `#0C8788`. Navy gốc quá tối cho nền gần đen (Sidebar + Content Area Dark) nên 2 vùng đó dùng bản sáng hơn `#4C7EB0`.

| Token | Light | Dark |
| :--- | :--- | :--- |
| `--sidebar` (cố định 2 theme) | `#0D0D10` | `#0D0D10` |
| `--sidebar-foreground` | `#A6A8AE` | `#A6A8AE` |
| `--sidebar-primary`/`--sidebar-ring` | `#4C7EB0` | `#4C7EB0` |
| `--sidebar-active` | `#132B44` | `#132B44` |
| `--background` | `#F5F6F8` | `#0E1013` |
| `--foreground` | `#16171B` | `#F2F3F5` |
| `--card` | `#FFFFFF` | `#181A1F` |
| `--card-foreground` | `#16171B` | `#F2F3F5` |
| `--primary` (Brand navy) | `#14365C` | `#4C7EB0` |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--secondary` | `#F0F1F3` | `#1E2126` |
| `--secondary-foreground` | `#16171B` | `#E7E9EE` |
| `--muted` | `#F3F4F6` | `#1A1C21` |
| `--muted-foreground` | `#6B7280` | `#8B90A0` |
| `--accent` | `#E3F5F4` | `#0F2C2C` |
| `--accent-foreground` (Brand teal) | `#0C8788` | `#3FD9D0` |
| `--destructive` | `#DC2626` | `#F87171` |
| `--border` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.08)` |
| `--ring` | `#14365C` | `#4C7EB0` |
| `--chart-1..4` | `#14365C` / `#16171B` / `#C7CBD1` / `#22B8CF` | `#4C7EB0` / `#C7CBD1` / `#3A3D44` / `#3FD3E8` |

### 7.5 Status Badge Palette
Dùng cho mọi trạng thái nghiệp vụ hiển thị dạng pill trong Data Table/List — KHÔNG dùng `--primary` cho badge trạng thái:
| Ý nghĩa | Light | Dark |
| :--- | :--- | :--- |
| Info (vai trò/loại) | nền `#E7F0FF` / chữ `#2563EB` | nền `#16233D` / chữ `#7FADFF` |
| Special (nổi bật/đặc biệt) | nền `#F1E9FE` / chữ `#7C3AED` | nền `#241A3B` / chữ `#B79CFB` |
| Pending/Warning | nền `#FFF3E0` / chữ `#B7791F` | nền `#3A2A0F` / chữ `#F5B94D` |
| Success | nền `#E6F7EC` / chữ `#16A34A` | nền `#122B1B` / chữ `#4ADE80` |
| Danger | nền `#FDE9E9` / chữ `#DC2626` | nền `#3A1518` / chữ `#F87171` |

### 7.6 Component Pattern
- **Sidebar**: nhóm menu tiêu đề nhỏ viết hoa (`text-xs`, muted, letter-spacing rộng), item = icon 18-20px + label, item active nền `--sidebar-active` bo `--radius-md` + chữ/icon `--primary`.
- **Header**: nền `--background`/`--card`, cụm icon phụ căn phải, cuối cùng Avatar + tên + Role, border/divider mảnh giữa các cụm.
- **Stat + Chart Card**: icon badge tròn nhỏ (nền `--accent`, icon `--primary`) + tiêu đề bên trái; số liệu tổng hợp `label: value` (label muted, value bold) căn phải cùng hàng; bên dưới 1 biểu đồ dùng `--chart-1..4`, dropdown filter nhỏ góc trên phải.
- **Data Table**: header cột `text-xs` muted viết hoa nhẹ, cột chính có Avatar+tên (nếu là user), cột Status dùng Badge theo 7.5, góc phải tiêu đề bảng có filter + link "See all".

### 7.7 Typography Accent
- **Font**: `Google Sans` (text) + `Google Sans Code` (monospace) qua `next/font/google`, `variable: "--font-sans"`/`"--font-mono"` — đồng bộ `frontend/`. Subsets bắt buộc `latin` + `vietnamese`.
- Tiêu đề trang: bold, `text-lg`~`text-xl`, kèm icon nhỏ bên trái.
- Số liệu tổng hợp trong Card: `value` bold `text-sm`~`text-base`, `label` `text-xs muted-foreground`.
- Bảng dữ liệu: header cột `text-xs font-medium muted-foreground`, nội dung `text-sm`.

### 7.8 Theme: Light / Dark / System (bắt buộc đủ 3 chế độ)
- `next-themes` (`attribute="class"`, `defaultTheme="light"`, `enableSystem`). `ThemeToggle` dropdown **3 lựa chọn**, đồng bộ cách làm `frontend/`.
- **Sidebar là ngoại lệ cố định** (7.3) — không đổi theo theme, luôn tối để giữ nhận diện "khu vực quản trị".

### 7.9 Áp dụng
Mọi Card/Table/Badge/Chart mới bắt buộc dùng token ở trên. Cấm hardcode mã màu/bo góc tuỳ tiện, trừ ngoại lệ Sidebar cố định. Không dùng `--primary` cho Status Badge (dùng 7.5). Tên thương hiệu, logo luôn là **Tripora Admin**.
