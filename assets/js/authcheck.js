async function verifyTokenWithServer(token) {
    console.log('hi m running')
    const url = config.authBaseUrl + config.verifyTokenEndPoint
    try{
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (response.status === 200) {
        console.log('Token is valid');// Return true if token is valid
    } else {
        console.log('Token invalid or expired');
        sessionStorage.removeItem('jwtToken')
        sessionStorage.removeItem('currentLoggedInuser') // Return false if token is invalid or expired
    }    
    } catch(error ){
    console.error('Error verifying token:', error);  
} 
}
document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem('jwtToken')
    if(token){
        verifyTokenWithServer(token)
    }
});