import { useState, useEffect } from 'react';
import './App.css';
import Chat from './modules/Chat/chat';
import { executeScriptOnActiveTab } from './utils/utils';

// Tipos de elementos editáveis
type EditableElementType =
  | 'input-text'      // <input type="text">
  | 'input-email'     // <input type="email">
  | 'input-password'  // <input type="password">
  | 'input-search'    // <input type="search">
  | 'input-tel'       // <input type="tel">
  | 'input-url'       // <input type="url">
  | 'input-number'    // <input type="number">
  | 'textarea'        // <textarea>
  | 'select'          // <select>
  | 'contenteditable' // elementos com contenteditable="true"
  | 'rich-text';      // editores de texto rico (detectados por classes/atributos específicos)

interface CapturedValue {
  value: string;
  elementType: EditableElementType;
  inputType?: string;
  tagName: string;
  id?: string;
  classes: string[];
  attributes: {
    role?: string;
    contenteditable?: string;
    placeholder?: string;
    name?: string;
  };
}

function App() {
  const [selector, setSelector] = useState('.note-editable[role="textbox"]');
  const [index, setIndex] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [clickedValue, setClickedValue] = useState<CapturedValue | null>(null);

  useEffect(() => {
    const injectClickListener = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              document.removeEventListener('click', window.customClickHandler);

              window.customClickHandler = (e: MouseEvent) => {
                const element = e.target as HTMLElement;
                let capturedValue: CapturedValue | null = null;

                const createBaseValue = (value: string, elementType: EditableElementType): CapturedValue => ({
                  value,
                  elementType,
                  tagName: element.tagName.toLowerCase(),
                  id: element.id || undefined,
                  classes: Array.from(element.classList),
                  attributes: {
                    role: element.getAttribute('role') || undefined,
                    contenteditable: element.getAttribute('contenteditable') || undefined,
                    placeholder: element.getAttribute('placeholder') || undefined,
                    name: element.getAttribute('name') || undefined,
                  }
                });

                // Verifica se é um elemento editável
                const isEditable =
                  element instanceof HTMLInputElement ||
                  element instanceof HTMLTextAreaElement ||
                  element instanceof HTMLSelectElement ||
                  element.getAttribute('contenteditable') === 'true' ||
                  element.closest('[contenteditable="true"]') !== null; // Pega elementos dentro de contenteditable

                if (isEditable) {
                  // 1. Input Elements
                  if (element instanceof HTMLInputElement) {
                    const inputType = element.type;
                    const textInputTypes = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'];

                    if (textInputTypes.includes(inputType)) {
                      capturedValue = createBaseValue(element.value, `input-${inputType}` as EditableElementType);
                      capturedValue.inputType = inputType;
                    }
                  }

                  // 2. Textarea
                  else if (element instanceof HTMLTextAreaElement) {
                    capturedValue = createBaseValue(element.value, 'textarea');
                  }

                  // 3. Select
                  else if (element instanceof HTMLSelectElement) {
                    capturedValue = createBaseValue(element.value, 'select');
                  }

                  // 4. Contenteditable ou Rich Text Editor
                  else if (element.getAttribute('contenteditable') === 'true' ||
                          element.closest('[contenteditable="true"]')) {
                    const elementToCheck = element.getAttribute('contenteditable') === 'true' ?
                      element :
                      element.closest('[contenteditable="true"]');

                    if (elementToCheck) {
                      const isRichText =
                        elementToCheck.classList.contains('note-editable') ||
                        elementToCheck.classList.contains('ck-editor__editable') ||
                        elementToCheck.classList.contains('tox-edit-area__iframe') ||
                        elementToCheck.getAttribute('role') === 'textbox';

                      capturedValue = createBaseValue(
                        elementToCheck.textContent || '',
                        isRichText ? 'rich-text' : 'contenteditable'
                      );
                    }
                  }

                  if (capturedValue) {
                    console.log('Valor capturado:', capturedValue);
                    chrome.runtime.sendMessage({
                      type: 'ELEMENT_VALUE',
                      payload: capturedValue
                    });
                  }
                }
              };

              document.addEventListener('click', window.customClickHandler);
            },
          });
        }
      });
    };

    injectClickListener();

    const messageListener = (message: any) => {
      if (message.type === 'ELEMENT_VALUE') {
        setClickedValue(message.payload);
        console.log('Valor capturado:', message.payload);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              document.removeEventListener('click', window.customClickHandler);
            },
          });
        }
      });
    };
  }, []);

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
  };

  return (
    <>
      <Chat />
      <div className="card">
        <button onClick={handleDebugMode}>Debug</button>
        {debugMode && (
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
            <div>
              {clickedValue && (
                <div>
                  <h4>Último elemento clicado:</h4>
                  <pre className="bg-gray-100 p-2 rounded">
                    {JSON.stringify(clickedValue, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <button onClick={onClick}>Extrair texto</button>
          </div>
        )}
      </div>
    </>
  );
}

declare global {
  interface Window {
    customClickHandler: (e: MouseEvent) => void;
  }
}

export default App;