import { Toaster } from "sonner";
import { MatrixPage } from "@/apps/matrix/pages/MatrixPage";
import { ContractorsProvider } from "@/apps/matrix/store/contractors-store";

export default function App() {
  return (
    <ContractorsProvider>
      <MatrixPage />
      <Toaster richColors position="top-right" />
    </ContractorsProvider>
  );
}
