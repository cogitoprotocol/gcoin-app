# Gcoin App

App for interacting with the Cogito Protocol.

## Setup

Ensure the [gcoin](https://github.com/cogitoprotocol/GCoin) repo exists in the same parent directory.

Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
nvm i --lts
npm i
```

## Development

We need the ABIs and contract addresses from foundry to generate [wagmi hooks](https://wagmi.sh/cli/getting-started).

Running the development server will do this automatically:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

Generates a static export that can be hosted on IPFS or traditional cloud.

```bash
npm run build
npx serve@latest out
```
