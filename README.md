# Evental

## Todo List
- featured role members
- event banner
- Excel export for event data
- print your schedule
- customize react toast
- clean up queries/mutations (export whole mut/query?)
- rate limit request password reset & verify email request etc
- session file upload
- role member's can edit sessions?
- google maps embed for addresses
- bulk create sessions
- make event placeholder with year
- varchar match schema
- user not caching when unauthed (bc rc doesn't cache errors)
- make events truly private
- adjust session times when event date is moved
- organizers can edit user with no email or no password (as the account is unclaimed/inactive)
- attach people -> create attendee -> create role dialog is under
try to make your own event, be a user

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
