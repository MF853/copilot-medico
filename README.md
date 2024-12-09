# Co-pilot Médico

**Co-pilot Médico** 

## Requisitos

### Backend
- **Linguagens e Frameworks**:
  - Python
  - Flask

### Frontend
- **Tecnologias**:
  - JavaScript
  - Extensão Chrome

### Dependências

Certifique-se de instalar as dependências necessárias antes de iniciar o projeto.

#### Backend

1. Instale o Flask e a biblioteca OpenAI executando:
   ```bash
   pip install openai flask
   ```

#### Frontend

1. Navegue para o diretório `front/copmed-extension`:
   ```bash
   cd front/copmed-extension
   ```

2. Instale as dependências do Node.js:
   ```bash
   npm install
   ```

3. Compile o código para gerar a extensão:
   ```bash
   npm run build
   ```

4. Após a compilação, utilize a pasta `dist` como a extensão para o Chrome.

---

## Usando a Extensão no Chrome

### Passo a Passo para Carregar a Extensão no Modo Desenvolvedor

1. Abra o Chrome e acesse a página de extensões:
   - No navegador, clique em **Menu (três pontos no canto superior direito) > Mais ferramentas > Extensões**, ou simplesmente acesse `chrome://extensions` na barra de endereço.

2. Ative o **Modo Desenvolvedor**:
   - Na parte superior direita da página de extensões, ative o botão de **Modo desenvolvedor**.

3. Carregue a extensão:
   - Clique no botão **Carregar sem compactação** (ou **Load unpacked**).
   - Navegue até o diretório `dist` gerado no passo anterior e selecione-o.

4. Teste a extensão:
   - A extensão deve aparecer na sua barra de ferramentas. Clique nela para começar a usar!

---



