class UserAuth {
    constructor() {
        // Create references to the login form and register button
        this.loginForm = document.getElementById('loginForm');
        this.registerBtn = document.getElementById('registerBtn');
        this.customAlert = document.getElementById('customAlert');
        this.overlay = document.getElementById('overlay');
        this.closeButton = document.getElementById('closeButton');
        this.alertCallback = null;
        // The event listeners for the login form and register button
        this.loginForm.addEventListener('submit', this.login.bind(this));
        this.registerBtn.addEventListener('click', this.register.bind(this));
    }

    // The login function makes a POST request to the server with the username and password
    login(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // The fetch API is used to make a POST request to the server
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
                    localStorage.setItem('username', data.user);
                    this.showAlertMessage('Login successful!', () => {
                        window.location.href = '/chat';
                    }, false, 1000);
                } else {
                    this.showErrorAlert(data.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // The register function makes a POST request to the server with the username and password
    register(event) {
        event.preventDefault();

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
                    this.showAlertMessage('Registration successful! You can proceed to login.', () => {}, true);
                } else {
                    if (data.message === 'Username already exists') {
                        this.showErrorAlert('The username you entered is already taken. Please choose a different username.');
                    } else {
                        this.showErrorAlert(data.message);
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // The showAlertMessage function displays a custom alert message
    showAlertMessage(message, callback, showCloseButton = true, delay = 0) {
        this.customAlert.getElementsByTagName('p')[0].innerText = message;
        this.customAlert.style.display = 'block';
        this.customAlert.style.backgroundColor = '#64e97f';
        this.overlay.style.display = 'block';
        this.closeButton.style.display = showCloseButton ? 'block' : 'none';
        this.alertCallback = callback;

        if (delay > 0) {
            setTimeout(() => {
                this.hideCustomAlert();
            }, delay);
        }
    }

    // The showErrorAlert function displays a custom error alert message
    showErrorAlert(message) {
        this.customAlert.getElementsByTagName('p')[0].innerText = message;
        this.customAlert.style.display = 'block';
        this.customAlert.style.backgroundColor = '#dc3545';
        this.overlay.style.display = 'block';
        this.closeButton.style.display = 'block';
    }

    // The hideCustomAlert function hides the custom alert message
    hideCustomAlert() {
        this.customAlert.style.display = 'none';
        this.overlay.style.display = 'none';

        if (this.alertCallback) {
            this.alertCallback();
            this.alertCallback = null;
        }
    }
}

new UserAuth();