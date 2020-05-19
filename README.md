# Evental

## Todo for MVP:
- marketing pages
- hide & show earlier sessions

## low importance
- featured role members
- send email to all event attendees
- Excel export for event data
- print your schedule
- session card on hover
- custom icons
- customize react toast
- refactor navigations
- refactor buttons
- remove unused radix
- clean up queries/mutations (export whole mut/query?)
- rate limit request password reset & verify email request etc
- tooltip wysiwyg editor menubar

## post mvp
- make events truly private
- adjust session times when event date is moved

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


 
