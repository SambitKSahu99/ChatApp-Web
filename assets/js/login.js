// Example function to handle login
function loginUser() {
    const token = sessionStorage.getItem('jwtToken')
    if(token){
        alert('You need to logout first')
        return;
    }
    event.preventDefault(); // Prevent default form submission behavior

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Assuming your login API endpoint is 'auth/login'
    const url = config.authBaseUrl+config.loginEndpoint;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set content type to application/json
        },
        body: JSON.stringify({ userName:username, password:password })
    })
    .then(async response => {
        // Check if the response is OK (status in the range 200-299)
        if (response.ok) {
            return response.json(); // Parse JSON data if response is okay
        } else {
            // If response is not okay, handle different status codes
            const data_1 = await response.json();
            throw new Error(data_1.response || 'Login failed');
        }
    })
    .then(data => {
        const currentUser = data.response.userName;
        console.log(currentUser)
        const token = data.response.token;
        sessionStorage.setItem('currentLoggedInuser', currentUser);
        sessionStorage.setItem("jwtToken", token);
        alert('Login successful!'); 
    // Notify user of successful login
        // Redirect to the homepage or messages page
        window.location.href = 'index.html';
    })
    .catch(error => {
        // Handle errors (failed login or other issues)
        alert('Error: ' + error.message);
    });
}
