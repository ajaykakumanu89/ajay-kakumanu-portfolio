(() => {
  "use strict";

  const navigation = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");

  if (navigation && toggle) {
    document.documentElement.classList.add("has-js");
    const setNavigation = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      navigation.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => {
      setNavigation(toggle.getAttribute("aria-expanded") !== "true");
    });
    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) setNavigation(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNavigation(false);
        toggle.focus();
      }
    });
  }

  if (!navigator.clipboard || !window.isSecureContext) return;

  document.querySelectorAll(".doc-prose pre > code").forEach((code) => {
    const pre = code.parentElement;
    if (pre.querySelector(".copy-code")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code block");
    button.setAttribute("aria-live", "polite");
    pre.classList.add("has-copy");
    pre.append(button);
    let resetTimer;
    button.addEventListener("click", async () => {
      clearTimeout(resetTimer);
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copied";
        button.setAttribute("aria-label", "Code copied");
      } catch {
        button.textContent = "Select to copy";
        button.setAttribute("aria-label", "Copy unavailable; select the code manually");
      }
      resetTimer = setTimeout(() => {
        button.textContent = "Copy";
        button.setAttribute("aria-label", "Copy code block");
      }, 2200);
    });
  });
})();
