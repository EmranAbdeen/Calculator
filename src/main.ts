import "./style/style.css";
import "./style/light.css";
import "./style/dark.css";

const appElement = document.getElementById("app")!;
appElement.innerHTML = `
<div class="cal">
      <!-- Header with single elegant sun/moon toggle button -->
      <div class="theme-header">
        <div class="brand-title">Calculator</div>
        <div class="header-controls">
          <select id="calc-mode-select">
            <option value="normal">Standard Calculator</option>
            <option value="developer">Developer Calculator</option>
          </select>
          <button
            class="theme-toggle-btn"
            id="theme-toggle-btn"
            title="Toggle Theme"
          >
            <span class="sun-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path
                  d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54   210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508  512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114   114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170   70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47  113      47t113-47ZM480-480Z"
                />
              </svg>
            </span>
            <span class="moon-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5  3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0   150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20   3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <!-- Double-row glass screen -->
      <div class="text">
        <div class="history-expr" id="history-display"></div>
        <input type="text" id="text" value="0" readonly />
      </div>

      <!-- Programmer Base Conversion Display Panel-->
      <div class="programmer-panel" id="programmer-panel">
        <div class="base-row" id="row-hex" data-base="HEX">
          <span class="base-label">HEX</span>
          <span class="base-value" id="val-hex">0</span>
        </div>
        <div class="base-row active" id="row-dec" data-base="DEC">
          <span class="base-label">DEC</span>
          <span class="base-value" id="val-dec">0</span>
        </div>
        <div class="base-row" id="row-oct" data-base="OCT">
          <span class="base-label">OCT</span>
          <span class="base-value" id="val-oct">0</span>
        </div>
        <div class="base-row" id="row-bin" data-base="BIN">
          <span class="base-label">BIN</span>
          <span class="base-value" id="val-bin">0</span>
        </div>
      </div>

      <div class="keybtn">
        <button class="hex-key" data-hex="A">A</button>
        <button class="action" id="AC">AC</button>
        <button class="action" id="backspace">DEL</button>
        <button class="action" id="Mod">%</button>
        <button class="operator" id="Div">÷</button>

        <button class="hex-key" data-hex="B">B</button>
        <button class="number" data-value="7">7</button>
        <button class="number" data-value="8">8</button>
        <button class="number" data-value="9">9</button>
        <button class="operator" id="Mul">×</button>

        <button class="hex-key" data-hex="C">C</button>
        <button class="number" data-value="4">4</button>
        <button class="number" data-value="5">5</button>
        <button class="number" data-value="6">6</button>
        <button class="operator" id="Sub">-</button>

        <button class="hex-key" data-hex="D">D</button>
        <button class="number" data-value="1">1</button>
        <button class="number" data-value="2">2</button>
        <button class="number" data-value="3">3</button>
        <button class="operator" id="Add">+</button>

        <button class="hex-key" data-hex="E">E</button>
        <button class="hex-key" data-hex="F">F</button>
        <button class="number" id="zero" data-value="0">0</button>
        <button id="dot">.</button>
        <button id="equals">=</button>
      </div>
      </div>
    </div>
`;

let result = document.getElementById("text") as HTMLInputElement;
const historyExpression = document.getElementById(
  "history-display",
) as HTMLElement;
const themeToggleBtn = document.getElementById(
  "theme-toggle-btn",
) as HTMLButtonElement;
const calcModeSelect = document.getElementById(
  "calc-mode-select",
) as HTMLSelectElement;
const calElement = document.querySelector(".cal") as HTMLElement;
let justCalculated = false;
type CalcMode = "normal" | "developer";

// <===================Developer Mode State =======================>
type Base = "HEX" | "DEC" | "OCT" | "BIN";
let currentBase: Base = "DEC";

// Base conversion helper functions
const parseToDecimal = (value: string, base: Base): number => {
  if (!value) return 0;
  switch (base) {
    case "BIN":
      return Number(`0b${value}`);
    case "OCT":
      return Number(`0o${value}`);
    case "HEX":
      return Number(`0x${value}`);
    case "DEC":
    default:
      return Number(value);
  }
};

const formatFromDecimal = (value: number, base: Base): string => {
  if (isNaN(value)) return "0";
  const intVal = Math.floor(value);
  switch (base) {
    case "BIN":
      return intVal.toString(2);
    case "OCT":
      return intVal.toString(8);
    case "HEX":
      return intVal.toString(16).toUpperCase();
    case "DEC":
    default:
      return intVal.toString(10);
  }
};

// Converts display expressions token-by-token from one base to another
function convertExpressionBase(expr: string, fromBase: Base, toBase: Base): string {
  let regex: RegExp;
  switch (fromBase) {
    case "BIN": regex = /[01]+/g; break;
    case "OCT": regex = /[0-7]+/g; break;
    case "DEC": regex = /[0-9]+/g; break;
    case "HEX": regex = /[0-9A-Fa-f]+/g; break;
  }
  
  return expr.replace(regex, (match) => {
    const decVal = parseToDecimal(match, fromBase);
    return formatFromDecimal(decVal, toBase);
  });
}

