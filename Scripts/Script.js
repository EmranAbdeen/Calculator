var result = document.getElementById("text");

document.addEventListener("click", function (e) {
  if (result.value === "Error") {
    result.value = "0";
  }
  result.style.color = "white";

  // numbers
  if (e.target.id === "one") {
    result.value = result.value === "0" ? "1" : result.value + "1";
  } else if (e.target.id === "two") {
    result.value = result.value === "0" ? "2" : result.value + "2";
  } else if (e.target.id === "two") {
    result.value = result.value === "0" ? "2" : result.value + "2";
  } else if (e.target.id === "three") {
    result.value = result.value === "0" ? "3" : result.value + "3";
  } else if (e.target.id === "four") {
    result.value = result.value === "0" ? "4" : result.value + "4";
  } else if (e.target.id === "five") {
    result.value = result.value === "0" ? "5" : result.value + "5";
  } else if (e.target.id === "six") {
    result.value = result.value === "0" ? "6" : result.value + "6";
  } else if (e.target.id === "seven") {
    result.value = result.value === "0" ? "7" : result.value + "7";
  } else if (e.target.id === "eight") {
    result.value = result.value === "0" ? "8" : result.value + "8";
  } else if (e.target.id === "nine") {
    result.value = result.value === "0" ? "9" : result.value + "9";
  } else if (e.target.id === "zero") {
    result.value = result.value === "0" ? "0" : result.value + "0";
  }
  // operation
  if (e.target.id === "Add") {
    addOperator("+");
  } else if (e.target.id === "Sub") {
    addOperator("-");
  } else if (e.target.id === "Mod") {
    addOperator("%");
  } else if (e.target.id === "Mul") {
    addOperator("X");
  } else if (e.target.id === "Div") {
    addOperator("/");
  }
  // decimal
  if (e.target.id === "dot") {
    let parts = result.value.split(/[\+\-\*\/]/);
    let lastNumber = parts[parts.length - 1];
    //! Get the last number because أننا نريد معرفة الرقم الذي نكتب فيه الآن

    if (!lastNumber.includes(".")) {
      result.value += ".";
    }
  }
  // AC
  if (e.target.id === "AC") {
    result.value = "0";
    let operation = document.getElementById("operation");
    if (operation) operation.innerText = "";
  }
  // delete
  if (e.target.id === "backspace") {
    result.value = result.value.slice(0, -1);
  }
  //! Result
  if (e.target.id === "equals") {
    equals();
  }
});

function addOperator(op) {
  let lastChar = result.value.slice(-1);

  if (
    lastChar !== "+" &&
    lastChar !== "-" &&
    lastChar !== "*" &&
    lastChar !== "/" &&
    lastChar !== "%"
  ) {
    result.value += op;
  }
}

function equals() {
  let expression = result.value.replace(/X/g, "*");
  let operation = document.getElementById("operation");
  try {
    let OldValue = eval(expression);
    if (operation) operation.innerText = result.value + " =";
    result.value = OldValue;
  } catch {
    if (operation) operation.innerText = "";
    result.value = "Error";
    result.style.color = "red";
  }
}
