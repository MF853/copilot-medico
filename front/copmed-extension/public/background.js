chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SEND_HTML') {
      const pageHTML = request.html;
  
      // Imprime o HTML recebido no console
      console.log('HTML da página recebido:', pageHTML);
  
      // Responde para o React app confirmando o recebimento
      sendResponse({ status: 'HTML recebido com sucesso no background' });
    }
  });
  