
/**
 * Homepage buttons links and redirection
 */
function showAuthDialog() {
    // Create a dialog element
    const dialog = document.createElement('dialog');
    dialog.style.border = 'none'; // Remove default border
    dialog.style.borderRadius = '8px';
    dialog.style.padding = '20px';
    dialog.style.maxWidth = '400px';
    dialog.style.textAlign = 'center';
    dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Add shadow for depth
    dialog.style.backgroundColor = '#ffffff'; // Set background color
    dialog.style.border = '1px solid #ddd'; // Add light border
    dialog.style.position = 'relative'; // Positioning for close button

    // Add the message to the dialog
    dialog.innerHTML = `
        <h3 style="margin-bottom: 10px; font-family: Arial, sans-serif;">Login Required</h3>
        <p style="margin-bottom: 20px; font-family: Arial, sans-serif; color: #555;">
            You must be logged in to view messages. Please login or register first.
        </p>
        <button id="loginBtn" style="margin: 5px; padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Login</button>
        <button id="registerBtn" style="margin: 5px; padding: 10px 15px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Register</button>
        <button id="closeDialogBtn" style="margin: 5px; padding: 10px 15px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    `;

    // Append the dialog to the body
    document.body.appendChild(dialog);

    // Show the dialog
    dialog.showModal();

    // Add event listeners for login and register buttons
    document.getElementById('loginBtn').addEventListener('click', function() {
        window.location.href = 'login.html'; // Redirect to login page
    });

    document.getElementById('registerBtn').addEventListener('click', function() {
        window.location.href = 'register.html'; // Redirect to register page
    });

    // Add event listener to close the dialog
    document.getElementById('closeDialogBtn').addEventListener('click', function() {
        dialog.close(); // Close the dialog
        document.body.removeChild(dialog); // Remove dialog from DOM after closing
    });
}

// Event listener for the register button
document.getElementById('registerBtn').addEventListener('click', function() {
    window.location.href = 'register.html'; // Redirect to the registration page
});

// Event listener for the login button
document.getElementById('loginBtn').addEventListener('click', function() {
    window.location.href = 'login.html'; // Redirect to the login page
});

function logout() {
    if(sessionStorage.getItem('jwtToken') === null) 
        {
            alert('You have not yet logged in')
            return
        }
    // Ask the user for confirmation
    const confirmation = confirm('Are you sure you want to logout?');

    // If the user clicks "Yes" (confirmation is true), log them out
    if (confirmation) {
        const url = config.authBaseUrl+config.logoutEndPoint;
        const token = sessionStorage.getItem('jwtToken')
        const username = sessionStorage.getItem('currentLoggedInuser')
        fetch(url, {
            method: 'POST', // Send a POST request to trigger logout
            headers: {
                'Authorization': `Bearer ${token}`, // Optionally send JWT token if required
            },
            body: JSON.stringify({ username })
        })
        .then(response => {
            if (response.ok) {
                // Clear session storage
                sessionStorage.removeItem('jwtToken');
                sessionStorage.removeItem('currentLoggedInuser');
                // Redirect the user to the login page or homepage
                window.location.href = 'login.html'; // Change to your actual login page
            } else {
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('An error occurred while logging out. Please try again.');
        });
    } else {
        // If the user clicks "No", do nothing
        alert('Logout canceled.');
    }
}
// Function to set the logged-in username and update the UI


function openMessage() { 
    const token = sessionStorage.getItem('jwtToken')
    if (token) {
        // User is authenticated, proceed to messages page
        window.location.href = 'chatscreen.html';
    } else {
        console.log('isAuthenticated: '+token)
        // User is not authenticated, show login/register dialog
        showAuthDialog();
    }
}
window.addEventListener('DOMContentLoaded', function() {
    displayLoggedInUser();
});

