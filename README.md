# Evental

TODO:

- Better image uploading (component)
- Forgot password
- user settings
- multi stage event creation
- sessions -> sessions
- marketing pages


Using [Next.js](https://nextjs.org/) with [Next-Auth](https://next-auth.js.org/), [Prisma](https://www.prisma.io/), [Postgres](https://www.postgresql.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind](https://tailwindcss.com/), and [React Query](https://react-query.tanstack.com/)

## Todo:

- Handle file upload and upload to cdn
- React hook form
- slug validation (on edit)
- event settings page
- user settings page

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


 
