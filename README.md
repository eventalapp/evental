# Evental

## pre mvp

- send email to all event attendees

## low importance

- featured role members
- event banner
- Excel export for event data
- print your schedule
- customize react toast
- refactor buttons
- remove unused radix
- clean up queries/mutations (export whole mut/query?)
- rate limit request password reset & verify email request etc
- session file upload
- role member session edit
- google maps embed for addresses
- bulk create sessions
- attach people on session creation
- attach people -> create attendee (new modal)
- make event placeholder with year
- make default avatar more neutral
- hide leave button as founder
- varchar match schema
- strip user email
- user not caching when unauthed (bc rc doesn't cache errors)

try to make your own event, be a user

## post mvp

- make events truly private
- adjust session times when event date is moved

## DB Pushing

- swap out database url for true db url to db push, then revert back to prisma data layer

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
