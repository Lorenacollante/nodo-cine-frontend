// src/App.jsx
import React, { useState } from "react";

import AppRouter from "./Router/AppRouter.jsx";
import WatchlistModal from "./Component/Shared/WatchlistModal.jsx";

export default function App() {
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  const openWatchlist = () => setIsWatchlistOpen(true);
  const closeWatchlist = () => setIsWatchlistOpen(false);

  return (
    <>
      <AppRouter openWatchlist={openWatchlist} />

      <WatchlistModal isOpen={isWatchlistOpen} onClose={closeWatchlist} />
    </>
  );
}