// Evaluates base-specific expression strings to decimal integers
function evaluateExpressionToDecimal(expr: string, base: Base): number {
  let cleaned = expr.replace(/X/g, "*"); //.replace(/÷/g, "/");
  cleaned = cleaned.replace(/[\+\-\*\/%]+$/, "").trim();
  if (!cleaned) return 0;
  
  let regex: RegExp;
  let prefix: string;
  switch (base) {
    case "BIN": regex = /[01]+/g; prefix = "0b"; break;
    case "OCT": regex = /[0-7]+/g; prefix = "0o"; break;
    case "HEX": regex = /[0-9A-Fa-f]+/g; prefix = "0x"; break;
    case "DEC":
    default:
      regex = /[0-9]+/g; prefix = ""; break;
  }
  
  let jsExpr = cleaned.replace(regex, (match) => {
    return prefix + match;
  });
  
  try {
    const val = eval(jsExpr);
    return typeof val === "number" ? Math.floor(val) : 0;
  } catch {
    return 0;
  }
}

// Updates the values displayed on the base row elements
function updateBasePanel() {
  const decVal = evaluateExpressionToDecimal(result.value, currentBase);
  
  const valHex = document.getElementById("val-hex");
  const valDec = document.getElementById("val-dec");
  const valOct = document.getElementById("val-oct");
  const valBin = document.getElementById("val-bin");
  
  if (valHex) valHex.textContent = formatFromDecimal(decVal, "HEX");
  if (valDec) valDec.textContent = formatFromDecimal(decVal, "DEC");
  if (valOct) valOct.textContent = formatFromDecimal(decVal, "OCT");
  if (valBin) valBin.textContent = formatFromDecimal(decVal, "BIN");
}

// Restricts keyboard buttons based on the active base
function updateKeyboardRestriction() {
  const mode = calcModeSelect.value as CalcMode;
  const dotBtn = document.getElementById("dot") as HTMLButtonElement | null;
  const hexBtns = document.querySelectorAll(".hex-key") as NodeListOf<HTMLButtonElement>;
  const numBtns = document.querySelectorAll(".number") as NodeListOf<HTMLButtonElement>;

  if (mode !== "developer") {
    if (dotBtn) dotBtn.disabled = false;
    // hexBtns → disabled = true;    // A-F معطّلة دايماً
    // numBtns → disabled = false;   // كل الأرقام متاحة
    hexBtns.forEach(btn => btn.disabled = true);
    numBtns.forEach(btn => btn.disabled = false);
    return;
  }

  if (dotBtn) dotBtn.disabled = true;

  hexBtns.forEach(btn => {
    btn.disabled = currentBase !== "HEX";
  });

  numBtns.forEach(btn => {
    const valStr = btn.dataset.value;
    if (!valStr) return;
    const val = parseInt(valStr, 10);
    
    if (currentBase === "BIN") {
      btn.disabled = val > 1; // يعني 2-9 معطّلة
    } else if (currentBase === "OCT") {
      btn.disabled = val > 7; // يعني 8,9 معطّلة
    } else if (currentBase === "DEC") {
      btn.disabled = false;
    } else if (currentBase === "HEX") {
      btn.disabled = false;
    }
  });
}

function setActiveBase(base: Base) {
  currentBase = base;
  
  // Update the active class on base rows ,
  //* إضافة 
  //* class active
  //* على الصف المختار وإزالتها من الباقين 
  //* (للـ CSS يعني يلوّنه)

  const baseRows = document.querySelectorAll(".base-row");
  baseRows.forEach(row => {
    if (row.getAttribute("data-base") === base) {
      row.classList.add("active");
    } else {
      row.classList.remove("active");
    }
  });
  
  updateKeyboardRestriction();
}

// Setup base row click event listeners
//* Event Listeners على Base Rows — الضغط على HEX/DEC/OCT/BIN
document.querySelectorAll(".base-row").forEach(row => {
  row.addEventListener("click", () => {
    const targetBase = row.getAttribute("data-base") as Base;
    if (targetBase && targetBase !== currentBase) {
      const oldBase = currentBase;
      const convertedValue = convertExpressionBase(result.value, oldBase, targetBase);
      result.value = convertedValue || "0";
      setActiveBase(targetBase);
      updateBasePanel();
    }
  });
});
// <===================Developer Mode State End=======================>

// <===================Calculator Mode=======================>

function setCalcMode(mode: CalcMode) {
  if (mode === "developer") {
    calElement.classList.add("mode-developer");
  } else {
    calElement.classList.remove("mode-developer");
  }
  calcModeSelect.value = mode;
  localStorage.setItem("calc-mode", mode);
  updateKeyboardRestriction();
  updateBasePanel();
}

