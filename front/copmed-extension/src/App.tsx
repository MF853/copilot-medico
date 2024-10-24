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

      // Executa o script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          alert('Hello from the page');
        },
      });
    } catch (error) {
      console.error('Erro ao executar o script:', error);
    }
  }

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