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

function testup(e) {
    e = e || dcoument.event;
    e.target.value = e.target.value.replace(/[^\d\+\-\*\=\/\.]/g, '');

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

    displayMain.focus();
    displayMain.onkeydown = function(e) {
        if(displayValue.length === 0 && e.key === '.') displayValue.push('0');
        if(displayValue.includes('.') && e.key === '.') return;
        if(e.key.match(/^[\d\+\-\=\*\/\.]/)) {
            displayValue.push(e.key);
            updateDisplay(displayValue, this);
        }
    }
    
    btns.forEach(btn => btn.addEventListener('click', function(e){
            if (ans.length > 0) ans = [];
            displayValue.push(this.textContent);
            updateDisplay(displayValue, displayMain);
    }));

    decimal.addEventListener('click', function(e) {
        if(!displayValue.includes('.')) {
            if (displayValue.length === 0) displayValue.push('0');
            displayValue.push(this.textContent);
            updateDisplay(displayValue, displayMain);
        }
    });

    operators.forEach(btn => btn.addEventListener('click', function(e) {
        if (ans.length > 0) {
            displayValue = ans.slice();
            ans = [];
        }
        if(displayValue.length === 0 && previousInputIsOperator(equation)) {
            equation.pop();
            equation.push(this.getAttribute('data-action'));
            updateDisplay(equation, displaySecondary);
        } else if(displayValue.length != 0){
            equation.push(removeTrailingZeros(displayValue));
            displayValue = [];
            equation.push(this.getAttribute('data-action'));
            clearDisplay(displayMain, displaySecondary);
            updateDisplay(equation, displaySecondary);
            console.log(displayValue);
            console.log(equation);
        }
    }));

    clear.addEventListener('click', function(e){
        clearDisplay(displayMain, displaySecondary);
        displayValue = [];
        equation = [];
    });

    del.addEventListener('click', function(e){
        ans.pop() || displayValue.pop();
        updateDisplay(displayValue, displayMain);
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
    });
}

calculator();