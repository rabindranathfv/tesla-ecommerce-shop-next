This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy .env.template to .env.

3. Start PostgreSQL via Docker:

```bash
docker compose up -d
```

4. Run Prisma migrations:

```bash
npm run prisma:migrate -- --name init
```

5. Generate Prisma Client:

```bash
npm run prisma:generate
```

6. Seed the database:

```bash
npm run seed
```

7. Start the app:

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

## Prisma Commands

```bash
npm run prisma:generate
npm run prisma:migrate -- --name <migration_name>
npm run prisma:studio
npm run db:seed
```
