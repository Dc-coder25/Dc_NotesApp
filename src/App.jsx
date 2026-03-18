import { NotesProvider } from "./store/notesStore";
import Layout from "./components/layout/Layout";

export default function App() {
  return (
    <NotesProvider>
      <Layout />
    </NotesProvider>
  );
}