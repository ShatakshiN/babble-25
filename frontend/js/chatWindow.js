/* document.addEventListener("DOMContentLoaded", async function () {
    const chatHeader = document.querySelector(".chat-header span");
    const chatBox = document.querySelector(".chat-box");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-btn");

    const chatUserId = localStorage.getItem("chatUserId");
    const chatUserName = localStorage.getItem("chatUserName");
    const token = localStorage.getItem("token");
    
    const socket = io('http://localhost:4000', {
        transports: ['websocket'], // Force WebSockets
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

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
            response.data.messages.forEach(msg => appendMessage(msg));
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    function appendMessage(msg) {
        const msgElement = document.createElement("p");
        msgElement.classList.add("p-2", "rounded", "w-50");
        msgElement.textContent = msg.text;
    
        if (msg.senderId === parseInt(localStorage.getItem("chatUserId"))) {
            msgElement.classList.add("sent");
        } else {
            msgElement.classList.add("received");
        }
        
        chatBox.appendChild(msgElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
    }

    await loadMessages();

    // Listen for new messages via Socket.IO
    socket.on("newMessage", (msg) => {
        appendMessage(msg);
    });

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
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
});
 */

document.addEventListener("DOMContentLoaded", async function () {
    const chatHeader = document.querySelector(".chat-header span");
    const chatBox = document.querySelector(".chat-box");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-btn");
    const sideBarList = document.getElementById("sideBarList");

    const chatUserId = localStorage.getItem("chatUserId");
    const chatUserName = localStorage.getItem("chatUserName");
    const token = localStorage.getItem("token");

    const socket = io("http://127.0.0.1:4000", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    if (!token) {
        alert("Unauthorized! Please log in.");
        window.location.href = "login.html";
        return;
    }

    // Load previous chat list
    async function loadChatList() {
        try {
            const response = await axios.get("http://localhost:4000/chat/previous-chat", {
                headers: { "auth-token": token }
            });

            sideBarList.innerHTML = ""; // Clear sidebar before adding users

            response.data.users.forEach(user => {
                const chatItem = document.createElement("a");
                chatItem.href = "#";
                chatItem.classList.add("list-group-item", "list-group-item-action", "bg-transparent", "text-white", "border-0", "d-flex", "align-items-center");
                chatItem.innerHTML = `
                    <img src="../css/images.png" class="profile-pic me-2">
                    <span>${user.name}</span>
                `;

                // Click event to load chat messages
                chatItem.addEventListener("click", () => {
                    localStorage.setItem("chatUserId", user.id);
                    localStorage.setItem("chatUserName", user.name);
                    loadMessages(user.id);
                    chatHeader.textContent = user.name;
                });

                sideBarList.appendChild(chatItem);
            });

        } catch (error) {
            console.error("Error loading chat list:", error);
        }
    }

    // Load previous messages
    async function loadMessages(userId = chatUserId) {
        if (!userId) return;
        try {
            const response = await axios.get(`http://localhost:4000/chat/messages/${userId}`, {
                headers: { "auth-token": token }
            });

            chatBox.innerHTML = ""; // Clear previous messages
            response.data.messages.forEach(msg => appendMessage(msg));
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    function appendMessage(msg) {
        const msgElement = document.createElement("p");
        msgElement.classList.add("p-2", "rounded", "w-50");
        msgElement.textContent = msg.text;

        if (msg.senderId === parseInt(localStorage.getItem("chatUserId"))) {
            msgElement.classList.add("sent", "bg-success");
        } else {
            msgElement.classList.add("received", "bg-secondary", "ms-auto");
        }

        chatBox.appendChild(msgElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
    }

    // Load sidebar chat list and previous messages
    await loadChatList();
    if (chatUserId) {
        chatHeader.textContent = chatUserName;
        await loadMessages();
    }

    // Listen for new messages via Socket.IO
    socket.on("newMessage", (msg) => {
        if (msg.senderId === chatUserId || msg.receiverId === chatUserId) {
            appendMessage(msg);
        }
    });

    // Send message
    sendButton.addEventListener("click", async function () {
        const message = messageInput.value.trim();
        if (message === "") return;

        try {
            const response = await axios.post("http://localhost:4000/chat/send", {
                receiverId: chatUserId,
                text: message
            }, { headers: { "auth-token": token } });

            if (response.data.success) {
                messageInput.value = "";
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
});
