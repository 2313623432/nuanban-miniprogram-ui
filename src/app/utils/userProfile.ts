export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  bio: string;
  avatar: string;
}

const STORAGE_KEY = "nuanban-user-profile";

export const DEFAULT_PROFILE: UserProfile = {
  name: "张大爷",
  age: "65",
  gender: "男",
  bio: "",
  avatar:
    "https://images.unsplash.com/photo-1767779734121-c8b36457d07e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGVsZGVybHklMjBtYW4lMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY4ODI5MDExfDA&ixlib=rb-4.1.0&q=80&w=1080",
};

export function loadUserProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_PROFILE };
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore storage errors
  }
}
