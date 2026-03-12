<div align="center">
  <img src="public/logo-waskitabystophiva.png" alt="Waskita by Stophiva Logo" width="300" />

  <h1>Waskita 🎓</h1>
  <p><strong>Wadah Sinau Kita - Our Learning Container</strong></p>
  <p>An AI-Powered Learning Ecosystem for StopHIVA</p>

  <a href="https://waskita-elearning.com/" target="_blank">
    <img src="https://img.shields.io/badge/Public_Deployment-Live_Now-success?style=for-the-badge&logo=vercel" alt="Public Deployment" />
  </a>
  
  <br />
</div>

## ✨ About The Project
**Waskita** (Wadah Sinau Kita) is an intelligent, modern learning platform built for the StopHIVA initiative. It leverages cutting-edge artificial intelligence and a sleek, animated user interface to provide an engaging and supportive educational experience. 

### 🚀 Key Features
- **AI-Powered Learning Assistants**: Integrates LangChain with Google GenAI and OpenAI for smart interactions and document processing.
- **Modern & Dynamic UI/UX**: Built with Next.js 15, React 19, and Framer Motion for buttery smooth, glassmorphism-inspired interfaces.
- **Secure Authentication**: Robust user access control using JWT and bcryptjs.
- **Scalable Architecture**: Connects to MySQL databases for reliable data storage, with AWS S3 for object and document management.
- **Responsive Design**: Mobile-first styling using TailwindCSS 4 and Tailwind-Animate, enhanced with DaisyUI and Radix UI components.

## 🌐 Public Deployment
Check out the live application here:
👉 **[Waskita Live Deployment](https://waskita-elearning.com/)** 
*(Note: Please update the URL above with your actual deployment link like Vercel or Railway)*

## 🛠️ Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **State & Animation**: [Framer Motion](https://www.framer.com/motion/)
- **AI Core**: [LangChain](https://js.langchain.com/), [OpenAI](https://openai.com/), [Google GenAI](https://ai.google.dev/)
- **Database**: [MySQL2](https://www.npmjs.com/package/mysql2)
- **Storage**: [AWS S3](https://aws.amazon.com/s3/)
- **Authentication**: JWT & Bcryptjs

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- `pnpm` (or npm/yarn/bun)
- A MySQL Database
- API Keys for OpenAI, Google GenAI, and AWS

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ferituaku/waskita.git
cd waskita
```

2. Install dependencies:
```bash
pnpm install
```

3. Setup environment variables:
Create a `.env` file in the root directory based on your required configurations for DB, AI, and Auth.

4. Run the development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/Ferituaku/waskita/issues).

## 📄 License
This project is licensed under the [ISC License](LICENSE).
