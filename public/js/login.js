// Function to send a login request to the server
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();

    // Storing the username and password from the submit button in variables
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Sending a login request to the server using the fetch method
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Storing the username in local storage for use in the chat
                localStorage.setItem('username', data.user);
                // Displaying the alert message in modal and redirecting user to the home page after closing modal
                showAlertMessage('Login successful!', function() {
                    window.location.href = '/chat';
                }, false, 1000);
            } else {
                // Displaying the error message using the alert modal
                showErrorAlert(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


// Function to send a registration request to the server
document.getElementById('registerBtn').addEventListener('click', (event) => {
    event.preventDefault();

    // Storing the username and password from the submit button in variables for use in the fetch method
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
               // Displaying the success message using the alert modal
                showAlertMessage('Registration successful! You can proceed to login.', function() {
                
                }, true);
            } else {
                // Displaying the error message using the alert modal
                showErrorAlert(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

// Function to show the success message alert
function showAlertMessage(message, callback, showCloseButton = true, delay = 0) {
    document.getElementById('customAlert').getElementsByTagName('p')[0].innerText = message;
    document.getElementById('customAlert').style.display = 'block';
    document.getElementById('customAlert').style.display = 'block';
    document.getElementById('customAlert').style.backgroundColor = '#64e97f';
    document.getElementById('overlay').style.display = 'block';

    // To show or hide the close button
    document.getElementById('closeButton').style.display = showCloseButton ? 'block' : 'none';

    // Storing the callback function to be called after the alert is closed
    window.alertCallback = callback;

    // If there's a delay, the callback is called after the delay
    if (delay > 0) {
        setTimeout(function() {
            hideCustomAlert();
        }, delay);
    }
}

// Function to show an error message alert
function showErrorAlert(message) {
    const customAlert = document.getElementById('customAlert');
    customAlert.getElementsByTagName('p')[0].innerText = message;
    customAlert.style.display = 'block';
    customAlert.style.backgroundColor = '#dc3545'; 
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('closeButton').style.display = 'block';
}

// Function to hide the custom alert
function hideCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    // Callback function is called if available
    if (window.alertCallback) {
        window.alertCallback();
        window.alertCallback = null;
    }
}