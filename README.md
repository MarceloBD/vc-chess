# ChessLink

Real-time multiplayer chess built with Next.js. Create a game, share the link, and play with a friend — no account required.

## Features

- **Instant games** — click "New Game" and share the invite link
- **Real-time moves** — powered by Pusher WebSockets
- **Full chess rules** — move validation, check, checkmate, stalemate, and draw detection via chess.js
- **Pawn promotion** — choose your promotion piece through a UI prompt
- **Check highlighting** — king square highlighted in red when in check
- **Move history** — PGN-style notation panel
- **Copy invite link** — one-click clipboard copy
- **No accounts** — player identity stored in localStorage
- **Dark theme** — clean, minimal UI

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Chess logic | [chess.js](https://github.com/jhlywa/chess.js) |
| Board | [react-chessboard](https://github.com/Clariity/react-chessboard) |
| Real-time | [Pusher Channels](https://pusher.com/channels) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Language | TypeScript 5 |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A free [Pusher](https://pusher.com/) account (Channels product)

### 1. Clone the repository

```bash
git clone https://github.com/MarceloBD/vc-chess.git
cd vc-chess
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your Pusher credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
PUSHER_APP_ID=your_app_id
NEXT_PUBLIC_PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

You can find these values in your Pusher dashboard under **App Keys**.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. Click **New Game** on the home page
2. Copy the invite link and send it to your opponent
3. Once they open the link, the game begins automatically
4. White moves first — drag and drop pieces to make moves

## Project Structure

```
src/
├── app/
│   ├── api/game/          # REST endpoints (create, join, move, get)
│   ├── game/[gameId]/     # Game page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── chess-board/       # Interactive chess board
│   ├── game-info/         # Game status display
│   ├── invite-link/       # Copy-to-clipboard invite link
│   └── move-history/      # PGN move list
├── enums/                 # GameStatus, PlayerColor
├── hooks/                 # useGame, usePlayerId
└── lib/
    ├── game/              # In-memory store and types
    └── pusher/            # Pusher client and server instances
```

## Production Notes

- Game state is stored **in-memory**. Restarting the server clears all active games.
- For production deployments with multiple instances, replace the in-memory store (`src/lib/game/store.ts`) with a persistent store like [Redis](https://redis.io/) or [Upstash](https://upstash.com/).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).
