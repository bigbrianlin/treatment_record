import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import Spinner from "@/components/ui/Spinner/Spinner";

export default function AuthGuard({ children }) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // still loading

    if (!currentUser) {
      router.push("/login");
    }
  }, [isLoading, currentUser, router]);

  if (isLoading || !currentUser) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner size="large" />
      </div>
    );
  }

  return <>{children}</>;
}
