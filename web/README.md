# 🦌 DeerFlow Web UI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Originated from Open Source, give back to Open Source.

This is the web UI for [`DeerFlow`](https://github.com/bytedance/deer-flow).

## How to Install

DeerFlow Web UI uses `pnpm` as its package manager.
To install the dependencies, run:

```bash
cd web
pnpm install
```

## How to Run in Development Mode

> [!NOTE]
> Ensure the Python API service is running before starting the web UI.

Start the web UI development server:

```bash
cd web
pnpm dev
```

By default, the web UI will be available at `http://localhost:3000`.

You can set the `NEXT_PUBLIC_API_URL` environment variable if you're using a different host or location.

```ini
# .env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```


## License

This project is open source and available under the [MIT License](../LICENSE).

## Acknowledgments

We extend our heartfelt gratitude to the open source community for their invaluable contributions.
DeerFlow is built upon the foundation of these outstanding projects:

In particular, we want to express our deep appreciation for:
* [Next.js](https://nextjs.org/) for their exceptional framework
* [Shadcn](https://ui.shadcn.com/) for their minimalistic components that powers our UI
* [Zustand](https://zustand.docs.pmnd.rs/) for their stunning state management
* [Framer Motion](https://www.framer.com/motion/) for their amazing animation library
* [React Markdown](https://www.npmjs.com/package/react-markdown) for their exceptional markdown rendering and customizability
* Last but not least, special thanks to [SToneX](https://github.com/stonexer) for his great contribution for [token-by-token visual effect](./src/core/rehype/rehype-split-words-into-spans.ts)

These outstanding projects form the backbone of DeerFlow and exemplify the transformative power of open source collaboration.
