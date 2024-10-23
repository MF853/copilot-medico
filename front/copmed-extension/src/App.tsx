/// <reference types="chrome" />
import './App.css'

function App() {

  const onClick = async () => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
      target: {tabId: tab.id! },
      func: () => {
        alert('Hello from the page')
      },
    }
);
  }

  return (
    <>
      <h1>Copilot Médico</h1>
      <div className="card">
        <button onClick={onClick}>
          Click Me
        </button>
      </div>
    </>
  )
}

export default App
