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