// utils.ts

// Função para extrair o conteúdo de um elemento com base no seletor CSS e índice
export const extractTextFromElement = (selector: string, index: number = 0): string | null => {
    const elements = document.querySelectorAll(selector);
    if (elements && elements.length > index) {
      return elements[index].textContent;
    }
    return null;
  };
  
  // Função para executar um script na aba ativa e retornar o resultado
  export const executeScriptOnActiveTab = (selector: string, index: number, callback: (result: string | null) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
  
      if (tabId !== undefined) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            func: extractTextFromElement,
            args: [selector, index]
          },
          (injectionResults) => {
            const result = injectionResults && injectionResults[0] && injectionResults[0].result !== undefined ? injectionResults[0].result : null;
            callback(result);
          }
        );
      }
    });
  };
  