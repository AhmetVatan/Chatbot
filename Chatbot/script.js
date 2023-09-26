const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY ="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";
const inputInitHeight = chatInput.scrollHeight;

const creatChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat" , className);
    let chatContent = className == "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;  
    chatLi.innerHTML = chatContent ;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const  generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement =incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify ({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage }]
        })
    }
    // Send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) =>{
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value="";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatBox.appendChild(creatChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);



    setTimeout(() =>{
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi =creatChatLi("Thinking...", "incoming")
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

chatInput.addEventListener("input", () =>{
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) =>{
    // If Enter key is pressed without Shift key anda the window
    // width is greater than 800px, handle the chat.
   if(e.key == "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
   }
});

sendChatBtn.addEventListener("click",handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));