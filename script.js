
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

});


document.addEventListener("DOMContentLoaded", () => {
  const tabs = [...document.querySelectorAll(".beer-tab[data-beer]")];
  const panels = [...document.querySelectorAll(".beer-detail[data-beer-panel]")];
  if (!tabs.length || !panels.length) return;

  function showBeer(name, updateHash = true) {
    tabs.forEach(tab => {
      const selected = tab.dataset.beer === name;
      tab.classList.toggle("selected", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
    });

    panels.forEach(panel => {
      const active = panel.dataset.beerPanel === name;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });

    if (updateHash && history.replaceState) {
      history.replaceState(null, "", "#" + name);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", event => {
      event.preventDefault();
      showBeer(tab.dataset.beer);
    });
  });

  const initial = location.hash.slice(1);
  showBeer(
    panels.some(panel => panel.dataset.beerPanel === initial) ? initial : "mjoelner",
    false
  );
});
