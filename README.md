# Stellar Empires Stellapedia

A web application built with [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Chakra UI](https://chakra-ui.com/).  
Supports light and dark modes with a single toggle button.
Deployed to [GitHub Pages](https://pages.github.com/).

## Features

- ⚡ Modern React + TypeScript
- 🎨 Chakra UI with theming and dark/light mode toggle
- 🚀 Easy deployment to GitHub Pages
- 🛠️ Built with Create React App (CRA)

## Getting Started

See Installation

### Prerequisites

- Node.js (v20+ recommended)
- npm (v9+) or yarn

### Installation

```bash
git clone https://github.com/tcgm/StellarEmpires.git
cd StellarEmpires/stellar-empires
npm install
# or
yarn
```

### Development

```bash
npm start
# or
yarn start
```

Page will auto-open, or see URL and port in the terminal.

### Build

```bash
npm run build
# or
yarn build
```

This will create an optimized production build in the `build/` folder.

### Deployment

Deployed automatically on push to `master` using GitHub Actions (see `.github/workflows/static.yml`).

To deploy manually:

1. Run:

   ```bash
   npm run build
   npm run deploy
   ```

## Chakra UI Dark/Light Mode

Toggle dark/light mode via the button in the top-right corner (see `src/components/ColorModeSwitcher.tsx`).

You can customize colors and themes in `src/themes/chakraDark.ts` for even more control.

## Contributing

Pull requests are welcome!
Please open an issue first to discuss any major changes.

## License
```
MIT
```