import React from 'react';
import { BrainConsole } from './brain/BrainConsole';
import { ChispaBubble } from './meta/chispa/ChispaBubble';
import { AlbumModal } from './meta/cromos/AlbumModal';
import { CromoModal } from './meta/cromos/CromoModal';
import { Hud } from './world/Hud';
import { World } from './world/World';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <World />
      <Hud />
      <BrainConsole />
      <CromoModal />
      <AlbumModal />
      <ChispaBubble />
    </div>
  );
}
