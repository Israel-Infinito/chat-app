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
        this.mainChat = $('.chat-messages');
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
        // Send message on button click
        $('#send-message').click((event) => {
            event.preventDefault();
            this.sendMessage();
        });

        // Send message on Enter key (without Shift)
        this.messageInput.keydown((event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.on('input', () => {
            this.autoResizeTextarea();
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

    // Auto-resize textarea based on content
    autoResizeTextarea() {
        this.messageInput[0].style.height = 'auto';
        const scrollHeight = this.messageInput[0].scrollHeight;
        const maxHeight = 100;
        this.messageInput[0].style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }

    // The sendMessage function makes a POST request to the server with the message
    sendMessage() {
        const content = this.messageInput.val().trim();
        
        if (!content) {
            return;
        }

        const message = `${this.username}: ${content}`;

        fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: content }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    this.socket.emit('chat message', message);
                    this.messageInput.val('');
                    this.messageInput[0].style.height = 'auto';
                } else {
                    this.showNotification('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                this.showNotification('Failed to send message');
            });
    }

    // The receiveMessage function receives a message and displays it in the chat window
    receiveMessage(message) {
        const username = message.split(': ')[0];
        const text = message.split(': ').slice(1).join(': ');
        const isCurrentUser = username === this.username;

        const messageElement = isCurrentUser
            ? $('<div class="message my-message"></div>')
            : $('<div class="message other-message"></div>');

        const messageHeader = $(`
            <div class="message-header">
                <span class="username">${isCurrentUser ? 'You' : username}</span>
                <span class="timestamp">${this.formatTimestamp(new Date())}</span>
            </div>
        `);

        const messageBody = $(`
            <div class="message-body">
                <p class="text">${this.escapeHtml(text)}</p>
            </div>
        `);

        messageElement.append(messageHeader);
        messageElement.append(messageBody);

        this.mainChat.append(messageElement);
        this.scrollToBottom();
    }

    // The displayUserUpdate function displays a user update in the chat window when a user joins or leaves the chat room
    displayUserUpdate(username) {
        const updateMsg = `<div class="update-user">👋 ${username}</div>`;
        this.mainChat.append(updateMsg);
        this.scrollToBottom();
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
                                <span class="username">${isCurrentUser ? 'You' : username}</span>
                                <span class="timestamp">${this.formatTimestamp(new Date(message.timestamp))}</span>
                            </div>
                        `);

                        const messageBody = $(`
                            <div class="message-body">
                                <p class="text">${this.escapeHtml(text)}</p>
                            </div>
                        `);

                        messageElement.append(messageHeader);
                        messageElement.append(messageBody);

                        this.mainChat.append(messageElement);
                    });

                    this.scrollToBottom();
                } else {
                    console.error('Failed to fetch messages:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
    }

    // The signOut function signs out the user and redirects them to the login page
    signOut() {
        localStorage.removeItem('username');
        this.showNotification('You have been signed out');
        setTimeout(() => {
            window.location.href = '/login';
        }, 800);
    }

    // Show notification in modal
    showNotification(message) {
        this.modal.style.display = 'block';
        this.overlay.style.display = 'block';
        this.modal.querySelector('p').textContent = message;

        setTimeout(() => {
            this.modal.style.display = 'none';
            this.overlay.style.display = 'none';
        }, 2500);
    }

    // The formatTimestamp function formats the timestamp
    formatTimestamp(date) {
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        if (isToday) {
            return `${hours}:${minutes}`;
        } else {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${day}/${month} ${hours}:${minutes}`;
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // The scrollToBottom function scrolls the chat window to the bottom
    scrollToBottom() {
        setTimeout(() => {
            this.mainChat.scrollTop(this.mainChat.prop('scrollHeight'));
        }, 0);
    }
}

// Instantiating the ChatApp class when the DOM is loaded
$(() => {
    new ChatApp();
});
