document.addEventListener('DOMContentLoaded', () => {

    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messages = document.getElementById('messages');
    const apiKeyInput = document.getElementById('api-key-input');
    const fileInput = document.getElementById('file-input');
    const kInput = document.getElementById('k-input');
    const chainTypeInput = document.getElementById('chain-type-input');
    const toggleChatButton = document.getElementById('toggle-chat');
    const mainPage = document.getElementById('main-page');
    
    toggleChatButton.addEventListener('click', () => {
        mainPage.classList.add('hidden');
    });
    
    mainPage.addEventListener('transitionend', () => {
        if (mainPage.classList.contains('hidden')) {
            mainPage.style.display = 'none';
        } else {
            mainPage.style.display = 'flex';
        }
    });

    // Funcionalidad para mostrar/ocultar la ventana lateral
    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('d-none');
    });

    // Funcionalidad del chat
    messageForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const messageText = messageInput.value.trim();

        if (messageText.length === 0) {
            return;
        }

        // Agrega el mensaje del usuario al chat
        const userMessage = document.createElement('div');
        userMessage.textContent = messageText;
        userMessage.classList.add('user-message');
        messages.appendChild(userMessage);

        // Limpia el input
        messageInput.value = '';

        // Agrega el efecto de "escribiendo"
        const typingMessage = document.createElement('div');
        typingMessage.textContent = 'Escribiendo... ';
        typingMessage.classList.add('response-message');
        const typingIndicator = document.createElement('span');
        typingIndicator.classList.add('typing-indicator');
        typingMessage.appendChild(typingIndicator); // Agrega el indicador de escritura al mensaje
        messages.appendChild(typingMessage);


        // Realiza la petición al servidor y muestra la respuesta
        const formData = new FormData();
        formData.append('api_key', apiKeyInput.value);
        formData.append('file', fileInput.files[0]);
        formData.append('query', messageText);
        formData.append('k', "2");
        formData.append('chain_type', "stuff");

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const answer = data.answer;
            const source = data.source; // Agrega esta línea para recibir el "source" del servidor

            // Elimina el efecto de "escribiendo"
            messages.removeChild(typingMessage);

            const responseMessage = document.createElement('div');
            responseMessage.textContent = answer;
            responseMessage.classList.add('response-message');
            responseMessage.setAttribute('title', source); // Agrega esta línea para agregar el atributo "title" con el valor de "source"
            messages.appendChild(responseMessage);

        } catch (error) {
            // Elimina el efecto de "escribiendo"
            messages.removeChild(typingMessage);

            console.error('Error en la petición:', error);

            // Muestra un mensaje de error en el chat
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Ocurrió un error. Por favor, intenta de nuevo.';
            errorMessage.classList.add('response-message');
            messages.appendChild(errorMessage);
        }

        // Desplaza el chat hacia abajo para mostrar los últimos mensajes
        messages.scrollTop = messages.scrollHeight;
        
    });
    // Agrega estas líneas al final del evento 'DOMContentLoaded'
    function changeThemeOfElementsWithClass(className, oldBgClass, newBgClass, oldTextClass, newTextClass) {
        const elements = document.getElementsByClassName(className);

        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove(oldBgClass, oldTextClass);
            elements[i].classList.add(newBgClass, newTextClass);
        }
    }

    const toggleThemeButton = document.getElementById('toggle-theme');
    const htmlElement = document.documentElement;
    const chatContainer = document.getElementById('chat-container');
    const bodyElement = document.body;
    const containerElement = document.getElementsByClassName('container')[0];
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');       
    toggleThemeButton.addEventListener('click', () => {
        if (htmlElement.classList.contains('light-theme')) {
            htmlElement.classList.remove('light-theme');
            htmlElement.classList.add('dark-theme');
            changeThemeOfElementsWithClass('mb-3', 'bg-white', 'bg-dark', 'text-dark', 'text-white');
            changeThemeOfElementsWithClass('chat-container', 'bg-light', 'bg-dark', 'text-dark', 'text-light');
            changeThemeOfElementsWithClass('d-flex flex-column h-100', 'bg-light', 'bg-dark', 'text-dark', 'text-light');
            changeThemeOfElementsWithClass('row', 'bg-light', 'bg-dark', 'text-dark', 'text-light');
            chatContainer.classList.add('degrade-background'); // Agrega esta línea
            bodyElement.classList.remove('bg-light');
            bodyElement.classList.add('bg-dark');
            sunIcon.classList.add('d-none');
            moonIcon.classList.remove('d-none');
        } else {
            htmlElement.classList.remove('dark-theme');
            htmlElement.classList.add('light-theme');
            changeThemeOfElementsWithClass('mb-3', 'bg-dark', 'bg-white', 'text-white', 'text-dark');
            changeThemeOfElementsWithClass('chat-container', 'bg-dark', 'bg-light', 'text-light', 'text-dark');
            changeThemeOfElementsWithClass('d-flex flex-column h-100', 'bg-dark', 'bg-light', 'text-light', 'text-dark');
            changeThemeOfElementsWithClass('row', 'bg-dark', 'bg-light', 'text-light', 'text-dark');
            chatContainer.classList.remove('degrade-background'); // Agrega esta línea
            moonIcon.classList.add('d-none');
            sunIcon.classList.remove('d-none');
            bodyElement.classList.remove('bg-dark');
            bodyElement.classList.add('bg-light');
        }
    });
    

    
    // Establecer el tema predeterminado como claro y el chat-container

            htmlElement.classList.remove('light-theme');
            htmlElement.classList.add('dark-theme');
            changeThemeOfElementsWithClass('mb-3', 'bg-white', 'bg-dark', 'text-dark', 'text-white');
            changeThemeOfElementsWithClass('chat-container', 'bg-light', 'bg-dark', 'text-dark', 'text-light');
            changeThemeOfElementsWithClass('d-flex flex-column h-100', 'bg-light', 'bg-dark', 'text-dark', 'text-light');
            changeThemeOfElementsWithClass('row', 'bg-light', 'bg-dark', 'text-dark', 'text-light');            
            // Cambiar el fondo de la página
            bodyElement.classList.remove('bg-light');
            bodyElement.classList.add('bg-dark');
            sunIcon.classList.add('d-none');
            moonIcon.classList.remove('d-none');


});
