# Gcoin App

App for interacting with the Cogito Protocol.

## Setup

Clone the [gcoin](https://github.com/cogitoprotocol/GCoin) repo. By default we assume it exists in the same parent directory.

Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
nvm i --lts
npm i
```

## Environment Variables

```sh
# Specify the path to your gcoin repo if it's not in the same parent directory
GCOIN_DIR=...
```

## Development

We need the ABIs and contract addresses from foundry to generate [wagmi hooks](https://wagmi.sh/cli/getting-started).

Running the development server will do this automatically:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

When contracts are modified or deployed, you need to update contract ABIs and addresses:

```bash
npm run wagmi
```

## Build

Generates a static export that can be hosted on IPFS or traditional cloud.

```bash
npm run build
npm run serve
```

### Notes

If you see this error when building, just try it again.

```
Type error: Type instantiation is excessively deep and possibly infinite.
```
