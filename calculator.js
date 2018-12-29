function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    return operator(a, b);
}

function calculator() {
    updateDisplay(0);
    let displayValue = [];

    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => btn.addEventListener('click', function(e){
        displayValue.push(this.textContent);
        updateDisplay(displayValue);
    }));
}

function updateDisplay(content = 0) {
    if(content) content = content.join('');
    document.getElementById('display').textContent = content;
}

calculator();