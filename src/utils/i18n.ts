import { Lang } from "@/contexts/LanguageContext";

const dict: Record<string, Record<Lang, string>> = {
  /* ——— global actions ——— */
  appTitle: { "en-US": "Sales Agent Bot", "ja-JP": "営業アシスタント" },
  subtitle: { "en-US": "Computer & Peripherals Expert", "ja-JP": "コンピュータ・周辺機器の専門家" },
  newChat:         { "en-US": "New Chat",              "ja-JP": "新しいチャット" },
  actions:         { "en-US": "Actions",               "ja-JP": "操作" },
  features:        { "en-US": "Features",              "ja-JP": "機能" },
  uploadFile:      { "en-US": "Upload File",           "ja-JP": "ファイルをアップロード" },
  chatHistory:     { "en-US": "Chat History",          "ja-JP": "履歴" },

  /* ——— file-upload component ——— */
  uploadFileTitle: { "en-US": "Upload File for Quotation", "ja-JP": "見積もり用ファイルをアップロード" },
  uploadSubtitle:  { "en-US": "Upload a file with your requirements",
                     "ja-JP": "要件を記載したファイルをアップロードしてください" },
  chooseFile:      { "en-US": "Choose File",           "ja-JP": "ファイルを選択" },
  uploading:       { "en-US": "Uploading…",            "ja-JP": "アップロード中…" },
  uploadedToast:   { "en-US": "File Uploaded",         "ja-JP": "ファイルをアップロードしました" },

  /* ——— quotation actions ——— */
  quotationReady:  { "en-US": "Quotation Ready",       "ja-JP": "見積もりの準備完了" },
  downloadPDF:     { "en-US": "Download PDF",          "ja-JP": "PDF をダウンロード" },
  downloadPPT:     { "en-US": "Download PPT",          "ja-JP": "PPT をダウンロード" },
  sendEmail:       { "en-US": "Send Email",            "ja-JP": "メール送信" },

  /* extend as you translate more labels */
};

export function t(key: keyof typeof dict, lang: Lang): string {
  return dict[key]?.[lang] ?? key;
}
