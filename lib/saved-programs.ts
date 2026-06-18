import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@educatronic/saved-programs";

export type SavedProgram = {
  name: string;
  code: string;
  updatedAt: string;
};

export class SavedProgramError extends Error {
  constructor(public readonly code: "EMPTY_NAME" | "EMPTY_CODE") {
    super(code);
    this.name = "SavedProgramError";
  }
}

export async function getSavedPrograms(): Promise<SavedProgram[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  const parsed = JSON.parse(raw) as SavedProgram[];

  return parsed.sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export async function saveProgram(
  name: string,
  code: string,
): Promise<SavedProgram> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new SavedProgramError("EMPTY_NAME");
  }

  if (!code.trim()) {
    throw new SavedProgramError("EMPTY_CODE");
  }

  const programs = await getSavedPrograms();
  const withoutCurrent = programs.filter(
    (program) => program.name !== trimmedName,
  );
  const savedProgram: SavedProgram = {
    name: trimmedName,
    code,
    updatedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([savedProgram, ...withoutCurrent]),
  );

  return savedProgram;
}

export async function deleteProgram(name: string): Promise<void> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return;
  }

  const programs = await getSavedPrograms();
  const remaining = programs.filter((program) => program.name !== trimmedName);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}
