// import axios from 'axios';

function opentab(tabname, event) {
    var currentActiveLink = document.querySelector(".active-link");
    if (currentActiveLink) {
        currentActiveLink.classList.remove("active-link");
    }

    var currentActiveTab = document.querySelector(".active-tab");
    if (currentActiveTab) {
        currentActiveTab.classList.remove("active-tab");
    }

    event.currentTarget.classList.add("active-link");

    var activeTabContent = document.getElementById(tabname);
    if (activeTabContent) {
        activeTabContent.classList.add("active-tab");
    } else {
        console.error("L'élément avec l'ID " + tabname + " n'a pas été trouvé.");
    }
}

var sidemeu = document.getElementById("sidemeu");
function openmenu() {
    sidemeu.style.right = "0";
}
function closemenu() {
    sidemeu.style.right = "-200px";
}

const scriptURL = 'https://script.google.com/macros/s/AKfycbwCgbvMf_6WWjmzxjaCqAs5HxEDJZ9T1MG0t69g9yCw_KahkyG4FhrtXjTLwEUegZ8_ww/exec';
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");
form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            msg.innerHTML = "Message envoyé avec succès, Merci ! ";
            setTimeout(function(){
                msg.innerHTML = "";
            }, 5000);
        })
        .catch(error => console.error('Error!', error.message));
});

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = chatInput.value;
    chatInput.value = "";

    chatMessages.innerHTML += `<div class="message user-message">
    <img src="./icons/user.png" alt="user icon"> <span>${message}</span>
    </div>`;

    try {
        // Make a request to your own server, which will proxy the request to the EDEN API
        const response = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: message,
                model: "text-davinci-003",
                temperature: 0,
                max_tokens: 1000,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la requête vers l\'API EDEN.');
        }

        const data = await response.json();
        const chatbotResponse = data.choices[0].text;

        chatMessages.innerHTML += `<div class="message bot-message">
        <img src="./icons/chatbot.png" alt="bot icon"> <span>${chatbotResponse}</span>
        </div>`;
    } catch (error) {
        console.error("Erreur!", error.message);
    }
});
