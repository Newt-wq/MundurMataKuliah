import { useSession } from "../context/SessionContext";

export function useCurrentUser() {
  const { currentUser } = useSession();
  return currentUser;
}

export function useRequireAuth(allowedRoles?: Array<"mahasiswa" | "admin">) {
  const { currentUser, isLoading } = useSession();
  
  if (isLoading) {
    return { authorized: false, isLoading: true, user: null };
  }
  
  if (!currentUser) {
    return { authorized: false, isLoading: false, user: null };
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return { authorized: false, isLoading: false, user: currentUser };
  }
  
  return { authorized: true, isLoading: false, user: currentUser };
}
