import AppRouter from "./router/AppRouter";
import { ConversationsProvider } from "./contexts/ConversationsContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";

export default function App() {
  return (
    <SnackbarProvider>
      <ConversationsProvider>
        <AppRouter />
      </ConversationsProvider>
    </SnackbarProvider>
  );
}
