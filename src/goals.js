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
