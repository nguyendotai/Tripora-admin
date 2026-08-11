# Tripora Admin

App Next.js hướng Admin của Tripora — quản trị hệ thống (Dashboard, Users, Destinations, Blog, Reviews...). Roadmap theo phase: xem `../phases/README.md` (V1 → V9).

## Tech Stack
Next.js (App Router), TypeScript, Tailwind CSS v4, Redux Toolkit + RTK Query, React Hook Form + Zod, shadcn/ui (`base-nova`), `recharts`, next-themes (Light/Dark/System).

Xem quy tắc phát triển đầy đủ tại `CLAUDE.md` và `../.claude/*.md`.

## Getting Started

```bash
npm install
npm run dev
```

Mở [http://localhost:3002](http://localhost:3002) (port cố định — xem `package.json` script `dev`/`start` — để chạy song song `backend/` ở `5550` và `frontend/` ở `3003`).

## Cấu trúc thư mục
```
src/
  app/         # App Router: layout, page, providers (Theme)
  modules/     # module theo tính năng (ví dụ dashboard/)
  shared/      # components dùng chung (logo, sidebar, header, theme-toggle...)
  components/  # shadcn/ui
  lib/         # utils (cn...)
```

## Design System
Xem `CLAUDE.md` mục 7 — Sidebar tối cố định 2 theme, Content Area Light (mặc định)/Dark/System, brand navy `#14365C` + teal `#0C8788`, token khai báo tại `src/app/globals.css`.

## Scripts
- `npm run dev` — chạy dev server tại port `3002`
- `npm run build` — build production
- `npm run start` — chạy bản build tại port `3002`
- `npm run lint` — lint
