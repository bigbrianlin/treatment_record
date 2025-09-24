import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
}
