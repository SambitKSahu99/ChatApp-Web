// Function to validate the registration form
document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const errorMessageDiv = document.getElementById('errorMessage');
        errorMessageDiv.textContent = '';
    // Basic validation
    if (firstName.trim() === '' || lastName.trim() === '') {
        errorMessageDiv.textContent = 'All fields are required.';
        return;
    }
    updateUser(firstName, lastName);
})

// Function to handle registration (this could be sending data to a backend API)
function updateUser(firstName, lastName) {
        const token = sessionStorage.getItem('jwtToken');
        const url = config.userBaseUrl+config.updateUserEndPoint;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ firstName:firstName, lastName:lastName })
        })
        .then(async response => {
            if(response.ok){
                alert('Updated successfully')
                return response.json()
            }else if(response.status === 403) {
                console.log('Token is invalid or expired (403 Forbidden)');
            }
            const errData = await response.json();
            throw new Error(errData.response);
        })
        .catch(error => {
            alert(error)
        });
}

async function fillUserData(){
    const token = sessionStorage.getItem('jwtToken')
    const userName = sessionStorage.getItem('currentLoggedInuser')
    const url = config.userBaseUrl+config.getCurrentUserDetailsEndPoint+userName;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        })
        .then(async response => {
            if(response.ok){
               return response.json();
            }else if(response.status === 403) {
                console.log('Token is invalid or expired (403 Forbidden)');
            }
            const errData = await response.json();
            throw new Error(errData.response);
        })   
        .then(userData => {
            document.getElementById("firstName").value = userData.firstName;
            document.getElementById("lastName").value = userData.lastName;
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            document.getElementById("errorMessage").textContent = "Failed to load user data.";
    });
}

window.onload = function(){
    fillUserData();
}
