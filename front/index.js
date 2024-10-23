async function sayHello() {
    let [tab] = await chrome.tabs.query({active: true});
    chrome.scripting.executeScript({
        target : {tabId: tab.id},
        function: () => {
            document.body
            alert('Hello from my extension!');
        }
    });
}

document.getElementById('myButton').addEventListener('click', sayHello);