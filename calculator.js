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
    updateMainDisplay(0);
    let displayValue = [];
    let equation = [];

    const btns = document.querySelectorAll('.btn-number');
    const operators = document.querySelectorAll('.btn-operator');
    const clear = document.getElementById('btn-clear');
    const equals = document.getElementById('btn-equals');

    btns.forEach(btn => btn.addEventListener('click', function(e){
        displayValue.push(this.textContent);
        updateMainDisplay(displayValue);
    }));

    operators.forEach(btn => btn.addEventListener('click', function(e) {
        equation.push(displayValue.join(''));
        displayValue = [];
        if(equation.slice(-1).toString().match(/[\+\-\/\*]/g)) {
            equation.pop();
            equation.push(this.textContent);
        } else {
            equation.push(this.textContent);
        }
        updateMainDisplay();
        updateSecondaryDisplay(equation);
    }));

    clear.addEventListener('click', function(e){
        updateMainDisplay(0);
        updateSecondaryDisplay();
        displayValue = [];
        equation = [];
    });

    // equals.addEventListener('click', function(e) {
    //     equation.push(displayValue.join(''));
    //     displayValue = [];
    //     updateSecondaryDisplay();
    // });


}

function updateSecondaryDisplay(content = []) {
    if(content) content = content.join('');
    document.getElementById('display-secondary').textContent = content;
}

function updateMainDisplay(content = 0) {
    if(content) content = content.join('');
    document.getElementById('display-main').textContent = content;
}

calculator();