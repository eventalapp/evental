# Evental

## Todo for MVP:

- add speakers to sessions
- marketing pages
- hide & show earlier sessions

## low importance
- share to twitter
- event favicon
- featured role members
- Excel export for event data
- remove image upload on user profile
- print your schedule
- session card on hover
- custom icons
- customize react toast
- refactor navigations
- refactor buttons
- remove unused radix
- clean up queries/mutations (export whole mut/query?)
- filter by date formatting
- verify email before joining/creating event

## post mvp
- make events truly private

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


 
