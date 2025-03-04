
document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector("form");
    
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const username = document.querySelector("input[placeholder='Username']").value;
        const email = document.querySelector("input[placeholder='Email']").value;
        const phone = document.querySelector("input[placeholder='Contact No']").value;
        const password = document.querySelector("input[placeholder='password']").value;

        if (!username || !email || !phone || !password) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/user/create", {
                name: username,
                email: email,
                phone: phone,
                password: password,
            });

            if (response.data.success) {
                alert("Signup successful! Redirecting to login...");
                window.location.href = "login.html";
            } else {
                alert(response.data.msg || "Signup failed. Try again!");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("An error occurred. Please try again later.");
        }
    });

    // Profile Picture Preview
    document.getElementById("profilePicInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                document.getElementById("profilePicPreview").src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });
});
