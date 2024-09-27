// Function to validate the registration form
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const actionType = document.getElementById('actionType').value;

        // Extract form values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorMessageDiv = document.getElementById('errorMessage');

        // Clear previous error message
        errorMessageDiv.textContent = '';
    // Basic validation
    if (username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
        errorMessageDiv.textContent = 'All fields are required.';
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessageDiv.textContent = 'Passwords do not match.';
        return;
    }

    // You can add additional checks here (e.g., password strength)

    // If all validations pass, proceed with registration
    if (actionType === 'register') {
        registerOrUpdateUser(username, password, 'register'); // Call the same function for registration
    } else if (actionType === 'update') {
        registerOrUpdateUser(username, password, 'update'); // Call the same function for updating
    }
});

// Function to handle registration (this could be sending data to a backend API)
function registerOrUpdateUser(username, password,action) {
    // Example: Send data to a backend API
    if (action === 'register') {
        const url = config.userBaseUrl+config.registerEndPoint;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, password: password })
    })
    .then(async response => {
        if (!response.ok) {
            // If the response is not ok, throw an error
            const errData = await response.json();
            throw new Error(errData.response); // Throw the first error message
        }
        return response.json(); // Parse JSON if response is ok
    })
    .then(data => {
        alert(data.response)
        window.location.href = 'login.html'; // Redirect to login page after registration
            
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').textContent = error.message || 'Registration failed.';
    });
    }
    else if(action === 'update'){
        const token = sessionStorage.getItem('jwtToken');
        const url = config.userBaseUrl+config.updateUserEndPoint;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userName: username, password: password })
        })
        .then(async response => {
            if(response.ok){
                return response.json()
            }else if(response.status === 403) {
                console.log('Token is invalid or expired (403 Forbidden)');
            }
            const errData = await response.json();
            throw new Error(errData.response);
        })
        .then(data => {
            alert(data.response+' updated successfully, You need to login again');
            sessionStorage.removeItem('jwtToken')
            sessionStorage.removeItem('currentLoggedInuser')
            window.location.href = 'login.html'; // Redirect to login page after registration      
        })
        .catch(error => {
            alert(error)
        });
    } 
}