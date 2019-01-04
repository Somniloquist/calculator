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

function solve(equation) {
    const operators = ['multiply', 'divide', 'add', 'subtract'];

    operators.forEach(operator => {
        while(equation.indexOf(operator) > -1) {
            const index = equation.indexOf(operator);
            const a = equation[index - 1];
            const b = equation[index + 1];
            equation.splice(index - 1, 3, operate(window[operator], a, b));
        }
    });
}

function previousInputIsOperator(equation) {
    return equation.slice(-1).toString().match(/(add|subtract|multiply|divide)/g) ? true : false;
}

function removeTrailingZeros(n) {
    return parseFloat(n.join(''));
}

function clearDisplay() {
        updateMainDisplay();
        updateSecondaryDisplay();
}

function updateSecondaryDisplay(content) {
    content = content || [];
    if(content) content = content.join('    ');
    document.getElementById('display-secondary').textContent = content;
}

function updateMainDisplay(content) {
    content = content || 0;
    if(content) content = content.join('');
    document.getElementById('display-main').textContent = content;
}

function calculator() {
    let displayValue = [];
    let equation = [];
    clearDisplay();

    const btns = document.querySelectorAll('.btn-number');
    const operators = document.querySelectorAll('.btn-operator');
    const clear = document.querySelector('[data-action="clear"]');
    const answer = document.querySelector('[data-action="equals"]');

    btns.forEach(btn => btn.addEventListener('click', function(e){
        displayValue.push(this.textContent);
        updateMainDisplay(displayValue);
    }));

    operators.forEach(btn => btn.addEventListener('click', function(e) {
        //allow changing of operator if an oporator is pressed again
        if(displayValue.length === 0 && previousInputIsOperator(equation)) {
            equation.pop();
            equation.push(this.getAttribute('data-action'));
            updateSecondaryDisplay(equation);
        } else if(displayValue.length != 0){
            equation.push(removeTrailingZeros(displayValue));
            displayValue = [];
            equation.push(this.getAttribute('data-action'));
            clearDisplay();
            updateSecondaryDisplay(equation);
        }
    }));

    clear.addEventListener('click', function(e){
        clearDisplay();
        displayValue = [];
        equation = [];
    });

    answer.addEventListener('click', function(e) {
        if(displayValue.length > 0) {
            equation.push(removeTrailingZeros(displayValue));
        }

        solve(equation);

        displayValue = equation.slice();
        clearDisplay();
        equation = [];
        updateMainDisplay(displayValue);
    });
}

calculator();