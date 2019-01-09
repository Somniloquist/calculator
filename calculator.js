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

function round(n, decimals) {
    decimals = decimals || 1;
    return Number(Math.round(n + 'e' + decimals) + 'e-' + decimals);
}

function roundEquation(equation, decimals) {
    return equation.map(n => isNaN(n) ? n : round(n, decimals))
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
    if(content) content = roundEquation(content, 4).join(' ').replace(/(add)/g, '+')
                                           .replace(/(subtract)/g, '-')
                                           .replace(/(multiply)/g, 'x')
                                           .replace(/(divide)/g, '/');
    document.getElementById('display-secondary').textContent = content;
}

function updateMainDisplay(content) {
    content = content || 0;
    if(content) content = roundEquation(content, 4).join('');
    document.getElementById('display-main').textContent = content;
}

function calculator() {
    let displayValue = [];
    let equation = [];
    let ans = [];
    clearDisplay();

    const btns = document.querySelectorAll('.btn-number');
    const decimal = document.querySelector('[data-action="decimal"]')
    const operators = document.querySelectorAll('.btn-operator');
    const clear = document.querySelector('[data-action="clear"]');
    const answer = document.querySelector('[data-action="equals"]');
    
    btns.forEach(btn => btn.addEventListener('click', function(e){
        if(displayValue.length > 0 || btn.textContent != '0') {
            if (ans.length > 0) ans = [];
            displayValue.push(this.textContent);
            updateMainDisplay(displayValue);
        }
    }));

    decimal.addEventListener('click', function(e) {
        if(!displayValue.includes('.')) {
            if (displayValue.length === 0) displayValue.push('0');
            displayValue.push(this.textContent);
            updateMainDisplay(displayValue);
        }
    });

    operators.forEach(btn => btn.addEventListener('click', function(e) {
        if (ans.length > 0) {
            displayValue = ans.slice();
            ans = [];
        }
        //change operator if an oporator is pressed again
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
        if(equation.length === 0 || previousInputIsOperator(equation)) {
            return;
        }

        let fullEquation = equation.slice();
        fullEquation.push('=')

        solve(equation);
        ans = equation.slice();
        clearDisplay();
        displayValue = [];
        equation = [];
        updateMainDisplay(ans);
        updateSecondaryDisplay(fullEquation);
    });
}

calculator();