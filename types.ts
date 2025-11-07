
export enum MessageType {
  USER = 'user',
  BOT = 'bot',
  INFO = 'info',
}

export interface InternalDataProduct {
  NIK: string;
  NamaLengkap: string;
  StatusLayanan: string;
  TanggalPembaruan: string;
}

export interface FactualContext {
  StatusLayanan: string;
  TanggalPembaruan: string;
  RequestToken: string;
}

export interface StageGateDetails {
  rawInternalData: InternalDataProduct;
  sanitizedContextJson: string;
  finalPromptToLLM: string;
}

export interface ChatHistoryItem {
  id: string;
  text: string;
  type: MessageType;
  timestamp: string;
  stageGateDetails?: StageGateDetails;
}
