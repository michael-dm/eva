# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Create a `.env` file `cp .env.example .env`

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm prisma migrate dev
pnpm prisma generate
pnpm run dev
```

## Production

Build the application for production and package it with electron-builder

```bash
pnpm run build
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Credits
- https://github.com/awohletz/electron-prisma-trpc-example
