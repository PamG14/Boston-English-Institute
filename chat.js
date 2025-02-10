document.addEventListener("DOMContentLoaded", function () {
    const chatButton = document.getElementById("chat-button");
    const chatContainer = document.getElementById("chat-container");
    const closeChat = document.getElementById("close-chat");
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const faqResponses = {
        "hola": "¡Hola!",
        "días y horarios": "Nuestros cursos se dictan de lunes a jueves por la tarde. Contáctanos para más detalles.",
        "clases los fines de semana": "Actualmente, no ofrecemos clases los fines de semana.",
        "cambiar el horario": "Los cambios de horario están sujetos a disponibilidad. Por favor, consulta con administración.",
        "precio": "Los precios varían según el curso. Contáctanos para obtener más información.",
        "formas de pago": "Aceptamos transferencias bancarias, tarjetas de crédito y débito.",
        "descuentos": "Ofrecemos descuentos por pago anticipado y promociones especiales. Consulta nuestras ofertas vigentes.",
        "cuotas": "Dependiendo del curso, ofrecemos facilidades de pago en cuotas.",
        "niveles de inglés": "Ofrecemos cursos desde nivel básico hasta avanzado.",
        "clases individuales": "Contamos con clases individuales y grupales. Pregunta por disponibilidad.",
        "clases online": "Sí, ofrecemos clases tanto presenciales como online.",
        "certificaciones": "Al completar un curso, recibirás un certificado. También preparamos para exámenes internacionales."
    };

    function sendMessage() {
        const userText = userInput.value.trim().toLowerCase();
        if (!userText) return;
        
        appendMessage("Tú", userText);
        let response = "No tengo esa información en este momento. Por favor, consulta con administración.";

        for (let key in faqResponses) {
            if (userText.includes(key)) {
                response = faqResponses[key];
                break;
            }
        }
        
        setTimeout(() => appendMessage("Vainilla", response), 500);
        userInput.value = "";
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        if (sender === "Vainilla") {
            messageDiv.classList.add("assistant");
            messageDiv.innerHTML = `
                <img src="conejo.png" alt="Bunny" class="bunny-icon">
                <div class="bubble"><strong>${sender}:</strong> ${text}</div>
            `;
        } else {
            messageDiv.classList.add("user");
            messageDiv.innerHTML = `<div class="bubble"><strong>${sender}:</strong> ${text}</div>`;
        }
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 💡 Función para alternar el chat (abrir/cerrar)

    chatButton.addEventListener("click", function () {
    if (chatContainer.classList.contains("hidden")) {
        chatContainer.classList.remove("hidden"); // Mostrar el chat
    } else {
        chatContainer.classList.add("hidden"); // Ocultar el chat
    }
});

    

    // 💡 Función para cerrar el chat con el botón "X"
   // closeChat.addEventListener("click", function () {
   //     chatContainer.classList.add("hidden");
    //});

    // 💡 Enviar mensaje con botón o tecla Enter
    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });
});
