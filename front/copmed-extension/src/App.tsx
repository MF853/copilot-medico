import { useState } from 'react';
import './App.css';
import Chat from './modules/Chat/chat';
import { executeScriptOnActiveTab } from './utils/utils';

function App() {
  const [selector, setSelector] = useState('.note-editable[role="textbox"]'); // Seletor padrão
  const [index, setIndex] = useState(0); // Índice padrão
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);


  const onClick = async () => {
    try {
      const result = await executeScriptOnActiveTab(selector, index);
      if (result) {
        setExtractedText(result);
        console.log('Texto extraído:', result);
      } else {
        console.log('Não foi possível extrair o texto');
      }
    } catch (error) {
      console.error('Erro ao executar o script:', error);
    }
  };

  const handleDebugMode = () => {
    setDebugMode(!debugMode);
  }

  return (
    <>
      <Chat />
      <div className="card">
        <button onClick={handleDebugMode}>Debug</button>
        {
          debugMode && (
            <div>
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
              <button onClick={onClick}>Extrair texto</button>
            </div>
          )
        }

      </div>
    </>
  );
}

export default App;