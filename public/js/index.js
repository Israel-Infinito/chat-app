class ChatApp {
    constructor() {
        // Constructs a new instance of the ChatApp class
        this.username = localStorage.getItem('username');
        this.socket = io('http://localhost:3000', {
            query: {
                username: this.username
            }
        });
        this.messageInput = $('#message');
        this.mainChat = $('.main-chat');
        this.signOutButton = document.querySelector('.sign-out');
        this.modal = document.getElementById('customAlert');
        this.overlay = document.getElementById('overlay');

        this.init();
    }

    init() {
        // Initializes the ChatApp instance by setting up event listeners and fetching messages
        this.setupEventListeners();
        this.fetchMessages();
    }

    // The Event Listeners for the ChatApp instance
    setupEventListeners() {
        $('#send-message').click((event) => {
            event.preventDefault();
            this.sendMessage();
        });

        this.socket.on('chat message', (message) => {
            this.receiveMessage(message);
        });

        this.socket.on('user joined', (username) => {
            this.displayUserUpdate(username);
        });

        this.socket.on('user left', (username) => {
            this.displayUserUpdate(username);
        });

        this.signOutButton.addEventListener('click', () => {
            this.signOut();
        });
    }

    // The sendMessage function makes a POST request to the server with the username and message
    sendMessage() {
        const content = this.messageInput.val();
        const message = `${this.username}: ${content}`;

        fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.username, message: content }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    this.socket.emit('chat message', message);
                    this.messageInput.val('');
                } else {
                    alert(data.message);
                }
            });
    }

    // The receiveMessage function receives a message and displays it in the chat window
    receiveMessage(message) {
        const username = message.split(': ')[0];
        const text = message.split(': ')[1];
        const isCurrentUser = username === this.username;

        const messageElement = isCurrentUser
            ? $('<div class="message my-message"></div>')
            : $('<div class="message other-message"></div>');

        const messageHeader = $(`
            <div class="message-header">
                <span class="username">${isCurrentUser ? 'Me' : username}</span>
                <span class="timestamp">${this.formatTimestamp(new Date)}</span>
            </div>
        `);

        const messageBody = $(`
            <div class="message-body">
                <p class="text">${text}</p>
            </div>
        `);

        messageElement.append(messageHeader);
        messageElement.append(messageBody);

        this.mainChat.append(messageElement);
        this.scrollToBottom();
    }

    // The displayUserUpdate function displays a user update in the chat window when a user joins or leaves the chat room
    displayUserUpdate(username) {
        const updateMsg = `<div class="update-user">${username}</div>`;
        this.mainChat.append(updateMsg);
    }

    // The fetchMessages function makes a GET request to the server to fetch all the messages 
    fetchMessages() {
        fetch('/messages')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    data.messages.forEach(message => {
                        const username = message.username;
                        const text = message.message;
                        const isCurrentUser = username === this.username;

                        const messageElement = isCurrentUser
                            ? $('<div class="message my-message"></div>')
                            : $('<div class="message other-message"></div>');

                        const messageHeader = $(`
                            <div class="message-header">
                                <span class="username">${isCurrentUser ? 'Me' : username}</span>
                                <span class="timestamp">${this.formatTimestamp(new Date(message.timestamp))}</span>
                            </div>
                        `);

                        const messageBody = $(`
                            <div class="message-body">
                                <p class="text">${text}</p>
                            </div>
                        `);

                        messageElement.append(messageHeader);
                        messageElement.append(messageBody);

                        this.mainChat.append(messageElement);
                    });

                    this.scrollToBottom();
                } else {
                    alert(data.message);
                }
            });
    }

    // The signOut function signs out the user and redirects them to the login page
    signOut() {
        localStorage.removeItem('username');

        this.modal.style.display = 'block';
        this.overlay.style.display = 'block';
        this.modal.querySelector('p').textContent = 'You have been signed out';

        setTimeout(() => {
            this.modal.style.display = 'none';
            this.overlay.style.display = 'none';
            window.location.href = '/login';
        }, 1000);
    }

    // The formatTimestamp function formats the timestamp to the format DD.MM.YYYY HH:MM:SSAM/PM
    formatTimestamp(date) {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();

        const hours = date.getHours();
        const minutes = ("0" + date.getMinutes()).slice(-2);
        const seconds = ("0" + date.getSeconds()).slice(-2);

        const hourIn12HourFormat = hours % 12 || 12;
        const amPm = hours < 12 || hours === 24 ? "AM" : "PM";

        return `${day}.${month}.${year} ${hourIn12HourFormat}.${minutes}.${seconds}${amPm}`;
    }

    // The scrollToBottom function scrolls the chat window to the bottom
    scrollToBottom() {
        this.mainChat.scrollTop(this.mainChat.prop('scrollHeight'));
    }
}

// Instantiating the ChatApp class when the DOM is loaded
$(() => {
    new ChatApp();
});
