/**
 * 使用統計管理模組
 * 負責處理模板的使用統計功能
 */
class UsageManager {
  constructor() {
    this.usageStats = new Map();
    this.init();
  }

  /**
   * 初始化使用統計管理器
   */
  async init() {
    try {
      await this.loadUsageStats();
      this.setupEventListeners();
      console.log("✅ 使用統計管理器初始化完成");
    } catch (error) {
      console.error("❌ 使用統計管理器初始化失敗:", error);
    }
  }

  /**
   * 加載使用統計數據
   */
  async loadUsageStats() {
    try {
      const response = await fetch("../data/templates/usage-data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      data.usage.forEach((stat) => {
        this.usageStats.set(stat.templateId, stat);
      });
    } catch (error) {
      console.error("加載使用統計數據失敗:", error);
      throw error;
    }
  }

  /**
   * 設置事件監聽器
   */
  setupEventListeners() {
    // 監聽模板複製事件
    document.addEventListener("template-copied", (e) => {
      this.recordUsage(e.detail.templateId, "copy");
    });

    // 監聽模板下載事件
    document.addEventListener("template-downloaded", (e) => {
      this.recordUsage(e.detail.templateId, "download");
    });

    // 監聽模板預覽事件
    document.addEventListener("template-previewed", (e) => {
      this.recordUsage(e.detail.templateId, "preview");
    });

    // 監聽模板編輯事件
    document.addEventListener("template-edited", (e) => {
      this.recordUsage(e.detail.templateId, "edit");
    });
  }

  /**
   * 記錄使用情況
   */
  async recordUsage(templateId, action) {
    const currentStats = this.usageStats.get(templateId) || {
      templateId,
      totalUsage: 0,
      copyCount: 0,
      downloadCount: 0,
      previewCount: 0,
      editCount: 0,
      usageByDate: {},
      usageByUser: {},
      lastUsed: null,
      history: [],
    };

    // 更新總使用次數
    currentStats.totalUsage++;

    // 更新特定動作計數
    switch (action) {
      case "copy":
        currentStats.copyCount++;
        break;
      case "download":
        currentStats.downloadCount++;
        break;
      case "preview":
        currentStats.previewCount++;
        break;
      case "edit":
        currentStats.editCount++;
        break;
    }

    // 更新日期統計
    const today = new Date().toISOString().split("T")[0];
    currentStats.usageByDate[today] =
      (currentStats.usageByDate[today] || 0) + 1;

    // 更新用戶統計
    const currentUser = localStorage.getItem("currentUser") || "anonymous";
    currentStats.usageByUser[currentUser] =
      (currentStats.usageByUser[currentUser] || 0) + 1;

    // 更新最後使用時間
    currentStats.lastUsed = new Date().toISOString();

    // 添加到歷史記錄
    currentStats.history.push({
      action,
      timestamp: new Date().toISOString(),
      user: currentUser,
    });

    // 保存更新後的統計數據
    this.usageStats.set(templateId, currentStats);
    await this.saveUsageStats();

    return currentStats;
  }

  /**
   * 保存使用統計數據
   */
  async saveUsageStats() {
    try {
      const statsArray = Array.from(this.usageStats.values());
      const response = await fetch("../data/templates/usage-data.json", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usage: statsArray }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("保存使用統計數據失敗:", error);
      throw error;
    }
  }

  /**
   * 獲取模板使用統計
   */
  getTemplateStats(templateId) {
    return this.usageStats.get(templateId) || null;
  }

  /**
   * 獲取使用趨勢
   */
  getUsageTrends(templateId, days = 30) {
    const stats = this.usageStats.get(templateId);
    if (!stats) return null;

    const trends = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const date = d.toISOString().split("T")[0];
      trends.push({
        date,
        usage: stats.usageByDate[date] || 0,
      });
    }

    return trends;
  }

  /**
   * 獲取最常用模板
   */
  getMostUsedTemplates(limit = 10) {
    return Array.from(this.usageStats.values())
      .sort((a, b) => b.totalUsage - a.totalUsage)
      .slice(0, limit);
  }

  /**
   * 獲取用戶使用報告
   */
  getUserUsageReport(userId) {
    const report = {
      totalUsage: 0,
      templateUsage: [],
      actionBreakdown: {
        copy: 0,
        download: 0,
        preview: 0,
        edit: 0,
      },
    };

    this.usageStats.forEach((stats) => {
      const userUsage = stats.usageByUser[userId] || 0;
      if (userUsage > 0) {
        report.totalUsage += userUsage;
        report.templateUsage.push({
          templateId: stats.templateId,
          usage: userUsage,
        });
      }
    });

    return report;
  }

  /**
   * 生成使用報告
   */
  generateUsageReport(startDate, endDate) {
    const report = {
      period: {
        start: startDate,
        end: endDate,
      },
      totalUsage: 0,
      templateBreakdown: [],
      userBreakdown: [],
      actionBreakdown: {
        copy: 0,
        download: 0,
        preview: 0,
        edit: 0,
      },
    };

    this.usageStats.forEach((stats) => {
      // 計算時間範圍內的使用情況
      const periodUsage = stats.history.filter(
        (h) => h.timestamp >= startDate && h.timestamp <= endDate
      );

      if (periodUsage.length > 0) {
        // 更新總使用次數
        report.totalUsage += periodUsage.length;

        // 更新模板使用統計
        report.templateBreakdown.push({
          templateId: stats.templateId,
          usage: periodUsage.length,
        });

        // 更新動作統計
        periodUsage.forEach((usage) => {
          report.actionBreakdown[usage.action]++;
        });

        // 更新用戶統計
        const userStats = {};
        periodUsage.forEach((usage) => {
          userStats[usage.user] = (userStats[usage.user] || 0) + 1;
        });

        Object.entries(userStats).forEach(([user, count]) => {
          report.userBreakdown.push({ user, usage: count });
        });
      }
    });

    // 排序統計結果
    report.templateBreakdown.sort((a, b) => b.usage - a.usage);
    report.userBreakdown.sort((a, b) => b.usage - a.usage);

    return report;
  }
}

// 導出模組
export default UsageManager;
