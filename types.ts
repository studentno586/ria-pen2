export enum StudentPersona {
  BARELY_PASSING = 'BARELY_PASSING',
  HONORS_STUDENT = 'HONORS_STUDENT',
  CRITICAL_THINKER = 'CRITICAL_THINKER',
  ENTHUSIASTIC_FRESHMAN = 'ENTHUSIASTIC_FRESHMAN',
  IWASHITA = 'IWASHITA',
}

export interface PaperSettings {
  character: StudentPersona;
  customCharacterDescription?: string;
  length: string; // e.g., "300-400"
  tone: string; // e.g., "丁寧語（です・ます）"
}

export interface GenerationRequest {
  file: File | null;
  sourceText: string;
  notes: string;
  settings: PaperSettings;
  modelId: string;
}

export interface GenerationResponse {
  text: string;
}