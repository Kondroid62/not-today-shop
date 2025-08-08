# Not Today Shop

A web application that helps you track money saved by resisting impulse purchases. Track what you didn't buy and watch your savings grow!

## Features

- 💰 Track resisted purchases and visualize total savings
- 📊 Categorize spending you avoided
- 🔗 Save product URLs for reference
- 📱 Responsive design for all devices
- 🌐 Real-time data sync with Supabase

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/Kondroid62/not-today-shop.git
cd not-today-shop
pnpm install
```

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
