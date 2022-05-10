# Evental

Using [Next.js](https://nextjs.org/) with [Next-Auth](https://next-auth.js.org/), [Prisma](https://www.prisma.io/), [Postgres](https://www.postgresql.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind](https://tailwindcss.com/), and [React Query](https://react-query.tanstack.com/)

## Todo for MVP:

- add speakers to sessions
- excel export for data
- marketing pages
- billing (stripe or similar?)
- view/print your schedule
- next SEO
- image upload for top level page wysiwyg
- event privacy

## low importance
- custom icons
- customize react toast
- refactor navigations
- refactor buttons
- remove unused radix
- clean up queries/mutations(export whole mut/query)

## Installation 💾

Prerequisites:
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Node 16.13](https://nodejs.org/ko/blog/release/v16.13.0/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

Clone the repository:

```bash
git clone https://github.com/JackRKelly/evental
```

Duplicate `.env.local.example` and rename it to `.env`

Install dependencies and generate the prisma client:

```bash
yarn
```

Create and run the Postgres Docker database container:

```bash
yarn docker
```

Start the Next.js dev server:

```bash
yarn dev
```


 
