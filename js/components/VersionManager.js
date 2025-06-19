/**
 * 版本控制管理模組
 * 負責處理模板的版本控制功能
 */
class VersionManager {
  constructor() {
    this.versions = new Map();
    this.init();
  }

  /**
   * 初始化版本管理器
   */
  async init() {
    try {
      await this.loadVersions();
      console.log("✅ 版本管理器初始化完成");
    } catch (error) {
      console.error("❌ 版本管理器初始化失敗:", error);
    }
  }

  /**
   * 加載版本數據
   */
  async loadVersions() {
    try {
      const response = await fetch("/data/templates/version-data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      data.versions.forEach((version) => {
        this.versions.set(version.templateId, version);
      });
    } catch (error) {
      console.error("加載版本數據失敗:", error);
      throw error;
    }
  }

  /**
   * 創建新版本
   */
  async createVersion(templateId, changes) {
    const currentVersion = this.versions.get(templateId) || {
      version: 0,
      history: [],
    };
    const newVersion = {
      templateId,
      version: currentVersion.version + 1,
      timestamp: new Date().toISOString(),
      author: localStorage.getItem("currentUser") || "unknown",
      changes,
      history: [
        ...(currentVersion.history || []),
        {
          version: currentVersion.version + 1,
          timestamp: new Date().toISOString(),
          author: localStorage.getItem("currentUser") || "unknown",
          changes,
        },
      ],
    };

    this.versions.set(templateId, newVersion);
    await this.saveVersions();
    return newVersion;
  }

  /**
   * 保存版本數據
   */
  async saveVersions() {
    try {
      const versionsArray = Array.from(this.versions.values());
      const response = await fetch("/data/templates/version-data.json", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ versions: versionsArray }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("保存版本數據失敗:", error);
      throw error;
    }
  }

  /**
   * 獲取版本歷史
   */
  getVersionHistory(templateId) {
    const version = this.versions.get(templateId);
    return version ? version.history : [];
  }

  /**
   * 回滾到指定版本
   */
  async rollbackToVersion(templateId, targetVersion) {
    const version = this.versions.get(templateId);
    if (!version) {
      throw new Error("模板版本不存在");
    }

    const targetHistory = version.history.find(
      (h) => h.version === targetVersion
    );
    if (!targetHistory) {
      throw new Error("目標版本不存在");
    }

    // 創建回滾版本
    const rollbackVersion = await this.createVersion(templateId, {
      type: "rollback",
      targetVersion,
      reason: "版本回滾",
      previousContent: version.content,
    });

    return rollbackVersion;
  }

  /**
   * 比較版本差異
   */
  compareVersions(templateId, version1, version2) {
    const history = this.getVersionHistory(templateId);
    const v1 = history.find((h) => h.version === version1);
    const v2 = history.find((h) => h.version === version2);

    if (!v1 || !v2) {
      throw new Error("版本不存在");
    }

    return {
      version1: v1,
      version2: v2,
      differences: this.calculateDifferences(v1, v2),
    };
  }

  /**
   * 計算版本差異
   */
  calculateDifferences(v1, v2) {
    const differences = [];

    // 比較基本信息
    if (v1.title !== v2.title) {
      differences.push({
        field: "title",
        old: v1.title,
        new: v2.title,
      });
    }

    if (v1.description !== v2.description) {
      differences.push({
        field: "description",
        old: v1.description,
        new: v2.description,
      });
    }

    if (v1.content !== v2.content) {
      differences.push({
        field: "content",
        old: v1.content,
        new: v2.content,
      });
    }

    return differences;
  }
}

// 導出模組
export default VersionManager;
