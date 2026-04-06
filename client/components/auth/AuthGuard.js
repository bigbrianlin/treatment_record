import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import Spinner from "@/components/ui/Spinner/Spinner";

export default function AuthGuard({ children, authConfig }) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (currentUser.mustChangePassword && router.pathname !== "/profile/change-password") {
      router.push("/profile/change-password");
      return;
    }

    if (authConfig?.requireAdmin && currentUser.role !== "admin") {
      router.push("/");
      return;
    }
  }, [isLoading, currentUser, router, authConfig]);

  if (
    isLoading ||
    !currentUser ||
    (currentUser.mustChangePassword && router.pathname !== "/profile/change-password") ||
    (authConfig?.requireAdmin && currentUser.role !== "admin")
  ) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner size="large" />
      </div>
    );
  }

  return <>{children}</>;
}
