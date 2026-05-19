import { Suspense } from "react";
import FailureClient from "./FailureClient";

export default function FailurePage() {
  return (
    <Suspense fallback={null}>
      <FailureClient />
    </Suspense>
  );
}
