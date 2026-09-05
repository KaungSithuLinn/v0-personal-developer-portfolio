# Personal Developer Portfolio

A professional portfolio website showcasing my skills, projects, and experience as a software engineer. Built with modern web technologies and hosted on Vercel.

---

## ✨ Features

- **Responsive Design**: Optimized for all devices, from desktops to mobile phones.
- **Interactive Project Showcase**: Highlighting key projects with detailed descriptions and visuals.
- **Contact Form Integration**: Seamless communication via a built-in contact form.
- **Performance & SEO Optimized**: Ensuring fast load times and better search engine visibility.

---

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript, React
- **Hosting**: [Vercel](https://vercel.com)

---

## 🚀 Getting Started

Follow the steps below to set up the project locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/v0-personal-developer-portfolio.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd v0-personal-developer-portfolio
   ```

3. **Install Dependencies** (npm; pnpm is **not** used by this project):

   ```bash
   npm install
   ```

4. **Start the Development Server**:

   ```bash
   npm run dev
   ```

Once the server is running, open your browser and navigate to `http://localhost:3000` to view the project.

---

## 🧪 Testing & Quality Gates

| Script | Purpose |
| --- | --- |
| `npm run lint` | ESLint over the whole repo |
| `npx tsc --noEmit` | TypeScript strict-mode check |
| `npm run validate:translations` | Enforces `en` / `zh` / `ms` key parity (`ta` and `ar` ship with partial coverage by design) |
| `npx next build` | Production build; output size is monitored by CI |
| `npx playwright test` | Full E2E suite (defaults to `next start`; set `PLAYWRIGHT_USE_DEV=1` to fall back to `next dev`) |
| `npm run test:e2e:prod` | Runs the Playwright suite against the live Vercel deployment (`BASE_URL=https://v0-personal-developer-portfolio-psi-blush.vercel.app`) |
| `npm run lighthouse` | Sequential desktop + mobile Lighthouse CI runs (`lighthouse:desktop` and `lighthouse:mobile` for a single preset) |

### Continuous Integration

Two GitHub Actions workflows guard the `main` branch:

- **`.github/workflows/lighthouse.yml`** — runs on every push and pull request, executing the desktop and mobile Lighthouse presets in parallel. A11y scores below `0.95` and mobile performance below `0.80` are hard failures.
- **`.github/workflows/e2e-resend.yml`** — exercises the live contact form against the real Resend integration. **Manual trigger only**, plus a weekly cron (`Mon 06:00 UTC`); it never runs on push or PR because the per-IP rate limit (`3 req/min`) is shared across CI.

The Resend E2E spec (`tests/e2e/contact-resend.spec.ts`) is also opt-in locally:

```bash
E2E_CONTACT_LIVE=1 npx playwright test contact-resend.spec.ts
# Add RESEND_TEST_API_KEY to also assert the message appears in the Resend API.
```

---

## 🌐 Deployment

This project is deployed on [Vercel](https://vercel.com). To deploy your own version:

1. Push your changes to a GitHub repository.
2. Connect the repository to your Vercel account.
3. Vercel will automatically build and deploy your project.

For more details, refer to the [Vercel Documentation](https://vercel.com/docs).

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

---

## 📧 Contact

For any inquiries or feedback, feel free to reach out via the contact form on the website or email me directly at [kaungsithulinn2@outlook.com].

---

## 🔒 Dependency and Security Maintenance

- The project uses npm overrides to pin patched versions for Next.js, React, glob, jsondiffpatch, and negotiator to mitigate known advisories.
- After cloning, run `npm install` to ensure overrides are applied.
- Verify the enforced versions anytime:

  ```bash
  npm ls next glob jsondiffpatch negotiator react react-dom
  ```

- Run a quick security check:

  ```bash
  npm audit
  ```

- If prompted about blocked build scripts (e.g., sharp), allow as needed:

  ```bash
  npm config set fund false
  ```
