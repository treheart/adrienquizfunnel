# Quiz Funnel - Akari Social

A Next.js quiz funnel that helps users identify their business bottleneck and provides personalized recommendations.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Push this entire folder to a GitHub repository
2. Connect the repository to Vercel
3. Vercel will auto-detect Next.js and deploy

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page (quiz)
│   ├── results/page.tsx   # Results page
│   ├── api/subscribe/     # Beehiiv API integration
│   └── ...
├── components/
│   ├── quiz/              # Quiz components
│   └── ui/                # UI components (shadcn)
├── content/               # Editable JSON content
│   ├── quiz.json
│   ├── results.json
│   ├── learning-path.json
│   └── common.json
├── lib/                   # Utilities and types
└── public/                # Static assets
```

## Editing Content

All text can be edited in the `content/` folder JSON files without touching code.

## Environment Variables (for Beehiiv integration)

```
BEEHIIV_API_KEY=your_api_key
BEEHIIV_PUBLICATION_ID=your_publication_id
```
