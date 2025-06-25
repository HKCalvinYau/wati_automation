/**
 * 搜索管理模組
 * 負責處理模板搜索相關功能
 */
class SearchManager {
  constructor() {
    this.searchHistory = this.loadSearchHistory();
    this.maxHistoryItems = 10;
    this.init();
  }

  /**
   * 初始化搜索管理器
   */
  init() {
    this.setupSearchBox();
    this.setupSearchHistory();
    console.log("✅ 搜索管理器初始化完成");
  }

  /**
   * 設置搜索框
   */
  setupSearchBox() {
    const searchBox = document.createElement("div");
    searchBox.className = "search-box";
    searchBox.innerHTML = `
            <div class="search-input-wrapper">
                <input type="text" class="search-input" placeholder="搜索模板...">
                <button class="search-button">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <div class="search-suggestions"></div>
        `;

    // 插入到頁面
    const header = document.querySelector(".page-header");
    if (header) {
      header.appendChild(searchBox);
    }

    // 綁定事件
    const input = searchBox.querySelector(".search-input");
    input.addEventListener("input", (e) => this.handleSearchInput(e));
    input.addEventListener("focus", () => this.showSearchHistory());
    input.addEventListener("blur", () => {
      // 延遲隱藏，以便能夠點擊建議
      setTimeout(() => this.hideSearchSuggestions(), 200);
    });
  }

  /**
   * 設置搜索歷史
   */
  setupSearchHistory() {
    // 初始化搜索歷史容器
    const suggestions = document.querySelector(".search-suggestions");
    if (suggestions) {
      suggestions.style.display = "none";
    }
    
    console.log("✅ 搜索歷史設置完成");
  }

  /**
   * 處理搜索輸入
   */
  handleSearchInput(e) {
    const query = e.target.value.trim();
    if (query) {
      this.showSearchSuggestions(query);
    } else {
      this.showSearchHistory();
    }
  }

  /**
   * 顯示搜索建議
   */
  async showSearchSuggestions(query) {
    try {
      const templates = await this.searchTemplates(query);
      const suggestions = document.querySelector(".search-suggestions");

      if (!templates.length) {
        suggestions.innerHTML = '<div class="no-results">無搜索結果</div>';
        return;
      }

      suggestions.innerHTML = templates
        .map(
          (template) => `
                    <div class="search-suggestion" data-id="${template.id}">
                        <div class="suggestion-title">${template.title.zh}</div>
                        <div class="suggestion-category">${template.category}</div>
                    </div>
                `
        )
        .join("");

      // 綁定點擊事件
      suggestions.querySelectorAll(".search-suggestion").forEach((item) => {
        item.addEventListener("click", () => {
          const id = item.dataset.id;
          this.addToSearchHistory(query);
          window.location.href = `detail.html?id=${id}`;
        });
      });

      suggestions.style.display = "block";
    } catch (error) {
      console.error("搜索建議加載失敗:", error);
    }
  }

  /**
   * 搜索模板
   */
  async searchTemplates(query) {
    try {
      const response = await fetch("data/templates/template-data.json");
      const data = await response.json();

      return data.templates.filter((template) => {
        const searchText = `
                    ${template.title.zh}
                    ${template.title.en}
                    ${template.description.zh}
                    ${template.description.en}
                    ${template.content.zh}
                    ${template.content.en}
                `.toLowerCase();

        return query
          .toLowerCase()
          .split(" ")
          .every((word) => searchText.includes(word));
      });
    } catch (error) {
      console.error("模板搜索失敗:", error);
      return [];
    }
  }

  /**
   * 加載搜索歷史
   */
  loadSearchHistory() {
    const history = localStorage.getItem("searchHistory");
    return history ? JSON.parse(history) : [];
  }

  /**
   * 保存搜索歷史
   */
  saveSearchHistory(history) {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }

  /**
   * 添加到搜索歷史
   */
  addToSearchHistory(query) {
    const history = this.loadSearchHistory();

    // 移除重複項
    const index = history.indexOf(query);
    if (index > -1) {
      history.splice(index, 1);
    }

    // 添加到開頭
    history.unshift(query);

    // 限制數量
    if (history.length > this.maxHistoryItems) {
      history.pop();
    }

    this.saveSearchHistory(history);
  }

  /**
   * 顯示搜索歷史
   */
  showSearchHistory() {
    const history = this.loadSearchHistory();
    const suggestions = document.querySelector(".search-suggestions");

    if (!history.length) {
      suggestions.innerHTML = '<div class="no-history">無搜索歷史</div>';
      return;
    }

    suggestions.innerHTML = history
      .map(
        (query) => `
                <div class="search-history-item">
                    <i class="fas fa-history"></i>
                    <span>${query}</span>
                    <button class="delete-history" data-query="${query}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `
      )
      .join("");

    // 綁定點擊事件
    suggestions.querySelectorAll(".search-history-item").forEach((item) => {
      const query = item.querySelector("span").textContent;

      // 點擊歷史項
      item.addEventListener("click", () => {
        document.querySelector(".search-input").value = query;
        this.showSearchSuggestions(query);
      });

      // 刪除歷史項
      item.querySelector(".delete-history").addEventListener("click", (e) => {
        e.stopPropagation();
        this.removeFromHistory(query);
        this.showSearchHistory();
      });
    });

    suggestions.style.display = "block";
  }

  /**
   * 從歷史記錄中移除
   */
  removeFromHistory(query) {
    const history = this.loadSearchHistory();
    const index = history.indexOf(query);
    if (index > -1) {
      history.splice(index, 1);
      this.saveSearchHistory(history);
    }
  }

  /**
   * 隱藏搜索建議
   */
  hideSearchSuggestions() {
    const suggestions = document.querySelector(".search-suggestions");
    if (suggestions) {
      suggestions.style.display = "none";
    }
  }
}

// 全局實例
window.SearchManager = SearchManager;
