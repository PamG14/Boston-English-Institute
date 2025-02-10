document.addEventListener("DOMContentLoaded", function () {
    const chatButton = document.getElementById("chat-button");
    const chatContainer = document.getElementById("chat-container");
    const closeChat = document.getElementById("close-chat");
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    
    const faqResponses = {
        "días y horarios": "Nuestros cursos se dictan de lunes a viernes en distintos horarios. Contáctanos para más detalles.",
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
    
    function findBestMatch(userText) {
        let bestMatch = "";
        let highestScore = 0;
        
        for (let key in faqResponses) {
            let score = similarity(userText, key);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = key;
            }
        }
        
        return highestScore > 0.5 ? faqResponses[bestMatch] : "No tengo esa información en este momento. Por favor, consulta con administración.";
    }
    
    function similarity(s1, s2) {
        let longer = s1.length > s2.length ? s1 : s2;
        let shorter = s1.length > s2.length ? s2 : s1;
        let longerLength = longer.length;
        if (longerLength === 0) return 1.0;
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }
    
    function editDistance(s1, s2) {
        let costs = new Array();
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }
    
    function sendMessage() {
        const userText = userInput.value.trim().toLowerCase();
        if (!userText) return;

        appendMessage("Tú", userText);
        let response = findBestMatch(userText);
        
        setTimeout(() => appendMessage("Vainilla", response), 500);
        userInput.value = "";
    }
    
    function appendMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });
    
    chatButton.addEventListener("click", function () {
        chatContainer.style.display = "block";
    });
    
    closeChat.addEventListener("click", function () {
        chatContainer.style.display = "none";
    });
});

