import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import DobleHueso from './minigames/doble-hueso';
import Trucos from './minigames/trucos';
import doble from '../content/doble-hueso.json';
import trucos from '../content/trucos.json';

function Preview() {
  const [game, setGame] = useState('doble-hueso');
  const [chispa, say] = useState('');
  const [outcome, setOutcome] = useState('');
  return <main style={{ padding: '16px', fontFamily: 'system-ui', color: '#243B53' }}>
    <nav style={{ display: 'flex', gap: 12, maxWidth: 1020, margin: '0 auto 12px' }}>
      <button onClick={() => { setGame('doble-hueso'); setOutcome(''); }}>Doble Hueso</button>
      <button onClick={() => { setGame('trucos'); setOutcome(''); }}>Trucos</button>
      <span style={{ fontSize: 12 }}>Banco de pruebas · backend real · no es D01</span>
    </nav>
    {game === 'doble-hueso' ? <DobleHueso key={game} config={doble} onWin={() => setOutcome('onWin recibido')} onDisaster={id => setOutcome(`onDisaster: ${id}`)} chispaSay={say} /> :
      <Trucos key={game} config={trucos} onWin={circuit => setOutcome(`onWin recibido: ${JSON.stringify(circuit)}`)} onDisaster={id => setOutcome(`onDisaster: ${id}`)} chispaSay={say} />}
    <aside style={{ maxWidth: 1020, margin: '12px auto', fontSize: 13 }}><strong>Chispa:</strong> {chispa}<p role="status">{outcome}</p></aside>
  </main>;
}
createRoot(document.getElementById('root')!).render(<Preview />);
