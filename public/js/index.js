$(() => {
    const username = localStorage.getItem('username');
    console.log(username);
    const socket = io('http://localhost:3000', {
        query: {
            username: username
        }
    });


    // Using an event listener for the form submission
    $('#send-message').click((event) => {
        event.preventDefault();
        console.log('Message sent');
        const message = username + ': ' + $('#message').val();
        const content = $('#message').val();
        fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, message: content }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
        socket.emit('chat message', message);
        $('#message').val('');
    });

    // Using an event listener for receiving chat messages
    socket.on('chat message', (message) => {
        console.log('Message received:', message);
        // Extract username and message text from the received message
        const username = message.split(': ')[0];
        const text = message.split(': ')[1];

        // Check if the message is from the current user
        const isCurrentUser = username === localStorage.getItem('username');

        // Create a new div element for the message
        const messageElement = isCurrentUser
            ? $('<div class="message my-message"></div>')
            : $('<div class="message other-message"></div>');

        // Create the message header
        const messageHeader = $(`
            <div class="message-header">
            <span class="username">${isCurrentUser ? 'You' : username}</span>
            <span class="timestamp">${formatTimestamp(new Date(message.timestamp))}</span>
            </div>
        `);

        // Create the message body
        const messageBody = $(`
            <div class="message-body">
                <p class="text">${text}</p>
            </div>
        `);

        // Append the header and body to the message element
        messageElement.append(messageHeader);
        messageElement.append(messageBody);

        // Append the message element to the chat
        $('.main-chat').append(messageElement);

        // Scroll to the bottom of the chat
        $('.main-chat').scrollTop($('.main-chat').prop('scrollHeight'));

    });

    // Handling user connection
    socket.on('user joined', (username) => {
        const updateMsg = `<div class="update-user">${username}</div>`;
        $('.main-chat').append(updateMsg);
    });

    // Handling user disconnection
    socket.on('user left', (username) => {
        const updateMsg = `<div class="update-user">${username}</div>`;
        $('.main-chat').append(updateMsg);
    });


});

// Fetch all messages from the database
$(document).ready(() => {
    fetch('/messages')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === 'success') {
                data.messages.forEach(message => {
                    const username = message.username;
                    const text = message.message;
                    const isCurrentUser = username === localStorage.getItem('username');
                    const messageElement = isCurrentUser
                        ? $('<div class="message my-message"></div>')
                        : $('<div class="message other-message"></div>');
                    const messageHeader = $(`
                    <div class="message-header">
                    <span class="username">${isCurrentUser ? 'Me' : username}</span>
                    <span class="timestamp">${formatTimestamp(new Date(message.timestamp))}</span>
                    </div>
                `);
                    const messageBody = $(`
                    <div class="message-body">
                        <p class="text">${text}</p>
                    </div>
                `);
                    messageElement.append(messageHeader);
                    messageElement.append(messageBody);
                    $('.main-chat').append(messageElement);
                });
                $('.main-chat').scrollTop($('.main-chat').prop('scrollHeight'));

            } else {
                alert(data.message);
            }

        });

});

// Sign out
document.querySelector('.sign-out').addEventListener('click', () => {
    localStorage.removeItem('username');
    // Get the modal and overlay elements
    const modal = document.getElementById('customAlert');
    const overlay = document.getElementById('overlay');

    // Show the modal and overlay
    modal.style.display = 'block';
    overlay.style.display = 'block';

    // Set the modal message
    modal.querySelector('p').textContent = 'You have been signed out';

    // The modal and overlay are hidden and redirect to the login page
    setTimeout(() => {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        window.location.href = '/login';
    }, 1000);
});

function formatTimestamp(date) {
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

