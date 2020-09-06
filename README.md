# Evental

Evental is an open source event management platform.

### Technologies:

Next.js, TypeScript, React, React Native, Prisma, Tailwind CSS, Radix UI, react-query, react-hook-form, mjml, Yarn

### Hosting/Services:
- [AWS SES](https://aws.amazon.com/ses/), [AWS CloudFront](https://aws.amazon.com/cloudfront/), [AWS S3](https://aws.amazon.com/s3/), [AWS Route53](https://aws.amazon.com/route53/), [AWS ACM](https://aws.amazon.com/certificate-manager/)
- [PlanetScale MySQL](https://planetscale.com/)
- [Vercel](https://vercel.com/)
- [Prisma Data Platform](https://www.prisma.io/data-platform)
- [Upstash Redis](https://docs.upstash.com/redis)
- [Google Analytics](https://analytics.google.com/analytics/web/)
- [Stripe](https://stripe.com/) 


# Development Setup

Prerequisites:

- [Node 16.13](https://nodejs.org/ko/blog/release/v16.13.0/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

Clone the repository:

```bash
git clone https://github.com/eventalapp/evental
```

Duplicate `.env.local.example` in each application (web, mobile & shared) and rename it to `.env`

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
