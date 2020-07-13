# Evental

## Todo List
- featured role members
- notification preferences

## Post MVP Todo List
- session tags
- adjust session times when event date is moved
- bulk create sessions
- session file upload
- rate limit request password reset & verify email request etc
- customize react toast
- clean up queries/mutations (export whole mut/query?)
- event banner
- Excel export for event data
- print your schedule
- attach people -> create attendee -> create role dialog is under
- railway redis migration
- make events truly private
- user not caching when unauthenticated (bc rc doesn't cache errors)
- sort labels in dropdowns
- Create event full form/multistep form (with skip functionality)
- role member's can edit sessions?
- google maps embed for addresses
- search by name debounce (see if react query has debounce built in?)

## DB Pushing

- swap out database url for true db url to db push, then revert to prisma data layer

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
