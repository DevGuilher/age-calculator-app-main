/**
 * Age Calculator App - Main JavaScript File
 * Handles form validation, age calculation, and UI updates
 */

// Prevent native form validation
document.getElementById('age-form').addEventListener('invalid', function (e) {
    e.preventDefault();
}, true);

/**
 * Checks if a year is a leap year
 * @param {number} year - The year to check
 * @returns {boolean} True if leap year, false otherwise
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Gets the maximum number of days in a month
 * @param {number} month - The month (1-12)
 * @param {number} year - The year
 * @returns {number} Maximum days in the month
 */
function getMaxDays(month, year) {
    switch (month) {
        case 2: // February
            return isLeapYear(year) ? 29 : 28;
        case 4: case 6: case 9: case 11: // Months with 30 days
            return 30;
        default: // All other months
            return 31;
    }
}

/**
 * Displays an error message for a form field
 * @param {string} inputId - ID of the input field
 * @param {string} message - Error message to display
 */
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = input.nextElementSibling;

    input.closest('.input-group').classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Resets all error states in the form
 */
function resetErrors() {
    document.querySelectorAll('.input-group').forEach(group => {
        group.classList.remove('error');
    });

    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
}

/**
 * Validates the day input based on current month and year
 */
function validateDayInput() {
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);
    const dayInput = document.getElementById('day');
    const currentDay = parseInt(dayInput.value);

    if (!isNaN(month) && !isNaN(year) && !isNaN(currentDay)) {
        const maxDays = getMaxDays(month, year);

        if (currentDay < 1) {
            showError('day', 'Must be at least 1');
        } else if (currentDay > maxDays) {
            showError('day', month === 2 && isLeapYear(year) ?
                'February has 29 days this year' :
                `Must be between 1 and ${maxDays}`);
        } else {
            resetErrors();
        }
    }
}

/**
 * Calculates age based on birth date
 * @param {Date} birthDate - The birth date to calculate from
 * @returns {Object} Object containing years, months, and days
 */
function calculateAge(birthDate) {
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

/**
 * Updates the results display with animation
 * @param {Object} age - Object containing years, months, and days
 */
function displayResults(age) {
    const results = [
        { element: document.getElementById('years-result'), value: age.years },
        { element: document.getElementById('months-result'), value: age.months },
        { element: document.getElementById('days-result'), value: age.days }
    ];

    results.forEach(item => {
        item.element.textContent = item.value;
        item.element.classList.add('updated');
        setTimeout(() => item.element.classList.remove('updated'), 500);
    });
}

/**
 * Validates the entire form and calculates age if valid
 * @param {Event} e - The submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    resetErrors();

    // Get input values
    const dayStr = document.getElementById('day').value.trim();
    const monthStr = document.getElementById('month').value.trim();
    const yearStr = document.getElementById('year').value.trim();

    let isValid = true;

    // Validate required fields
    if (!dayStr) {
        showError('day', 'This field is required');
        isValid = false;
    }

    if (!monthStr) {
        showError('month', 'This field is required');
        isValid = false;
    }

    if (!yearStr) {
        showError('year', 'This field is required');
        isValid = false;
    }

    if (!isValid) return;

    // Parse values to numbers
    const day = parseInt(dayStr);
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);
    const currentYear = new Date().getFullYear();

    // Validate year range
    if (year < 1900) {
        showError('year', 'Year must be 1900 or later');
        isValid = false;
    } else if (year > currentYear) {
        showError('year', 'Must be in the past');
        isValid = false;
    }

    // Validate month range
    if (month < 1 || month > 12) {
        showError('month', 'Must be a valid month (1-12)');
        isValid = false;
    }

    // Validate day range
    if (day < 1) {
        showError('day', 'Must be at least 1');
        isValid = false;
    } else if (day > 31) {
        showError('day', 'Must be 31 or less');
        isValid = false;
    } else if (month && year) {
        // Validate day for specific month/year
        const maxDays = getMaxDays(month, year);
        if (day > maxDays) {
            showError('day', month === 2 && isLeapYear(year) ?
                'February has 29 days this year' :
                `Must be between 1 and ${maxDays}`);
            isValid = false;
        }
    }

    if (!isValid) return;

    // Create date object and validate
    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getDate() !== day || birthDate.getMonth() !== month - 1 || birthDate.getFullYear() !== year) {
        showError('day', 'Must be a valid date');
        return;
    }

    // Calculate and display age
    const age = calculateAge(birthDate);
    displayResults(age);
}

// Event Listeners
document.getElementById('age-form').addEventListener('submit', handleFormSubmit);
document.getElementById('month').addEventListener('change', validateDayInput);
document.getElementById('year').addEventListener('change', validateDayInput);
