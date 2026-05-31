import "./style/style.css";
import "./style/light.css";
import "./style/dark.css";

const appElement = document.getElementById("app")!;
appElement.innerHTML = `
<div class="cal">
    <!-- Header with single elegant sun/moon toggle button -->
    <div class="theme-header">
    
      <button class="theme-toggle-btn" id="theme-toggle-btn" title="Toggle Theme">
        <span class="sun-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113      47t113-47ZM480-480Z"/></svg>
        </span>
        <span class="moon-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
        </span>
      </button>
    </div>

    <!-- Double-row glass screen -->
    <div class="text">
      <div class="history-expr" id="history-display"></div>
      <input type="text" id="text" value="0" readonly />
    </div>

    <!-- Interactive Button Grid -->
    <div class="keybtn">
        <button class="action" id="AC">AC</button>
        <button class="action" id="backspace">DEL</button>
        <button class="action" id="Mod">%</button>
        <button class="operator" id="Div">÷</button>

        <button class="number" data-value="7" >7</button>
        <button class="number" data-value="8" >8</button>
        <button class="number" data-value="9" >9</button>
        <button class="operator" id="Mul">×</button>

        <button class="number" data-value="4" >4</button>
        <button class="number" data-value="5" >5</button>
        <button class="number" data-value="6" >6</button>
        <button class="operator" id="Sub">-</button>

        <button class="number" data-value="1" >1</button>
        <button class="number" data-value="2" >2</button>
        <button class="number" data-value="3" >3</button>
        <button class="operator" id="Add">+</button>

        <button class="number" id="zero" data-value="0" >0</button>
        <button id="dot">.</button>
        <button id="equals">=</button>
    </div>
</div>
`;

let result = document.getElementById("text") as HTMLInputElement;

// <===================Toggle Theme=======================>

const themeToggleBtn = document.getElementById(
  "theme-toggle-btn",
) as HTMLButtonElement;

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

    result.value = result.value === "0" ? value : result.value + value;
  });
});

//<===================numbers end=======================>

//Delete
function deleteElement(target: HTMLElement) {
  if (target.id === "backspace") {
    result.value = result.value.slice(0, -1);
  }
}
// AC --> All Clear
function reset(target: HTMLElement) {
  if (target.id === "AC") {
    result.value = "0";
  }
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
  }
}

// decimal
function decimal() {
  let parts = result.value.split(/[\+\-\X\*\/]/);
  let lastNumber = parts[parts.length - 1];

  if (!lastNumber.includes(".")) {
    result.value += ".";
  }
}

// ! Result
function equals() {
  let expression = result.value.replace("X", "*");
  try {
    result.value = eval(expression);
  } catch {
    result.value = "Error";
    result.style.color = "red";
  }
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
document.addEventListener("click", function (event) {
  const target = event.target as HTMLElement;

  clearError();
  
  target.id === "AC"
    ? reset(target)
    : target.id === "backspace"
      ? deleteElement(target)
      : target.id === "dot"
        ? decimal()
        : target.id === "equals"
          ? equals()
          : operation(target);
});
