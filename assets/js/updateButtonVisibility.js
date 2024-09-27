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
        // Remove the JWT token from sessionStorage
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('currentLoggedInuser')
        // Redirect the user to the login page or homepage
        window.location.href = 'login.html'; // Change to your actual login page
    } else {
        // If the user clicks "No", do nothing
        alert('Logout canceled.');
    }
}

function updateButtonVisibility() {
    // Check if jwtToken is present in sessionStorage
    const token = sessionStorage.getItem('jwtToken')
    if (token) {
        // Show the user menu if token is present
        document.getElementById("userMenu").style.display = "block";
    }

    // Get the hamburger button and dropdown content
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const dropdownContent = document.getElementById("dropdownContent");
    const user = sessionStorage.getItem('currentLoggedInuser')
    document.getElementById('loggedInUsername').textContent = user;

    // Toggle the dropdown on click
    hamburgerMenu.addEventListener("click", function() {
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none"; // Hide menu if already shown
        } else {
            dropdownContent.style.display = "block"; // Show menu if hidden
        }
    });

    // Close the dropdown if clicked outside of it
    window.addEventListener("click", function(event) {
        if (!event.target.matches('.dropdown-button')) {
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            }
        }
    });
}

/**
 * Delete user account function
 */
function deleteAccount() {
    const token = sessionStorage.getItem('jwtToken');
    const url = config.userBaseUrl+config.userEndPoint
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send the token for authentication
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Account deleted successfully. Logging out...');
            sessionStorage.removeItem('jwtToken');// Remove token from sessionStorage
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert('Failed to delete account. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error deleting account:', error);
        alert('An error occurred. Please try again.');
    });
}
function deleteUser() {
    const confirmation = confirm('Are you sure you want to delete your account? You will be logged out.'); 
    if (confirmation) {
        // User clicked "OK", proceed with account deletion
        deleteAccount();
    } else {
        // User clicked "Cancel", do nothing
        console.log('Account deletion canceled.');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem('jwtToken')
    if(token){
        console.log('I am updating the visibility')
        updateButtonVisibility();
    }
});