import { getCurrentUser } from "@/utils/auth";

export default function authHeader() {
  const user = getCurrentUser();

  if (user && user.token) {
    return { "x-access-token": user.token };
  } else {
    return {};
  }
}
