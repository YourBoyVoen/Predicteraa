import AppRouter from "./router/AppRouter";
import { ConversationsProvider } from "./contexts/ConversationsContext";

export default function App() {
  return (
    <ConversationsProvider>
      <AppRouter />
    </ConversationsProvider>
  );
}
