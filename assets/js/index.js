let lines = [];
let includeNewLine = false;

function setupEventListeners() {
  document.getElementById("inputText").addEventListener("input", () => {
    updateColorInputs();
    updateCharacterCount();
  });
}

function updateColorInputs() {
  const text = document.getElementById("inputText").value;
  const colorInputsDiv = document.getElementById("colorInputs");
  colorInputsDiv.innerHTML = "";
  lines = text.split("\n");

  const colorMode = document.getElementById("colorMode").value;

  lines.forEach((line, lineIndex) => {
    const segments = getSegments(line, colorMode);

    segments.forEach((segment, segmentIndex) => {
      if (segment.length > 0 && segment !== " ") {
        colorInputsDiv.appendChild(
          createColorLabel(segment, lineIndex, segmentIndex)
        );
        colorInputsDiv.appendChild(
          createColorInput(lineIndex, segmentIndex)
        );
      } else {
        colorInputsDiv.appendChild(createSpaceLabel());
      }
    });
  });
}

function getSegments(line, mode) {
  if (mode === "letter") return [...line];
  if (mode === "word") return line.split(" ");
  return [line];
}

function createColorLabel(segment, lineIndex, segmentIndex) {
  const label = document.createElement("label");
  label.className = "color-label";
  label.innerText = segment;
  label.htmlFor = `color${lineIndex}-${segmentIndex}`;
  return label;
}

function createColorInput(lineIndex, segmentIndex) {
  const input = document.createElement("input");
  input.type = "color";
  input.className = "color-input";
  input.id = `color${lineIndex}-${segmentIndex}`;
  input.name = `color${lineIndex}-${segmentIndex}`;
  input.value = "#000000"; // Default color
  input.title = `Color for '${
    document
      .getElementById(`inputText`)
      .value.split("\n")
      [lineIndex].split(" ")[segmentIndex]
  }'`; // Tooltip with segment
  input.style.marginRight = "20px"; // Add margin-right of 20px
  return input;
}

function createSpaceLabel() {
  const space = document.createElement("span");
  space.className = "color-label";
  space.innerText = " ";
  return space;
}

function addNewLine() {
  includeNewLine = true;
  const textArea = document.getElementById("inputText");
  const cursorPos = textArea.selectionStart;
  textArea.value = `${textArea.value.slice(
    0,
    cursorPos
  )}\n${textArea.value.slice(cursorPos)}`;
  textArea.focus();
  textArea.selectionStart = textArea.selectionEnd = cursorPos + 1;
  updateColorInputs();
  updateCharacterCount();
}

function generateColoredText() {
  const text = document.getElementById("inputText").value;
  let result = "";
  lines = text.split("\n");
  const colorMode = document.getElementById("colorMode").value;

  lines.forEach((line, lineIndex) => {
    const segments = getSegments(line, colorMode);

    segments.forEach((segment, segmentIndex) => {
      if (segment !== " ") {
        const color = document
          .getElementById(`color${lineIndex}-${segmentIndex}`)
          .value.substring(1);
        result += `#c${color}${segment}`;
      } else {
        result += segment;
      }
      if (colorMode === "word" || colorMode === "sentence") {
        result += " ";
      }
    });

    if (includeNewLine || lineIndex < lines.length - 1) {
      result += "#r";
    }
  });

  includeNewLine = false;

  const resultDiv = document.getElementById("result");
  const copyButton = document.getElementById("copyButton");
  const noResultMessage = document.getElementById("noResultMessage");

  if (result) {
    resultDiv.style.display = "block";
    resultDiv.innerText = result;
    copyButton.style.display = "block";
    noResultMessage.style.display = "none";
  } else {
    resultDiv.style.display = "none";
    copyButton.style.display = "none";
    noResultMessage.style.display = "block";
  }

  document.getElementById("charCount").innerText = result.length;
}

function resetForm() {
  document.getElementById("inputText").value = "";
  document.getElementById("colorInputs").innerHTML = "";
  document.getElementById("result").innerText = "";
  document.getElementById("charCount").innerText = "0";
  includeNewLine = false;
}

function updateCharacterCount() {
  const text = document.getElementById("inputText").value;
  let result = "";
  lines = text.split("\n");
  const colorMode = document.getElementById("colorMode").value;

  lines.forEach((line, lineIndex) => {
    const segments = getSegments(line, colorMode);

    segments.forEach((segment, segmentIndex) => {
      if (segment !== " ") {
        result += `#c000000${segment}`;
      } else {
        result += segment;
      }
      if (colorMode === "word" || colorMode === "sentence") {
        result += " ";
      }
    });

    if (includeNewLine || lineIndex < lines.length - 1) {
      result += "#r";
    }
  });

  document.getElementById("charCount").innerText = result.length;
}

function copyToClipboard() {
  const resultText = document.getElementById("result").innerText;
  navigator.clipboard
    .writeText(resultText)
    .then(() => alert("Text copied to clipboard!"))
    .catch((err) => console.error("Error copying text: ", err));
}

function initializePage() {
  document.getElementById("result").style.display = "none";
  document.getElementById("copyButton").style.display = "none";
  document.getElementById("noResultMessage").style.display = "block";
}

window.onload = initializePage;
setupEventListeners();
