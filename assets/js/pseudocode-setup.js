window.MathJax = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
    processEnvironments: true,
  },
};

function renderPseudocodeBlocks() {
  document.querySelectorAll("pre>code.language-pseudocode").forEach((elem) => {
    const texData = elem.textContent;
    const codeBlock = elem.parentElement;
    /* create pseudocode node */
    let pseudoCodeElement = document.createElement("pre");
    pseudoCodeElement.classList.add("pseudocode");
    const text = document.createTextNode(texData);
    pseudoCodeElement.appendChild(text);
    /* replace the source block in place */
    codeBlock.replaceWith(pseudoCodeElement);
    /* embed the visualization in the container */
    pseudocode.renderElement(pseudoCodeElement);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderPseudocodeBlocks);
} else {
  renderPseudocodeBlocks();
}
