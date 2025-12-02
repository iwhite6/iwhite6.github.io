// Keep track of calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let memoryValue = 0; // Starts at 0

const currentOperandTextElement = document.getElementById('current-operand');
const previousOperandTextElement = document.getElementById('previous-operand');

// AC Button
function clearDisplay() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

// DEL Button
function deleteNumber() {
    if (currentOperand === '0') return;
    
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') {
        currentOperand = '0';
    }
    updateDisplay();
}

// Add a number to the screen
function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    
    // If it's 0 and we type a number, replace 0
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
    updateDisplay();
}

// Select an operation
function chooseOperation(op) {
    if (currentOperand === '') return;
    
    // If we already have a previous number, do the math first
    if (previousOperand !== '') {
        compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

// Main function to calculate the result
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            // Check for division by zero
            if (current === 0) {
                alert("Can't divide by zero!");
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    currentOperand = computation;
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

// Update the screen with the values
function updateDisplay() {
    currentOperandTextElement.innerText = currentOperand;
    
    if (operation != null) {
        // Show the operation symbol in the top display
        let displayOp = operation;
        if(operation === '/') displayOp = '÷';
        if(operation === '*') displayOp = '×';
        previousOperandTextElement.innerText = `${previousOperand} ${displayOp}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
}

// Memory Functions
function memoryAdd() {
    // Add current number to memory
    memoryValue += parseFloat(currentOperand);
    // Reset current operand to start fresh typing
    currentOperand = '0';
    updateDisplay();
}
function memorySubtract() {
    memoryValue -= parseFloat(currentOperand);
    currentOperand = '0';
    updateDisplay();
}
function memoryRecall() {
    // Bring memory value to current screen
    currentOperand = memoryValue.toString();
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    let key = event.key;
    
    // Numbers
    if (key >= 0 && key <= 9) {
        appendNumber(key);
    }
    if (key === '.') {
        appendNumber('.');
    }
    
    // Operators
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        chooseOperation(key);
    }
    
    // Enter or = for equals
    if (key === 'Enter' || key === '=') {
        event.preventDefault(); // prevent default form submission behaviors
        compute();
    }
    
    // Backspace for delete
    if (key === 'Backspace') {
        deleteNumber();
    }
    
    // Escape for Clear
    if (key === 'Escape') {
        clearDisplay();
    }
});
