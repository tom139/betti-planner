Each push to main will automatically deploy the app on Vercel at https://betti-planner.vercel.app/ :rocket:

## Update the data

#### Timetable

The timetable is in `app/lib/orario.ts`.

- You need to ensure the columns are `class, monday_1, monday_2, ...` etc.
- There must not be any duplicated classes in the timetable.
- There must not be any merged cell in the original file. They should be separate cells with replicated values.

#### Professors

The professors are in `app/lib/prof.ts`.

- Make sure the class name is the same as in the timetable.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
