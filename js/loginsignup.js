// Get the overlay and the terms link
var overlay = document.getElementById('terms-overlay');
var termsLink = document.getElementById('terms-link');
var closeBtn = document.getElementById('close-overlay');

// Open the overlay when the terms link is clicked
termsLink.addEventListener('click', function(event) {
    event.preventDefault();  // Prevents the default link behavior
    overlay.style.display = 'block';  // Show the overlay
});

// Close the overlay when the close button is clicked
closeBtn.addEventListener('click', function() {
    overlay.style.display = 'none';  // Hide the overlay
});

// Close the overlay if the user clicks anywhere outside the content
window.addEventListener('click', function(event) {
    if (event.target === overlay) {
        overlay.style.display = 'none';
    }
});

function toggleSignUpButton() {
    // Get the checkbox and button elements
    var checkbox = document.getElementById("terms-checkbox");
    var submitButton = document.getElementById("submit-btn");

    // If the checkbox is checked, enable the button, else disable it
    submitButton.disabled = !checkbox.checked;
}
