import { useState } from 'react';
import './App.css';
import Chat from './modules/Chat/chat';
import { executeScriptOnActiveTab } from './utils/utils';

function App() {
  const [debugSelector, setDebugSelector] = useState('.note-editable[role="textbox"]'); // Seletor padrão
  const [debugIndex, setDebugIndex] = useState(0); // Índice padrão
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  //htmls estáticos
  const [editableNotes] = useState(
    {
      selector: '.note-editable[role="textbox"]',
      roleAndIndex: [
        {
          role: 'Anamnese',
          index: 0
        },
        {
          role : 'Detalhes exame físico',
          index : 1
        },
        {
          role : 'Conclusão diagnóstica',
          index : 2
        },
        {
          role : 'lista de problemas',
          index : 3
        }

      ]
    }
  ); 

  

  const createInputs = async () => {
    const inputKeys = ["peso" , "altura" , "imc" , "tempe" , "freqres" , "freqcar" , "pas" , "pad"]
    let inputs = []

    for (let inputKey of inputKeys) {
      inputs.push({
        input: `input[f_prontuario="${inputKey}"]`,
        role: inputKey
      });

    }

   

    return inputs
  }

  

  const extractDinamicData = async () => {
    let extractedData = [];
    let inputs = await createInputs();
    
    for (let i = 0; i < inputs.length; i++) {
      const {input, role} = inputs[i];
      const result = await extractSingleDiv(input, 0);


      if (result) {
        extractedData.push({
          role,
          text: result
        });
      }
    }

    return extractedData;
  } 

  const extractEditableNotesData = async () => {
    let extractedData = [];
    
    for (let i = 0; i < editableNotes.roleAndIndex.length; i++) {
      const {role, index} = editableNotes.roleAndIndex[i];
      const result = await extractSingleDiv(editableNotes.selector, index);

      if (result) {
        extractedData.push({
          role,
          text: result
        });
      }
    }

    return extractedData;

  }

  const extractSingleDivDebug = async (selector : any , index : any) => {
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

  const extractSingleDiv = async (selector : any , index : any) => {
    try {
      const result = await executeScriptOnActiveTab(selector, index);
      if (result) {
        return result;
      } else {
        return null
      }
    } catch (error) {
      return null;
    }
  };


  const sendExtractedDataToServer = async (extractedData : any) => {
    try {
      const response = await fetch('http://localhost:3001/api/extracted-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(extractedData)
      });

      if (response.ok) {
        console.log('Dados extraídos enviados com sucesso');
        
        // Aguarda a conversão da resposta para JSON
        const dados = await response.json(); 
        
        console.log('Resposta:', dados.ai_response);
      } else {
        console.log('Erro ao enviar dados extraídos');
      }
      
    } catch (error) {
      console.error('Erro ao enviar dados extraídos:', error);
    }
  }
  
  const handleExtractData = async () => {
    try {
      // Extract both static and dynamic data concurrently
      const [staticData, dinamicData] = await Promise.all([
        extractEditableNotesData(),
        extractDinamicData()
      ]);
  
      // Combine the two arrays of extracted data
      const combinedData = [...staticData, ...dinamicData];

      
  
      // Send the combined data to the server
      await sendExtractedDataToServer(combinedData);
    } catch (error) {
      console.error('Erro ao extrair dados:', error);
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
                    value={debugSelector}
                    onChange={(e) => setDebugSelector(e.target.value)}
                    placeholder="Exemplo: .note-editable[role='textbox']"
                  />
                </label>
              </div>
              <div>
                <label>
                  Índice:
                  <input
                    type="number"
                    value={debugIndex}
                    onChange={(e) => setDebugIndex(parseInt(e.target.value, 10))}
                    min={0}
                  />
                </label>
              </div>
              <div>
                {extractedText && <p>Texto extraído: {extractedText}</p>}
              </div>
              <button onClick={() => extractSingleDivDebug(debugSelector , debugIndex)}>Extrair texto</button>


            </div>
          )
        }

        <button onClick={handleExtractData}>
          Extrair Dados
        </button>

      </div>
    </>
  );
}

export default App;