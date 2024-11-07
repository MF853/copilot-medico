import './App.css'
import Chat from './modules/Chat/chat'

function App() {

  // Função para buscar o valor de um elemento input pelo atributo f_prontuario
  const getInputValueByProntuario = async (prontuarioAttr: string): Promise<string | null> => {
    // Verifica se as APIs do Chrome estão disponíveis
    if (!chrome.tabs || !chrome.scripting) {
      console.error('Chrome APIs não estão disponíveis');
      return null;
    }

    // Obtém a aba ativa do navegador
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Verifica se uma aba ativa foi encontrada
    if (!tab?.id) {
      console.error('Nenhuma aba ativa encontrada');
      return null;
    }

    // Executa um script na aba ativa para buscar o valor do input com base no atributo f_prontuario
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (attr) => {
        // Busca o input pelo atributo f_prontuario
        const inputElement = document.querySelector(`input[f_prontuario="${attr}"]`) as HTMLInputElement;
        // Retorna o valor do input ou null caso não exista
        return inputElement ? inputElement.value : null;
      },
      args: [prontuarioAttr], // Passa o atributo f_prontuario para a função
    });

    // Verifica se o valor foi encontrado e o retorna
    if (result && result[0]?.result !== undefined && result[0].result !== null) {
      return result[0].result as string;
    } else {
      // Caso não tenha encontrado o input ou o valor esteja vazio
      console.error(`Elemento input com f_prontuario="${prontuarioAttr}" não encontrado ou sem valor`);
      return null;
    }
  };

  // Função para buscar o conteúdo de divs com conteúdo editável
  const getEditableDivTextByProntuario = async (prontuarioAttr: string): Promise<string | null> => {
    // Verifica se as APIs do Chrome estão disponíveis
    if (!chrome.tabs || !chrome.scripting) {
      console.error('Chrome APIs não estão disponíveis');
      return null;
    }

    // Obtém a aba ativa do navegador
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Verifica se uma aba ativa foi encontrada
    if (!tab?.id) {
      console.error('Nenhuma aba ativa encontrada');
      return null;
    }

    // Executa um script na aba ativa para buscar o conteúdo de uma div editável com base no atributo f_prontuario
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (attr) => {
        // Busca a div editável pelo atributo f_prontuario e a classe correspondente
        const divElement = document.querySelector(`div[f_prontuario="${attr}"].note-editable.card-block`);
        // Retorna o conteúdo da div ou null caso não exista
        return divElement ? divElement.textContent?.trim() : null;
      },
      args: [prontuarioAttr], // Passa o atributo f_prontuario para a função
    });

    // Verifica se o conteúdo da div foi encontrado e o retorna
    if (result && result[0]?.result !== undefined && result[0].result !== null) {
      return result[0].result as string;
    } else {
      // Caso não tenha encontrado a div ou o conteúdo esteja vazio
      console.error(`Elemento div com f_prontuario="${prontuarioAttr}" não encontrado ou sem valor`);
      return null;
    }
  };

  // Função principal chamada ao clicar no botão
  const onClick = async () => {
    try {
      // Lista dos campos f_prontuario para inputs (campos de dados numéricos)
      const inputCampos = ["peso", "altura", "imc", "tempe", "freqres", "freqcar", "pas", "pad"];
      for (const campo of inputCampos) {
        // Busca o valor de cada input e imprime no console
        const valor = await getInputValueByProntuario(campo);
        if (valor !== null) {
          console.log(`Valor de ${campo}: ${valor}`);
        }
      }

      // Lista dos campos f_prontuario para divs editáveis (campos de texto, como queixa(anamnese) e conduta(diagnostico))
      const divCampos = ["queixa", "listpro", "descfis", "conduta"]; 
      for (const campo of divCampos) {
        // Busca o conteúdo de cada div editável e imprime no console
        const valorDiv = await getEditableDivTextByProntuario(campo);
        if (valorDiv !== null) {
          console.log(`Conteúdo de ${campo}: ${valorDiv}`);
        }
      }

    } catch (error) {
      // Captura qualquer erro ocorrido durante a captura dos valores e imprime no console
      console.error('Erro ao capturar valores dos elementos:', error);
    }
  };

  return (
    <>
      <Chat />
      <div className="card">
        <button onClick={onClick}>
          Click Me
        </button>
      </div>
    </>
  );
}

export default App;

