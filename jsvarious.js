async function loadHtml(fileName, targetDiv) {
  const filename = fileName;

  if (!filename) {
    alert("Please enter a file name.");
    return;
  }

  try {
    const response = await fetch(filename);
    if (!response.ok) {
      throw new Error(`Error loading file: ${response.statusText}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const contentDiv = document.getElementById(targetDiv);
    contentDiv.innerHTML = doc.body.innerHTML;

    return doc; // Return the parsed document for further processing
  } catch (error) {
    document.getElementById(targetDiv).innerHTML = `<p style="color: red;">${error.message}</p>`;
    throw error;
  }
}

function applyInlineStyles(doc) {
  const styles = doc.querySelectorAll("style");
  styles.forEach(style => {
    const newStyle = document.createElement("style");
    newStyle.textContent = style.textContent;
    document.head.appendChild(newStyle);
  });
}

function loadScripts(doc) {
  const scripts = doc.querySelectorAll("script");
  scripts.forEach(script => {
    const newScript = document.createElement("script");
    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }
    document.body.appendChild(newScript);
  });
}


async function loadHtmlWithInlineStylesAndScripts(fileName, targetDiv) {
  try {
    const doc = await loadHtml(fileName, targetDiv); // Load HTML
    applyInlineStyles(doc); // Apply CSS
    loadScripts(doc); // Load JS
  } catch (error) {
    console.error("Error loading content:", error);
  }
}