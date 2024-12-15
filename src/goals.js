const userButton = document.getElementById('userButton');
const dropdown = document.getElementById('userDropdown');

userButton.addEventListener('click', function(event) {
    event.stopPropagation();
    dropdown.classList.toggle('show');
});

document.addEventListener('click', function(event) {
if (!event.target.closest('.user-container')) {
    dropdown.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve weeklyTasks from localStorage
    const weeklyTasksData = JSON.parse(localStorage.getItem('weeklyTasks'));

    // Check if the data exists and is an array, then display it
    if (weeklyTasksData && Array.isArray(weeklyTasksData)) {
        displayWeeklyTasks(weeklyTasksData);
    } else {
        console.error('No weekly tasks found!');
    }
});

// Function to display weekly tasks on the page
function displayWeeklyTasks(tasks) {
    const tasksContainer = document.getElementById('weekly-tasks-container');
    
    if (tasksContainer) {
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.innerHTML = `<strong>${task.day}</strong>: ${task.task}<br><em>${task.subtitle}</em>`;
            tasksContainer.appendChild(taskElement);
        });
    }
}

let scrollPosition = 0; // Track scroll position to prevent body from moving

function openOverlay(contentId) {
    scrollPosition = window.scrollY; // Save the current scroll position

    // Disable body scroll and set the body's top position to prevent scrolling
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;

    // Show the overlay
    document.getElementById(contentId).style.display = "block";
}

function closeOverlay(contentId) {
    document.getElementById(contentId).style.display = "none";

    // Restore body scrolling behavior
    document.body.style.position = "";
    document.body.style.top = "";

    // Restore scroll position
    window.scrollTo(0, scrollPosition); 
}

// Close overlay when clicking on the overlay background
document.addEventListener('click', function(event) {
    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      if (event.target === overlay) {
        closeOverlay(overlay.id);
      }
    });
});

// Function to load the overlay HTML content
function loadPrivacyOverlay() {
  fetch('privacy-overlay.html')
    .then(response => response.text())
    .then(data => {
      // Insert the loaded overlay content into the body
      const body = document.body;
      const overlayContainer = document.createElement('div');
      overlayContainer.id = 'privacy-overlay';  // Set an ID for easy targeting
      overlayContainer.classList.add('overlay'); // Ensure it has the correct overlay class
      overlayContainer.innerHTML = data;
      body.appendChild(overlayContainer);
    })
    .catch(error => {
      console.error('Error loading overlay:', error);
    });
}


// Function to load the overlay HTML content
function loadPrivacyOverlay() {
    fetch('privacy-overlay.html')
      .then(response => response.text())
      .then(data => {
        // Insert the loaded overlay content into the body
        const body = document.body;
        const overlayContainer = document.createElement('div');
        overlayContainer.innerHTML = data;
        body.appendChild(overlayContainer);
      })
      .catch(error => {
        console.error('Error loading overlay:', error);
      });
  }
  
  function loadContactOverlay() {
      fetch('contact-overlay.html')
        .then(response => response.text())
        .then(data => {
          // Insert the loaded overlay content into the body
          const body = document.body;
          const overlayContainer = document.createElement('div');
          overlayContainer.innerHTML = data;
          body.appendChild(overlayContainer);
        })
        .catch(error => {
          console.error('Error loading overlay:', error);
        });
    }
  
  // Combine both functions in a single window.onload handler
  window.onload = function() {
    loadPrivacyOverlay();  // Load privacy overlay
    loadContactOverlay();  // Load contact overlay
  };