const savedMode = localStorage.getItem("calc-mode") as CalcMode | null;
setCalcMode(savedMode || "normal");

calcModeSelect.addEventListener("change", () => {
  setCalcMode(calcModeSelect.value as CalcMode);
});

// <===================Calculator Mode end=======================>

// <===================Toggle Theme=======================>

function setTheme(theme: "light" | "dark") {
  if (theme === "light") {
    document.body.className = "light-theme";
    localStorage.setItem("aura-theme", "light");
  } else {
    document.body.className = "dark-theme";
    localStorage.setItem("aura-theme", "dark");
  }
}

// Read saved preference or system default
const savedTheme = localStorage.getItem("aura-theme") as
  | "light"
  | "dark"
  | null;
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggleBtn.addEventListener("click", () => {
  let currentTheme = document.body.classList.contains("light-theme")
    ? "light"
    : "dark";
  setTheme(currentTheme === "light" ? "dark" : "light");
});

// <===================Toggle Theme end=======================>

//<===================numbers=======================>

let numbers = document.querySelectorAll(".number")!;
numbers.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    clearError();

    const value = (event.target as HTMLButtonElement).dataset.value!;

    if (justCalculated) {
      result.value = value;
      justCalculated = false;
    } else {
      result.value = result.value === "0" ? value : result.value + value;
    }
    updateBasePanel();
  });
});

//<===================numbers end=======================>
// <===================Hexadecimal Keys=======================>
document.querySelectorAll(".hex-key").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    clearError();
    const hex = (event.target as HTMLButtonElement).dataset.hex!;

    if (justCalculated) {
      result.value = hex;
      justCalculated = false;
    } else {
      result.value = result.value === "0" ? hex : result.value + hex;
    }
    updateBasePanel();
  });
});
// <===================Hexadecimal Keys end=======================>

//Delete
function deleteElement(target: HTMLElement) {
  if (target.id === "backspace") {
    result.value = result.value.slice(0, -1);
    if (result.value === "") {
      result.value = "0";
    }
    justCalculated = false;
    updateBasePanel();
  }
}
// AC --> All Clear
function AllClear(target: HTMLElement) {
  if (target.id === "AC") {
    result.value = "0";
  }
  clearHistory();
  updateBasePanel();
}

//Operation
function operation(target: HTMLElement) {
  const operators: Record<string, string> = {
    Mod: "%",
    Div: "/",
    Mul: "X",
    Sub: "-",
    Add: "+",
  };
  let lastChar = result.value.slice(-1);
  let op = operators[target.id];

  if (!op) {
    return;
  }

  const isLastOperators = ["%", "/", "X", "-", "+"].includes(lastChar);
  if (!isLastOperators) {
    result.value += op;
    justCalculated = false;
    updateBasePanel();
  }
}

// decimal
function decimalDot() {
  let parts = result.value.split(/[\+\-\X\*\/]/);
  let lastNumber = parts[parts.length - 1];

  if (!lastNumber.includes(".")) {
    result.value += ".";
    justCalculated = false;
    updateBasePanel();
  }
}
// ! Result
//* historyValue
function equals() {
  const mode = calcModeSelect.value as CalcMode;
  if (mode === "developer") {
    try {
      historyExpression.textContent = result.value + " =";
      const decVal = evaluateExpressionToDecimal(result.value, currentBase);
      result.value = formatFromDecimal(decVal, currentBase);
      justCalculated = true;
      updateBasePanel();
    } catch {
      triggerError();
    }
  } else {
    let expression = result.value.replace("X", "*").replace("÷", "/");
    try {
      historyExpression.textContent = result.value + " =";
      result.value = eval(expression);

      justCalculated = true;
      if (result.value === "undefined" || result.value === "NaN" || result.value === "null") {
        result.value = "0";
      }
    } catch {
      triggerError();
    }
  }
}
//* Clear history
function clearHistory() {
  historyExpression.textContent = "";
}
// * Clear Error
function clearError() {
  if (result.value === "Error") {
    result.value = "0";
  }

  const isDark = document.body.classList.contains("dark-theme");

  if (isDark) {
    result.style.color = "#22d3ee";
  } else {
    result.style.color = "#1e293b";
  }
}

function triggerError() {
  result.value = "Error";
  result.style.color = "red";
  result.style.fontSize = "2.8rem";
  result.style.letterSpacing = "2.5px";
  clearHistory();
}

document.addEventListener("click", function (event) {
  const target = event.target as HTMLElement;

  clearError();

  target.id === "AC"
    ? AllClear(target)
    : target.id === "backspace"
      ? deleteElement(target)
      : target.id === "dot"
        ? decimalDot()
        : target.id === "equals"
          ? equals()
          : operation(target);
});
