This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
# first step
npm install
```

Copy .env.template to a .env file with this content

```
DB_USER="username-db"
DB_PASSWORD="some-pass"
DB_NAME="name-db"
```

start docker with `docker compose up`

then start the project

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.
