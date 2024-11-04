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
  
      // Executa o script para pegar o valor do input específico
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Seleciona o input pelo atributo 'f_prontuario' e retorna seu valor
          const inputElement = document.querySelector('input[f_prontuario="peso"]');
          return inputElement ? (inputElement as HTMLInputElement).value : null;
        },
      });
  
      // Verifica o resultado
      if (result && result[0]?.result !== null) {
        const inputValue = result[0].result;
        console.log('Valor do input:', inputValue);
      } else {
        console.error('Elemento input não encontrado ou sem valor');
      }
    } catch (error) {
      console.error('Erro ao capturar o valor do input:', error);
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