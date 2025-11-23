/* Canh giữa layout dọc + ngang */
.login-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
}

/* Card style */
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  background-color: rgba(255,255,255,0.95);
  padding: 32px 24px;
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-icon {
  font-size: 32px;
  color: #1890ff;
}

.login-subtitle {
  color: #666;
  margin-top: 4px;
}

/* Input placeholder màu xám */
.custom-input::placeholder {
  color: #999;
  opacity: 1;
}
