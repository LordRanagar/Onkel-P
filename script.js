
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const links = [...nav.querySelectorAll("a")];
  if (!links.length) return;

  // One single OP marker. It moves to the active/hovered menu item.
  const marker = document.createElement("span");
  marker.className = "nav-marker";
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = "∞";
  nav.appendChild(marker);

  links.forEach(link => {
    const slot = document.createElement("span");
    slot.className = "marker-slot";
    slot.setAttribute("aria-hidden", "true");
    link.prepend(slot);
  });

  const active = nav.querySelector("a.active") || links[0];

  function moveMarker(link, animate = true) {
    const slot = link.querySelector(".marker-slot");
    if (!slot) return;

    const navRect = nav.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();

    marker.style.transition = animate
      ? "transform .32s cubic-bezier(.2,.8,.2,1)"
      : "none";

    marker.style.transform =
      `translate(${slotRect.left - navRect.left}px, ${slotRect.top - navRect.top}px)`;
  }

  // Wait until the browser has laid out the fixed banner and navigation.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => moveMarker(active, false));
  });

  links.forEach(link => {
    link.addEventListener("mouseenter", () => moveMarker(link, true));
    link.addEventListener("focus", () => moveMarker(link, true));
    link.addEventListener("mouseleave", () => moveMarker(active, true));
    link.addEventListener("blur", () => moveMarker(active, true));
  });

  window.addEventListener("resize", () => moveMarker(active, false));
  window.addEventListener("scroll", () => moveMarker(active, false), { passive: true });

  // Nordbryg beer selector.
  const beerLinks = document.querySelectorAll("[data-beer]");
  const beerTitle = document.querySelector("[data-beer-title]");

  if (beerLinks.length && beerTitle) {
    beerLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        beerLinks.forEach(x => x.classList.remove("selected"));
        link.classList.add("selected");
        const n = link.dataset.beer;
        beerTitle.textContent = `Øl nr. ${n}`;
        const selectedLabel = document.querySelector("#selected-beer-label");
        if (selectedLabel) selectedLabel.textContent = `Øl nr. ${n}`;
        history.replaceState(null, "", `#ol-${n}`);
      });
    });
  }
});
