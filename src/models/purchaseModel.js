class Purchase {
  constructor(id, userId, sessionId, totalCost, createdAt) {
      this.id = id;
      this.userId = userId;
      this.sessionId = sessionId;
      this.totalCost = totalCost;
      this.createdAt = createdAt;
  }
}

module.exports = Purchase;
