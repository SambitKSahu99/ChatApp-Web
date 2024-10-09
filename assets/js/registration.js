// Function to validate the registration form
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
        const username = document.getElementById('username').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorMessageDiv = document.getElementById('errorMessage');
        errorMessageDiv.textContent = '';
    // Basic validation
    if (username.trim() === '' || firstName.trim() === '' || lastName.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
        errorMessageDiv.textContent = 'All fields are required.';
        return;
    }  
    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessageDiv.textContent = 'Passwords do not match.';
        return;
    }
    registerUser(username, firstName,lastName,password); // Call the same function for registration
});

function registerUser(username, firstName,lastName,password) {
    const url = config.userBaseUrl+config.registerEndPoint;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username,firstName:firstName, lastName:lastName, password: password })
    })
    .then(async response => {
        if (response.ok) {
            alert('Registration Successful')
            window.location.href = 'login.html';  
        } 
        else{
            const errData = await response.json();
            throw new Error(errData.response);
        }
    })  
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').textContent = error.message || 'Registration failed.';
    });
}