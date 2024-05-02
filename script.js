document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the form from submitting traditionally
    const message = chatInput.value;
    chatInput.value = ""; // Clear the input after sending

    // Add the user's message to the chat window with a user icon
    chatMessages.innerHTML += `<div class="message user-message">
       <i class="fa-solid fa-user"></i> <span>${message}</span>
       </div>`;

    try {
      const response = await fetch("http://localhost:8002/talk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message })
      });

      if (!response.ok) {
        throw new Error("Error while fetching from the API.");
      }

      const data = await response.json();
      const chatbotResponse = data.generated_text; // Accessing the generated_text from the response

      // Add the chatbot's response to the chat window with a robot icon
      chatMessages.innerHTML += `<div class="message bot-message">
           <i class="fa-solid fa-robot"></i> <span>${chatbotResponse}</span>
           </div>`;
    } catch (error) {
      console.error("Error!", error.message);
    }
});

});



