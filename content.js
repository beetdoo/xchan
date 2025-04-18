const usernameMap = new Map();

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

function anonymizeUsernames() {
    const feed = document.querySelector('[aria-label="Timeline: Your Home Timeline"]');
    const feedSpans = feed ? feed.querySelectorAll('a[href*="/"] span') : [];
  
    const articleSpans = document.querySelectorAll('article a[href^="/"][role="link"] span');
    const sidebarSpans = document.querySelectorAll('[data-testid="UserCell"] span');
  
    const allSpans = new Set([...feedSpans, ...articleSpans, ...sidebarSpans]);
  
    allSpans.forEach(span => {
      const original = span.getAttribute("data-original-name") || span.innerText;
  
      if (!original || original.includes("-") || original.length > 30) return;
  
      const isHandle = /^@[\w_]{1,15}$/.test(original);
      const isLikelyDisplayName = !original.startsWith('@') && /^[\w\s\-'.]{2,30}$/.test(original);
  
      if (!isHandle && !isLikelyDisplayName) return;
  
      if (!usernameMap.has(original)) {
        usernameMap.set(original, hashString(original));
      }
  
      const hashed = usernameMap.get(original);
  
      if (span.innerText !== hashed) {
        span.setAttribute("data-original-name", original);
        span.innerText = hashed;
      }
    });
}

function hideMetrics() {
  const metricsSelectors = [
    '[data-testid="like"]',
    '[data-testid="retweet"]',
    '[data-testid="viewCount"]',
    '[aria-label*="Like"]',
    '[aria-label*="Retweet"]',
    '[aria-label*="Views"]'
  ];

  metricsSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = "none";
    });
  });
}

function hardHideDisplayNames() {
    const containers = document.querySelectorAll(
      'article, [data-testid="UserCell"], [data-testid="User-Name"]'
    );
  
    containers.forEach(container => {
      const nameSpans = container.querySelectorAll(
        'div[dir="auto"][role="heading"], div[dir="ltr"] > span'
      );
  
      nameSpans.forEach(el => {
        const original = el.getAttribute("data-original-name") || el.innerText;
  
        if (!original || original.includes("-") || original.length > 50) return;
  
        if (!usernameMap.has(original)) {
          usernameMap.set(original, hashString(original));
        }
  
        const hashed = usernameMap.get(original);
  
        if (el.innerText !== hashed) {
          el.setAttribute("data-original-name", original);
          el.innerText = hashed;
        }
      });
    });
}

function hideProfilePhotos() {
    const selectors = [
      '[data-testid="Tweet-User-Avatar"]',
      '[data-testid^="UserAvatar"]',
      'img[src*="profile_images"]',
      'img[alt="Image"][draggable="true"]'
    ];
  
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      console.log(`[xchan] Hiding ${elements.length} elements for selector: ${selector}`);
  
      elements.forEach(el => {
        el.style.setProperty("display", "none", "important");
      });
    });
  }

  window.addEventListener("load", () => {
    // 🔹 Immediately run the anonymizer once
    try {
        anonymizeUsernames();
        hideMetrics();
        hideProfilePhotos();
        hardHideDisplayNames();
    } catch (err) {
        console.error("[xchan] Error during initial run:", err);
    }
  
    // 🔹 Set up throttled MutationObserver
    let pending = false;
  
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
  
      setTimeout(() => {
        try {
          anonymizeUsernames();
          hideMetrics();
          hideProfilePhotos();
          hardHideDisplayNames();
        } catch (err) {
          console.error("[xchan] Error during mutation:", err);
        }
        pending = false;
      }, 500); // <- adjust this delay as needed
    });
  
    // 🔹 Wait for body, then observe
    function waitForBodyAndObserve() {
      if (!document.body) {
        console.warn("[xchan] Waiting for document.body...");
        setTimeout(waitForBodyAndObserve, 100);
        return;
      }
  
      observer.observe(document.body, { childList: true, subtree: true });
    }
  
    waitForBodyAndObserve();
  });
