# Tripora Admin

App Next.js hướng Admin/Partner (duyệt Partner/Property/Product, quản lý Booking/Refund/Coupon/Commission/Payout/User) của Tripora — Booking/Travel Platform.

## Tech Stack
Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit + RTK Query, React Hook Form + Zod, shadcn/ui, next-themes (Light/Dark/System), Socket.IO Client.

Xem quy tắc phát triển đầy đủ tại `CLAUDE.md` và `../.claude/*.md` (`business-rules.md`, `architecture.md`, `folder-structure.md`, `api-contract.md`).

## Getting Started

```bash
npm install
cp .env.example .env.local   # trỏ NEXT_PUBLIC_API_BASE_URL sang backend
npm run dev
```

Mở http://localhost:3002 (khuyến nghị chạy port khác `frontend/` khi dev song song, xem package.json script `dev`).

## Cấu trúc thư mục
```
src/
  app/         # App Router: layout, page, providers (Redux + Theme)
  features/    # mỗi nghiệp vụ quản trị 1 thư mục (auth, partner-verification, ...)
  modules/     # ghép nhiều feature thành 1 module giao diện
  shared/      # components (kể cả shadcn/ui, Sidebar, ThemeToggle), hooks, services, lib dùng chung
  store/       # store.ts, root-reducer.ts (Redux Slice nằm trong từng feature)
  configs/     # env, axios/socket config
  constants/
  styles/
```

## Design System
Xem `CLAUDE.md` mục 7 — Sidebar tối cố định 2 theme, Content Area Light (mặc định)/Dark/System, brand đỏ đậm `#D42E3D`, token khai báo tại `src/app/globals.css`.

## Scripts
- `npm run dev` — chạy dev server
- `npm run build` — build production
- `npm run lint` — lint
