# Evental

Prerequisites:

- [Node 16.13](https://nodejs.org/ko/blog/release/v16.13.0/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

Clone the repository:

```bash
git clone https://github.com/eventalapp/evental
```

Duplicate `.env.local.example` in each package and rename it to `.env`

Install dependencies and generate the prisma client:

```bash
yarn
```

Start the web development server:

```bash
yarn web dev
```

Start the mobile development server:

```bash
yarn mobile dev
```
