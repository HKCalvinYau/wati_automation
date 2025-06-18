/**
 * 工具函數集合
 * 提供常用的輔助功能
 */

// 日期格式化
const formatDate = (date, format = "YYYY-MM-DD") => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 防抖函數
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 節流函數
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 深拷貝
const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map((item) => deepClone(item));
  if (typeof obj === "object") {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// 本地存儲工具
const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("存儲失敗:", error);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("讀取失敗:", error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("刪除失敗:", error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("清空失敗:", error);
      return false;
    }
  },
};

// URL 參數工具
const urlParams = {
  get: (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  set: (name, value) => {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.replaceState({}, "", url);
  },

  remove: (name) => {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.replaceState({}, "", url);
  },

  getAll: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    return params;
  },
};

// 驗證工具
const validate = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  phone: (phone) => {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone);
  },

  required: (value) => {
    return value !== null && value !== undefined && value !== "";
  },

  minLength: (value, min) => {
    return value && value.length >= min;
  },

  maxLength: (value, max) => {
    return value && value.length <= max;
  },
};

// 文件工具
const fileUtils = {
  download: (content, filename, type = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  readAsText: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  },

  readAsJSON: async (file) => {
    const text = await fileUtils.readAsText(file);
    return JSON.parse(text);
  },
};

// DOM 工具
const domUtils = {
  createElement: (tag, className = "", innerHTML = "") => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  },

  addClass: (element, className) => {
    if (element && element.classList) {
      element.classList.add(className);
    }
  },

  removeClass: (element, className) => {
    if (element && element.classList) {
      element.classList.remove(className);
    }
  },

  toggleClass: (element, className) => {
    if (element && element.classList) {
      element.classList.toggle(className);
    }
  },

  hasClass: (element, className) => {
    return (
      element && element.classList && element.classList.contains(className)
    );
  },

  getElement: (selector) => {
    return document.querySelector(selector);
  },

  getElements: (selector) => {
    return document.querySelectorAll(selector);
  },
};

// 動畫工具
const animation = {
  fadeIn: (element, duration = 300) => {
    element.style.opacity = "0";
    element.style.display = "block";

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);

      element.style.opacity = opacity;

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },

  fadeOut: (element, duration = 300) => {
    const startOpacity = parseFloat(getComputedStyle(element).opacity);
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.max(startOpacity - progress / duration, 0);

      element.style.opacity = opacity;

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = "none";
      }
    };

    requestAnimationFrame(animate);
  },

  slideDown: (element, duration = 300) => {
    element.style.height = "0";
    element.style.overflow = "hidden";
    element.style.display = "block";

    const targetHeight = element.scrollHeight;
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const height = Math.min(
        (progress / duration) * targetHeight,
        targetHeight
      );

      element.style.height = height + "px";

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.height = "auto";
        element.style.overflow = "visible";
      }
    };

    requestAnimationFrame(animate);
  },

  slideUp: (element, duration = 300) => {
    const startHeight = element.scrollHeight;
    element.style.height = startHeight + "px";
    element.style.overflow = "hidden";

    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const height = Math.max(
        startHeight - (progress / duration) * startHeight,
        0
      );

      element.style.height = height + "px";

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = "none";
        element.style.height = "auto";
        element.style.overflow = "visible";
      }
    };

    requestAnimationFrame(animate);
  },
};

// 錯誤處理工具
const errorHandler = {
  log: (error, context = "") => {
    console.error(`[${context}] 錯誤:`, error);

    // 可以添加錯誤報告邏輯
    if (window.errorReporter) {
      window.errorReporter.captureException(error, {
        tags: { context },
      });
    }
  },

  show: (message, type = "error") => {
    // 顯示用戶友好的錯誤訊息
    if (window.templateManager && window.templateManager.showError) {
      window.templateManager.showError(message);
    } else {
      alert(message);
    }
  },

  handle: (error, context = "") => {
    errorHandler.log(error, context);
    errorHandler.show("操作失敗，請稍後再試");
  },
};

// 性能監控工具
const performance = {
  mark: (name) => {
    if (window.performance && window.performance.mark) {
      window.performance.mark(name);
    }
  },

  measure: (name, startMark, endMark) => {
    if (window.performance && window.performance.measure) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
      } catch (error) {
        console.warn("性能測量失敗:", error);
      }
    }
  },
};

// 導出工具函數
window.utils = {
  formatDate,
  generateId,
  debounce,
  throttle,
  deepClone,
  storage,
  urlParams,
  validate,
  fileUtils,
  domUtils,
  animation,
  errorHandler,
  performance,
};

// 兼容性檢查
const checkCompatibility = () => {
  const checks = {
    localStorage: typeof Storage !== "undefined",
    fetch: typeof fetch !== "undefined",
    promise: typeof Promise !== "undefined",
    templateLiterals: (() => {
      try {
        eval("`test`");
        return true;
      } catch (e) {
        return false;
      }
    })(),
    arrowFunctions: (() => {
      try {
        eval("() => {}");
        return true;
      } catch (e) {
        return false;
      }
    })(),
  };

  const unsupported = Object.entries(checks)
    .filter(([feature, supported]) => !supported)
    .map(([feature]) => feature);

  if (unsupported.length > 0) {
    console.warn("不支援的功能:", unsupported.join(", "));
    return false;
  }

  return true;
};

// 初始化時檢查兼容性
if (!checkCompatibility()) {
  console.error("瀏覽器不支援某些必要功能，可能影響系統正常運行");
}
