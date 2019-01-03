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
    updateMainDisplay();
    let displayValue = [];
    let equation = [];

    const btns = document.querySelectorAll('.btn-number');
    const operators = document.querySelectorAll('.btn-operator');
    const clear = document.querySelector('[data-action="clear"]');
    const equals = document.querySelector('[data-action="equals"]');

    btns.forEach(btn => btn.addEventListener('click', function(e){
        displayValue.push(this.textContent);
        updateMainDisplay(displayValue);
    }));

    operators.forEach(btn => btn.addEventListener('click', function(e) {
        //allow changing of operator if an oporator is pressed again
        if (displayValue != undefined && displayValue.length != 0) {
            equation.push(parseInt(displayValue.join(''), 10));
            displayValue = [];
            if(equation.slice(-1).toString().match(/[\+\-\/\*]/g) != undefined) {
                console.log('hi');
                equation.pop();
                equation.push(this.textContent);
                console.log(this.textContent);
            } else {
                equation.push(this.textContent);
            }
            updateMainDisplay();
            updateSecondaryDisplay(equation);
            console.log(equation);
        }
    }));

    clear.addEventListener('click', function(e){
        updateMainDisplay();
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

function updateMainDisplay(content) {
    content = content || 0;
    if(content) content = content.join('');
    document.getElementById('display-main').textContent = content;
}

calculator();