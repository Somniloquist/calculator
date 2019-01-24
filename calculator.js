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

function isNum(n) {
    return !isNaN(n);
}

function isExponent(n) {
    return n.toString().split('').includes('e');
}

function round(n, decimals) {
    decimals = decimals || 1;
    return Number(Math.round(n + 'e' + decimals) + 'e-' + decimals);
}

function roundEquation(equation, decimals) {
    const result = equation.map(n => {
        if(isNum(n) && isExponent(n)) {
            return n;
        } else {
            return isNaN(n) ? n : round(n, decimals)
        }
    });
    return result;
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

function clearDisplay(...displays) {
    displays.forEach(display => updateDisplay('', display));
}

function updateDisplay(content, display) {
    let joinOn = '';
    if (display.id === 'display-secondary') joinOn = ' ';
    if(isNaN(content[0])) {
        display.textContent = content;
        return;
    }
    if(content) {
        content = roundEquation(content, 4).join(joinOn).replace(/(add)/g, '+')
                                                    .replace(/(subtract)/g, '-')
                                                    .replace(/(multiply)/g, 'x')
                                                    .replace(/(divide)/g, '/');
        display.textContent = content;
    } else {
        display.textContent = '';
    }
}

function getDataAction(key) {
    return key.replace(/^[+]/, 'add')
                .replace(/^[-]/, 'subtract')
                .replace(/^[*]/, 'multiply')
                .replace(/^[/]/, 'divide');
}

function calculator() {
    const btns = document.querySelectorAll('.btn-number');
    const decimal = document.querySelector('[data-action="decimal"]')
    const operators = document.querySelectorAll('.btn-operator');
    const clear = document.querySelector('[data-action="clear"]');
    const del = document.querySelector('[data-action="delete"]');
    const answer = document.querySelector('[data-action="equals"]');
    const displayMain = document.getElementById('display-main');
    const displaySecondary = document.getElementById('display-secondary');

    let displayValue = [];
    let equation = [];
    let ans = [];

    function displayDigit(e, btn) {
        if (ans.length > 0) ans = [];
        if (e.type === 'click') {
            displayValue.push(btn.textContent);
        } else if (e.type === 'keydown') {
            displayValue.push(e.key);
        }
        updateDisplay(displayValue, displayMain);
    }

    function displayDecimal(e, btn) {
        if(!displayValue.includes('.')) {
            if (displayValue.length === 0) displayValue.push('0');
            if (e.type === 'click') {
                displayValue.push(btn.textContent);
            } else if (e.type === 'keydown') {
                displayValue.push(e.key);
            }
            updateDisplay(displayValue, displayMain);
        }
    }

    function displayOperator(e, btn) {
        if (ans.length > 0) {
            displayValue = ans.slice();
            ans = [];
        }
        if(displayValue.length === 0 && previousInputIsOperator(equation)) {
            equation.pop();
            if (e.type === 'click') {
                equation.push(btn.getAttribute('data-action'));
            }
            else if(e.type === 'keydown') {
                equation.push(getDataAction(e.key));
            }
        } else if(displayValue.length != 0){
            equation.push(removeTrailingZeros(displayValue));
            displayValue = [];
            if (e.type === 'click') {
                equation.push(btn.getAttribute('data-action'));
            }
            else if(e.type === 'keydown') {
                equation.push(getDataAction(e.key));
            }
            clearDisplay(displayMain, displaySecondary);
        }
            updateDisplay(equation, displaySecondary);
    }

    function displayAnswer() {
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
        displayValue = [];
        equation = [];
        if(ans[0] === Infinity) {
            updateDisplay('Don\'t divide by zero kids.', displayMain);
            clearDisplay(displaySecondary)
            ans = [];
        } else if(isNaN(ans[0])) {
            updateDisplay(ans[0], displayMain);
            clearDisplay(displaySecondary)
            ans = [];
        } else {
            updateDisplay(ans, displayMain);
            updateDisplay(fullEquation, displaySecondary);
        }
    }

    displayMain.focus();
    displayMain.onkeydown = function(e) {
        if(e.key.match(/^[\d]/)) {
            displayDigit(e);
        } else if(e.key.match(/^[\.]/)) {
            displayDecimal(e);
        } else if(e.key.match(/^[\+\-\*\/]/)){
            displayOperator(e);
        } else if(e.key.match(/^[\=]/) || e.key.match('Enter')) {
            displayAnswer();
        } else if(e.key === 'Backspace') {
            ans.pop() || displayValue.pop();
            updateDisplay(displayValue, this);
        } else {
            return;
        }
    }

    btns.forEach(btn => btn.addEventListener('click', function(e){
        displayMain.focus();
        displayDigit(e, btn);
    }));

    decimal.addEventListener('click', function(e) {
        displayMain.focus();
        displayDecimal(e, decimal);
    });

    operators.forEach(btn => btn.addEventListener('click', function(e) {
        displayMain.focus();
        displayOperator(e, btn);
    }));

    clear.addEventListener('click', function(e){
        displayMain.focus();
        clearDisplay(displayMain, displaySecondary);
        displayValue = [];
        equation = [];
    });

    del.addEventListener('click', function(e){
        displayMain.focus();
        ans.pop() || displayValue.pop();
        updateDisplay(displayValue, displayMain);
    });

    answer.addEventListener('click', function(e) {
        displayMain.focus();
        displayAnswer(e, answer);
    });
}

calculator();