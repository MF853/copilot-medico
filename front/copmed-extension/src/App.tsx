// App.tsx
import { useState } from 'react';
import './App.css';
import Chat from './modules/Chat/chat';
import { executeScriptOnActiveTab } from './utils/utils.ts';

function App() {
  const [selector, setSelector] = useState('.note-editable[role="textbox"]'); // Seletor padrão
  const [index, setIndex] = useState(0); // Índice padrão
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const onClick = () => {
    executeScriptOnActiveTab(selector, index, (result : any) => {
      if (result) {
        setExtractedText(result);
        console.log('Texto extraído:', result);
      } else {
        console.log('Não foi possível extrair o texto');
      }
    });
  };

  return (
    <>
      <Chat />
      <div className="card">
        <button onClick={onClick}>Click Me</button>
        <div>
          <label>
            Seletor CSS:
            <input 
              type="text" 
              value={selector} 
              onChange={(e) => setSelector(e.target.value)} 
              placeholder="Exemplo: .note-editable[role='textbox']"
            />
          </label>
        </div>
        <div>
          <label>
            Índice:
            <input 
              type="number" 
              value={index} 
              onChange={(e) => setIndex(parseInt(e.target.value, 10))} 
              min={0}
            />
          </label>
        </div>
        <div>
          {extractedText && <p>Texto extraído: {extractedText}</p>}
        </div>
      </div>
    </>
  );
}

export default App;
