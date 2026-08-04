// Configuration for private login credentials
// Tab session auth: Closing tab immediately logs out the user!

export const ALLOWED_USERNAMES = ["yashwanth", "yashta"];
export const DEFAULT_PASSWORD = "041505";

const AUTH_STORAGE_KEY = "birthday_chronicles_auth_session";

export function checkIsAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  // Ensure legacy localStorage sessions are removed so tab-close enforcement works immediately
  localStorage.removeItem(AUTH_STORAGE_KEY);
  
  const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
  return session === "authenticated";
}

export function loginUser(usernameInput: string, passwordInput: string): { success: boolean; message?: string } {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  const isUsernameValid = ALLOWED_USERNAMES.map(u => u.toLowerCase()).includes(cleanUser);
  const isPasswordValid = cleanPass === DEFAULT_PASSWORD;

  if (isUsernameValid && isPasswordValid) {
    // Save ONLY in sessionStorage so closing the tab immediately logs out the user
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.setItem(AUTH_STORAGE_KEY, "authenticated");
    return { success: true };
  }

  return { success: false, message: "Invalid username or password. Please try again." };
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
