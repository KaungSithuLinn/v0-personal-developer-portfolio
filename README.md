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
| `npm run lighthouse` | Sequential desktop + mobile Lighthouse CI runs (`lighthouse:desktop` and `lighthouse:mobile` for a single preset) |

### Continuous Integration

One GitHub Actions workflow guards the `main` branch:

- **`.github/workflows/lighthouse.yml`** — runs on every push and pull request, executing the desktop and mobile Lighthouse presets in parallel. A11y scores below `0.95` and mobile performance below `0.80` are hard failures.

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
