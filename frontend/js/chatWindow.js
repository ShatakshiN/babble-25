/* document.getElementById('search-icon').addEventListener('click', function() {
    document.getElementById('search-bar').classList.toggle('d-none');
});
document.getElementById('attach-icon').addEventListener('click', function() {
    document.getElementById('attachment-menu').classList.toggle('d-block');
}); */

document.addEventListener("DOMContentLoaded", async function () {
    const chatHeader = document.querySelector(".chat-header span");
    const chatBox = document.querySelector(".chat-box");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-btn");

    const chatUserId = localStorage.getItem("chatUserId");
    const chatUserName = localStorage.getItem("chatUserName");
    const token = localStorage.getItem("token");

    if (!chatUserId || !chatUserName) {
        alert("No chat user selected.");
        window.location.href = "userList.html";
        return;
    }

    // Set chat header
    chatHeader.textContent = chatUserName;

    // Fetch previous messages
    async function loadMessages() {
        try {
            const response = await axios.get(`http://localhost:4000/chat/messages/${chatUserId}`, {
                headers: { 'auth-token': token }
            });

            chatBox.innerHTML = ""; // Clear previous messages
            /* response.data.messages.forEach(msg => {
                const msgElement = document.createElement("p");
                msgElement.classList.add("p-2", "rounded", "w-50");
                msgElement.textContent = msg.text;

                if (msg.senderId === chatUserId) {
                    msgElement.classList.add("bg-success");
                } else {
                    msgElement.classList.add("bg-secondary", "ms-auto");
                }

                chatBox.appendChild(msgElement);
            }); */
            response.data.messages.forEach(msg => {
                const msgElement = document.createElement("p");
                msgElement.classList.add("p-2", "rounded", "w-50");
            
                msgElement.textContent = msg.text;

                console.log(msg.senderId , chatUserId)
                if (msg.senderId === parseInt(localStorage.getItem("chatUserId"))) {
                    //msgElement.classList.add("bg-secondary", "ms-auto", "text-white", "text-end"); // Right side for sender
                    msgElement.classList.add("sent");
                } else {
                    //msgElement.classList.add("bg-success", "text-white", "text-start"); // Left side for receiver
                    msgElement.classList.add("received"); // Apply left-aligned style
                }
                
                chatBox.appendChild(msgElement);
            });


        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    await loadMessages();

    // Send message
    sendButton.addEventListener("click", async function () {
        const message = messageInput.value.trim();
        if (message === "") return;

        try {
            const response = await axios.post("http://localhost:4000/chat/send", {
                receiverId: chatUserId,
                text: message
            }, { headers: { 'auth-token': token } });

            if (response.data.success) {
                messageInput.value = "";
                await loadMessages(); // Reload messages
            }

        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
});
