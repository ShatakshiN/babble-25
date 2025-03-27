/* 
document.addEventListener("DOMContentLoaded", function () {
    const users = [
        { name: "John Doe", image: "https://randomuser.me/api/portraits/men/1.jpg" },
        { name: "Jane Smith", image: "https://randomuser.me/api/portraits/women/2.jpg" },
        { name: "Mike Johnson", image: "https://randomuser.me/api/portraits/men/3.jpg" },
        { name: "Emily Davis", image: "https://randomuser.me/api/portraits/women/4.jpg" }
    ];
    
    const usersList = document.getElementById("users-list");
    users.forEach(user => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");
        userCard.innerHTML = `
            <div class="user-info">
                <img src="${user.image}" alt="${user.name}" class="user-img">
                <span class="fw-bold">${user.name}</span>
            </div>
            <button class="btn btn-primary">Chat</button>
        `;
        usersList.appendChild(userCard);
    });
});
 */
document.addEventListener("DOMContentLoaded", async function () {
    const usersList = document.getElementById("users-list");
    const token = localStorage.getItem('token');

    try {
        // Decode the JWT to get logged-in user ID
        const payload = JSON.parse(atob(token.split('.')[1])); 
        const loggedInUserId = payload.id;

        const response = await axios.get("http://localhost:4000/user/all", { headers: { 'auth-token': token } });

        if (!response.data.success) throw new Error("Failed to fetch users");

        response.data.users.forEach(user => {
             // Skip the logged-in user (extra check in case backend didn't exclude)
             if (user.id === loggedInUserId) return;
            const userCard = document.createElement("div");
            userCard.classList.add("user-card");

            userCard.innerHTML = `
                <div class="user-info">
                    <span class="fw-bold">${user.name}</span>
                </div>
                <button class="btn btn-primary chat-btn" data-user-id="${user.id}" data-user-name="${user.name}">Chat</button>
            `;

            usersList.appendChild(userCard);
        });

        // Add event listeners to chat buttons
        document.querySelectorAll(".chat-btn").forEach(button => {
            button.addEventListener("click", function () {
                const userId = this.getAttribute("data-user-id");
                const userName = this.getAttribute("data-user-name");

                // Store user data in localStorage
                localStorage.setItem("chatUserId", userId);
                localStorage.setItem("chatUserName", userName);

                // Redirect to chat window
                window.location.href = "chatWindow.html";
            });
        });

    } catch (error) {
        console.error("Error fetching users:", error);
    }
});

