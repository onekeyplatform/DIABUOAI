-- CreateIndex
CREATE INDEX "AuthSession_userId_tenantId_idx"
ON "AuthSession"("userId", "tenantId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_tenantId_idx"
ON "RefreshToken"("userId", "tenantId");
