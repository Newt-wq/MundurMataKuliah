# Implementation Plan — Mundur Mata Kuliah Frontend (Universitas Paramadina - FIR)

This plan outlines the design, structure, and implementation of the frontend application for the **Mundur Mata Kuliah** system (Fakultas Ilmu Rekayasa, Universitas Paramadina). The project is built using **Next.js 14+ (App Router)** and **Tailwind CSS**.

---

## User Review Required

> [!IMPORTANT]
> - **Branding & Assets**: As per your guidelines, we will *not* generate AI logos. We will create two placeholder image files in `public/images/logo-paramadina.png` and `public/images/logo-fir.png`. In the UI, these will be rendered with Next.js `<Image />` component so they can be easily replaced by you.
> - **Authentication Flow**: The `/login` page is visual-only and uses Google OAuth styling. It will simulate a login delay (1-2s) and save a mock session state in a React Context, which autofills form data later. Clicking logout will reset this session.
> - **State Management**: Form state during the multi-step wizard will be managed using React Context to prevent state loss when navigating between steps.
> - **Mock Backend**: Data will be saved in-memory during the session (using a Context/State provider) so that submitting a new form will dynamically update the dashboard and history pages for that session.

---

## Open Questions
*No open questions at this time. The requirements are fully detailed in the prompt.*

---

## Proposed Changes

We will construct the project following the directory structure requested.

### 1. Project Initialization & Setup
- Initialize Next.js with Tailwind, TypeScript, ESLint, App Router, and `src` directory.
- Install packages: `lucide-react`, `react-hook-form`, `zod`, `@hookform/resolvers`, `clsx`, `tailwind-merge`.
- Set up custom theme configuration in `tailwind.config.ts` using the official colors:
  - **Primary (Biru Madani)**: `#0B2447` to `#123C69`
  - **Secondary (Abu-abu al-Quds)**: `#8A8D91` to `#B4B7BB`
  - Status Accents: green (Success), yellow/orange (Warning/Pending), red (Danger/Rejected)

---

### 2. Core Library & Configuration Files

#### [NEW] [types/index.ts](file:///c:/Users/diena/Documents/MundurMatkul/src/types/index.ts)
Define domain-specific types:
- `Mahasiswa`: Nama, NIM, Prodi, Semester/TA, Alamat.
- `MataKuliah`: Kode, Nama, SKS.
- `Pengajuan`: ID, Mahasiswa, Daftar Mata Kuliah, Alasan, Tanggal Pengajuan (dd/mm/yyyy), Status (`PENDING_PA`, `PENDING_ORTU`, `PENDING_DEKAN`, `APPROVED`, `REJECTED`), Catatan/Feedback.
- `UserSession`: Current logged-in student info.

#### [NEW] [lib/constants.ts](file:///c:/Users/diena/Documents/MundurMatkul/src/lib/constants.ts)
Centralize static data and business rules:
- Prosedur rules (4 core guidelines, contact email `fir@paramadina.ac.id`, deadline info).
- Program Studi choices (Informatika, Elektro, Desain Produk, dll. under FIR).
- Status labels, descriptions, and flow.

#### [NEW] [lib/validations.ts](file:///c:/Users/diena/Documents/MundurMatkul/src/lib/validations.ts)
Define schemas using `zod`:
- Step 1: Prosedur agreement.
- Step 2: Data diri validation (NIM, Prodi, Semester, Alamat).
- Step 3: Mata kuliah table validation (at least 1 course, course code, name, SKS (1-6)).
- Step 4: Alasan validation (required, textarea).
- Complete submission validation combining the above.

#### [NEW] [lib/mock-data.ts](file:///c:/Users/diena/Documents/MundurMatkul/src/lib/mock-data.ts)
Populate standard initial listings:
- A list of courses that students can select (to make autocomplete/filling course details in form easier).
- Minimal 3-5 initial sample applications with different statuses (e.g. `Selesai/Disetujui`, `Menunggu Persetujuan Dosen PA`, `Menunggu Persetujuan Dekan FIR`) to display in Riwayat and Dashboard.

#### [NEW] [context/SessionContext.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/context/SessionContext.tsx)
Context to manage mock authentication (Google Login session) and in-memory list of applications, so that users can submit a new form and see it appear in Riwayat and Dashboard instantly.

---

### 3. Layout & UI Components

#### [NEW] [components/ui/button.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/components/ui/button.tsx)
#### [NEW] [components/ui/card.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/components/ui/card.tsx)
#### [NEW] [components/ui/badge.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/components/ui/badge.tsx)
#### [NEW] [components/ui/input.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/components/ui/input.tsx)
#### [NEW] [components/ui/textarea.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/components/ui/textarea.tsx)
Standard Tailwind reusable UI blocks styled with Paramadina colors.

#### [NEW] [components/layout/Navbar.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/components/layout/Navbar.tsx)
#### [NEW] [components/layout/Footer.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/components/layout/Footer.tsx)
Header displaying user profile, logout, logo placeholder for Paramadina/FIR, and simple modern styling. Footer with contact info.

#### [NEW] [components/forms/CourseTableInput.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/components/forms/CourseTableInput.tsx)
Dynamic course table editor where users can add/delete rows, select courses, automatically calculates the sum of SKS.

---

### 4. Page Implementations

#### [NEW] [app/login/page.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/app/login/page.tsx)
Centered card login with:
- Logo placeholder, title "Sistem Pengajuan Mundur Mata Kuliah - FIR Universitas Paramadina".
- Google login button following identity guidelines.
- Loading indicator and mock redirect.

#### [NEW] [app/page.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/app/page.tsx)
Dashboard (Home):
- Summary of active applications tracking.
- Navigation cards/shortcuts.
- Current academic session warning (Pertemuan ke-2 deadline).

#### [NEW] [app/prosedur/page.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/app/prosedur/page.tsx)
Official policy display page.

#### [NEW] [app/pengajuan/baru/page.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/app/pengajuan/baru/page.tsx)
#### [NEW] [app/pengajuan/baru/_components/](file:///c:/Users/diena/Documents/MundurMatkul/src/app/pengajuan/baru/_components/)
Multi-step form wizard using React Context for wizard state.
- **Step 1**: Disclaimer and checklist.
- **Step 2**: Personal details (auto-populated from session, editable address).
- **Step 3**: Dynamic table input for courses.
- **Step 4**: Reason + Academic Advisor check.
- **Step 5**: Comprehensive review + Mock submission.

#### [NEW] [app/pengajuan/[id]/page.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/app/pengajuan/[id]/page.tsx)
Visual reproduction of the official form with all signatures, approval stamps, and course details.

#### [NEW] [app/pengajuan/[id]/status/page.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/app/pengajuan/[id]/status/page.tsx)
Visual tracking diagram (stepper style):
`Diajukan → Menunggu Persetujuan Dosen PA → Menunggu Persetujuan Orang Tua/Wali → Menunggu Persetujuan Dekan FIR → Selesai/Disetujui`

#### [NEW] [app/riwayat/page.tsx](file:///c:/Users/diena/Documents/MundurMatkul/src/app/riwayat/page.tsx)
Filtered history log of all submissions. Includes filter by status, semester, and search by course name.

---

## Verification Plan

### Automated Tests
- We will verify typescript compilation and build sanity:
  `npm run build`

### Manual Verification
- We will start the dev server `npm run dev`.
- We will test the login transition.
- We will fill out a multi-step form, submit, verify that it adds to the history array and displays in dashboard and tracking flow pages properly.
- We will inspect responsiveness (simulated mobile screens).
