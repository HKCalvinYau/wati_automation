/**
 * 審核流程管理模組
 * 負責處理模板的審核流程
 */
class ApprovalManager {
  constructor() {
    this.approvals = new Map();
    this.init();
  }

  /**
   * 初始化審核管理器
   */
  async init() {
    try {
      await this.loadApprovals();
      console.log("✅ 審核管理器初始化完成");
    } catch (error) {
      console.error("❌ 審核管理器初始化失敗:", error);
    }
  }

  /**
   * 加載審核數據
   */
  async loadApprovals() {
    try {
      const response = await fetch("data/templates/approval-data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      data.approvals.forEach((approval) => {
        this.approvals.set(approval.templateId, approval);
      });
    } catch (error) {
      console.error("加載審核數據失敗:", error);
      throw error;
    }
  }

  /**
   * 創建審核請求
   */
  async createApprovalRequest(templateId, changes) {
    const approvalRequest = {
      templateId,
      requestId: this.generateRequestId(),
      status: "pending",
      timestamp: new Date().toISOString(),
      requester: localStorage.getItem("currentUser") || "unknown",
      changes,
      approvers: [],
      comments: [],
      history: [],
    };

    this.approvals.set(templateId, approvalRequest);
    await this.saveApprovals();

    // 發送通知
    this.notifyApprovers(approvalRequest);

    return approvalRequest;
  }

  /**
   * 生成請求ID
   */
  generateRequestId() {
    return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 添加審核評論
   */
  async addComment(templateId, comment) {
    const approval = this.approvals.get(templateId);
    if (!approval) {
      throw new Error("審核請求不存在");
    }

    const newComment = {
      id: Date.now(),
      author: localStorage.getItem("currentUser") || "unknown",
      content: comment,
      timestamp: new Date().toISOString(),
    };

    approval.comments.push(newComment);
    await this.saveApprovals();

    return newComment;
  }

  /**
   * 更新審核狀態
   */
  async updateApprovalStatus(templateId, status, reason) {
    const approval = this.approvals.get(templateId);
    if (!approval) {
      throw new Error("審核請求不存在");
    }

    const statusUpdate = {
      status,
      timestamp: new Date().toISOString(),
      updater: localStorage.getItem("currentUser") || "unknown",
      reason,
    };

    approval.status = status;
    approval.history.push(statusUpdate);
    await this.saveApprovals();

    // 發送通知
    this.notifyStatusUpdate(approval, statusUpdate);

    return statusUpdate;
  }

  /**
   * 添加審核人
   */
  async addApprover(templateId, approver) {
    const approval = this.approvals.get(templateId);
    if (!approval) {
      throw new Error("審核請求不存在");
    }

    if (!approval.approvers.includes(approver)) {
      approval.approvers.push(approver);
      await this.saveApprovals();

      // 發送通知
      this.notifyNewApprover(approval, approver);
    }
  }

  /**
   * 獲取審核歷史
   */
  getApprovalHistory(templateId) {
    const approval = this.approvals.get(templateId);
    return approval ? approval.history : [];
  }

  /**
   * 保存審核數據
   */
  async saveApprovals() {
    try {
      const approvalsArray = Array.from(this.approvals.values());
      const response = await fetch("data/templates/approval-data.json", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approvals: approvalsArray }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("保存審核數據失敗:", error);
      throw error;
    }
  }

  /**
   * 通知審核人
   */
  notifyApprovers(approval) {
    approval.approvers.forEach((approver) => {
      // 這裡可以集成郵件或其他通知系統
      console.log(
        `發送通知給審核人 ${approver}: 新的審核請求 ${approval.requestId}`
      );
    });
  }

  /**
   * 通知狀態更新
   */
  notifyStatusUpdate(approval, statusUpdate) {
    const notifyUsers = [approval.requester, ...approval.approvers];

    notifyUsers.forEach((user) => {
      console.log(
        `發送通知給 ${user}: 審核請求 ${approval.requestId} 狀態更新為 ${statusUpdate.status}`
      );
    });
  }

  /**
   * 通知新審核人
   */
  notifyNewApprover(approval, approver) {
    console.log(
      `發送通知給 ${approver}: 您已被添加為審核請求 ${approval.requestId} 的審核人`
    );
  }
}

// 全局實例
window.approvalManager = new ApprovalManager();
