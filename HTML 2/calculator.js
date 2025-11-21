const display = document.getElementById("result");

function appendToDisplay(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    const result = eval(display.value);
      display.value = result;
  }
    catch(error) {
      display.value = "Error";
    }
}

function deleteLast () {
  display.value = display.value.slice(0, -1);
}

function square() {
  try {
    let current = parseFloat(display.value)
    if (!isNaN(current)) {
      display.value = Math.pow(current, 2);
    }
  }
  catch (e) {
    display.value = 'Error'
  }  
}

let isDegree = true;  // true = DEG, false = RAD

function toggleDeg() {
    isDegree = !isDegree;
    document.getElementById('degBtn').innerText = isDegree ? 'DEG' : 'RAD';
}

function trig(func) {
    let value = parseFloat(display.value) || 0;  // ← Use 'display' instead of getElementById
    let angle = isDegree ? value * Math.PI / 180 : value;
    let result;

    switch (func) {
        case 'sin': result = Math.sin(angle); break;
        case 'cos': result = Math.cos(angle); break;
        case 'tan': result = Math.tan(angle); break;
        case 'cot': result = 1 / Math.tan(angle); break;
    }

    display.value = result;  // ← Also use 'display' here
}

// This runs every time user types anything
document.getElementById("result").addEventListener("input", function() {
  if (this.value === "") {
    this.classList.remove("typing");     // empty → normal color
  } else {
    this.classList.add("typing");        // has numbers → colored
  }
});