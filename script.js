document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('post-event-form');
    const eventList = document.getElementById('event-list');
    const scrollElements = document.querySelectorAll('.scroll-element');
    let isEditMode = false;
    let currentEditEvent = null;

    loadEventsFromStorage();

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const eventName = document.getElementById('event-name').value;
        const category = document.getElementById('category').value;
        const eventDescription = document.getElementById('event-description').value;
        
        if (isEditMode) {
            updateEventInStorage(currentEditEvent.querySelector('h4').textContent, eventName, category, eventDescription);
            currentEditEvent.querySelector('h4').textContent = eventName;
            currentEditEvent.querySelector('p').textContent = eventDescription;
            isEditMode = false;
            currentEditEvent = null;
        } else {
            const newEvent = createEvent(eventName, category, eventDescription);
            eventList.appendChild(newEvent);
            saveEventToStorage(eventName, category, eventDescription);
        }
        
        form.reset();
    });

    function createEvent(eventName, category, eventDescription) {
        const eventContainer = document.createElement('div');
        eventContainer.classList.add('event');
        eventContainer.dataset.category = category;

        const title = document.createElement('h4');
        title.textContent = eventName;

        const description = document.createElement('p');
        description.textContent = eventDescription;

        const voteButton = document.createElement('button');
        voteButton.textContent = 'Vote';
        voteButton.classList.add('vote-btn');
        voteButton.addEventListener('click', function() {
            const voteCountElement = eventContainer.querySelector('.vote-count');
            let voteCount = parseInt(voteCountElement.textContent);

            voteCount++;
            voteCountElement.textContent = voteCount;
        });

        const voteCount = document.createElement('span');
        voteCount.textContent = '0';
        voteCount.classList.add('vote-count');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', function() {
            // Handle edit event functionality
            isEditMode = true;
            currentEditEvent = eventContainer;
            document.getElementById('event-name').value = eventName;
            document.getElementById('category').value = category;
            document.getElementById('event-description').value = eventDescription;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', function() {
            // Handle delete event functionality
            eventContainer.remove(); // Remove the event element from the DOM
            removeEventFromStorage(eventName); 
            console.log('Delete button clicked');
        });

        eventContainer.appendChild(title);
        eventContainer.appendChild(description);
        eventContainer.appendChild(voteButton);
        eventContainer.appendChild(voteCount);
        eventContainer.appendChild(editButton);
        eventContainer.appendChild(deleteButton);

        return eventContainer;
    }

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;

        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const elementOutofView = (el) => {
        const elementTop = el.getBoundingClientRect().top;

        return (    
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );  
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else if (elementOutofView(el)) {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    function saveEventToStorage(eventName, category, eventDescription) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events.push({ eventName, category, eventDescription });
        localStorage.setItem('events', JSON.stringify(events));
    }

    function loadEventsFromStorage() {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        const currentCategory = getCurrentCategory();
        events.forEach(event => {
            if (!currentCategory || event.category === currentCategory) {
                const newEvent = createEvent(event.eventName, event.category, event.eventDescription);
                eventList.appendChild(newEvent);
            }
        });
    }

    function removeEventFromStorage(eventName) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events = events.filter(event => event.eventName !== eventName);
        localStorage.setItem('events', JSON.stringify(events));
    }

    function updateEventInStorage(oldName, eventName, category, eventDescription) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        const eventIndex = events.findIndex(event => event.eventName === oldName);
        if (eventIndex > -1) {
            events[eventIndex] = { eventName, category, eventDescription };
            localStorage.setItem('events', JSON.stringify(events));
        }
    }

    function getCurrentCategory() {
        const path = window.location.pathname;
        if (path.includes('music_night.html')) {
            return 'music-night';
        } else if (path.includes('food_and_drinks.html')) {
            return 'food-drinks';
        } else if (path.includes('party.html')) {
            return 'party';
        } else if (path.includes('others.html')) {
            return 'others';
        } else {
            return null;
        }
    }
});
