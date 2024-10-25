import './App.css'
import Chat from './modules/Chat/chat'

function App() {
  
  const onClick = async () => {
    try {
      // Verifica se chrome.tabs está disponível
      if (!chrome.tabs || !chrome.scripting) {
        console.error('Chrome APIs não estão disponíveis');
        return;
      }
  
      // Obtém a aba ativa
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
  
      if (!tab?.id) {
        console.error('Nenhuma aba ativa encontrada');
        return;
      }
  
      // Executa o script para pegar o HTML da página
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Retorna o HTML da página atual
          return document.documentElement.outerHTML;
        },
      });
  
      // Verifica o resultado
      if (result && result[0]?.result) {
        const pageHTML = result[0].result;
  
        // Envia o HTML da página para o background.js
        chrome.runtime.sendMessage({ type: 'SEND_HTML', html: pageHTML }, (response) => {
          console.log('Resposta do background:', response);
      });
        
      } else {
        console.error('Nenhum HTML capturado');
      }
    } catch (error) {
      console.error('Erro ao capturar o HTML:', error);
    }
  };
  
  return (
    <>
      <Chat/>
      <div className="card">
        <button onClick={onClick}>
          Click Me
        </button>
      </div>
    </>
  )
}

export default App