// HTTP Client
export { httpClient, HttpClient, ApiError } from './httpClient';

// API Services
export { agentApi } from './agentApi';
export { authApi } from './authApi';
export { diagnosticsApi } from './diagnosticsApi';
export { historyApi } from './historyApi';
export { machinesApi } from './machinesApi';
export { notificationsApi } from './notificationsApi';
export { sensorsApi } from './sensorsApi';
export { usersApi } from './usersApi';

// Re-export types for convenience
export type {
  // Agent types
  ChatMessage,
  Conversation,
  SendMessagePayload,
  SendMessageResponse,
  ConversationsResponse,
  ConversationMessagesResponse,
  DeleteConversationResponse,
} from './agentApi';

export type {
  // Auth types
  LoginPayload,
  LoginResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  LogoutPayload,
  LogoutResponse,
} from './authApi';

export type {
  // Diagnostics types
  FailurePrediction,
  FailureTypeProbabilities,
  FeatureContributions,
  Diagnostic,
  PostDiagnosticResponse,
  LatestDiagnosticResponse,
  DiagnosticHistoryResponse,
  BulkDiagnosticResult,
  BulkDiagnosticsResponse,
} from './diagnosticsApi';

export type {
  // Machines types
  Machine,
  MachinesResponse,
  MachineResponse,
  CreateMachinePayload,
  CreateMachineResponse,
} from './machinesApi';

export type {
  // Sensors types
  SensorData,
  PostSensorDataPayload,
  PostSensorDataResponse,
  SensorDataHistoryResponse,
  LatestSensorDataResponse,
} from './sensorsApi';

export type {
  // Users types
  User,
  RegisterUserPayload,
  RegisterUserResponse,
  UserResponse,
} from './usersApi';

export type {
  // History types
  HistoryItem,
  HistoryResponse,
} from './historyApi';

export type {
  // Notifications types
  NotificationItem,
  NotificationsResponse,
} from './notificationsApi';
