
let messageArr = [];
const loggedInUser = sessionStorage.getItem('currentLoggedInuser');
function populateUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    const token = sessionStorage.getItem('jwtToken'); // Assuming the token is stored in sessionStorage
    const url = config.userBaseUrl + config.userEndPoint;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Pass the JWT token for authentication
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = user;
            listItem.onclick = () => handleUserClick(user);
            userList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching user list:', error);
    });
}

// Function to fetch messages
async function fetchMessages() {
    const token = sessionStorage.getItem('jwtToken');
    const url = config.messageBaseUrl + config.messageEndPoint;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .then(async response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 403) {
            const errorData = await response.json();
            sessionStorage.removeItem('jwtToken'); 
            throw new Error(errorData.response || 'Forbidden');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.response || 'An error occurred');
        }
    })
    .then(messages => {
        messageArr = messages.response; 
        // Store the retrieved messages in the messageArr
    })
    .catch(error => {
        console.log(error)
    });
}

// Handle when a username is clicked
let currentChatUser = ''; // Store the user you're chatting with
function handleUserClick(username) {
    currentChatUser = username;  // Update the current chat user
    document.getElementById('chatUserName').textContent = username;
    console.log(`Start chat with ${username}`);
    console.log('Hii '+loggedInUser)
    fetchMessages().then(() => { const filteredMessages = messageArr.filter(msg =>
        (msg.senderUserName === loggedInUser && msg.receiverUserName === username) ||
        (msg.senderUserName === username && msg.receiverUserName === loggedInUser)
    );
    console.log(filteredMessages)
    let sortedMessagesAr = filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    populateChatMessages(sortedMessagesAr);
    }); // Clear chat box for new user
}

function populateChatMessages(sortedMessagesAr) {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = ''; // Clear chat box before populating
    sortedMessagesAr.reverse();
    // Loop through the filtered messages
    sortedMessagesAr.forEach(msgObj => {
        appendMessageToChat(msgObj.message, msgObj.senderUserName === loggedInUser ? 'sent' : 'received', msgObj.timestamp);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to append messages to the chat box
function appendMessageToChat(message, senderType, timestamp) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(senderType); // Use 'sent' or 'received' class for styling
    messageDiv.innerHTML = `<p style="margin: 2px 0px">${message}</p>`; // Add timestamp
    chatBox.appendChild(messageDiv);
}
// Event listener for the Send button
document.getElementById('send-button').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message !== '' && currentChatUser) {
        // Add the message to the chat box (align right for the sender)
        appendMessageToChat(message, 'sent', new Date().toISOString());
        sendMessageToServer(message, currentChatUser);
        messageInput.value = '';
    } else if (!currentChatUser) {
        alert('Please select a user to chat with.');
    }
});

function sendMessageToServer(message, receiver) {
    const token = sessionStorage.getItem('jwtToken');
    // Validate the message and receiver
    if (!message || !receiver) {
        alert('Please enter both a message and a receiver.');
        return;
    }
    const url = config.messageBaseUrl + config.messageEndPoint;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: message, receiverUserName: receiver })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 403) {
            return response.json().then(errorData => {
                sessionStorage.removeItem('jwtToken'); 
                throw new Error(errorData.response || 'Forbidden');
            });
        } else {
            throw new Error('An error occurred.');
        }
    })
    .then(data => {
        console.log('Message sent:', data.response);
        // Optionally, handle the server's response (e.g., display a confirmation)
    })
    .catch(error => {
        // Handle any errors (including 403 Forbidden)
        alert('Error: ' + error.message);
    });
}
// Load user list and messages on window load
window.onload = function() {
    const token = sessionStorage.getItem('jwtToken')
    if(!token){
        window.location.href = '/login.html'; 
    }else{
        populateUserList();
        fetchMessages();
    }
}
