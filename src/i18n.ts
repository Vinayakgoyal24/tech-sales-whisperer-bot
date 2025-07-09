/* ------------------------------------------------------------------ */
/*  i18n.ts – Centralised UI string map (English ↔ Japanese)          */
/* ------------------------------------------------------------------ */
import { LangMode } from "@/contexts/LanguageContext";

export const UI = {
  /* ---------- app / nav ---------- */
  appTitle:            { en: "Sales Agent Bot",                   ja: "セールスエージェントボット" },
  subTitle:            { en: "Computer & Peripherals Expert",     ja: "コンピューター＆周辺機器のプロ" },
  actions:             { en: "Actions",                           ja: "操作" },
  features:            { en: "Features",                          ja: "機能" },
  newChat:             { en: "New Chat",                          ja: "新規チャット" },
  uploadFile:          { en: "Upload File",                       ja: "ファイルをアップロード" },
  chatHistory:         { en: "Chat History",                      ja: "チャット履歴" },

  /* ---------- global header / status ---------- */
  salesAgentTitle:     { en: "Sales Agent",                       ja: "営業エージェント" },
  onlineStatus:        { en: "Online",                            ja: "オンライン" },
  home:                { en: "Home",                              ja: "ホーム" },

  /* ---------- chat history ---------- */
  previousChats:       { en: "Previous Chats",                    ja: "過去のチャット" },
  chatDeleted:         { en: "Chat Deleted",                      ja: "チャットを削除しました" },
  chatDeletedDesc:     { en: "Chat history has been removed.",    ja: "チャット履歴は削除されました。" },

  /* ---------- upload card ---------- */
  uploadCardTitle:     { en: "Upload File for Quotation",         ja: "見積もり用ファイルをアップロード" },
  uploadHint:          { en: "Upload a file with your requirements", ja: "要件を含むファイルをアップロードしてください" },
  chooseFile:          { en: "Choose File",                       ja: "ファイルを選択" },
  uploading:           { en: "Uploading…",                        ja: "アップロード中…" },
  fileTypes:           { en: "PDF, DOC, TXT, XLS supported",      ja: "PDF、DOC、TXT、XLS に対応" },
  fileReady:           { en: "File ready for quotation generation", ja: "見積もり作成の準備ができました" },
  fileUploaded:        { en: "File Uploaded",                     ja: "ファイルをアップロードしました" },  // legacy
  uploadSuccess:       { en: "File Uploaded",                     ja: "ファイルをアップロードしました" },
  uploadSuccessDesc:   { en: "uploaded successfully. Ready for quotation generation.", ja: "が正常にアップロードされました。見積もり作成の準備が整いました。" },
  fileRemoved:         { en: "File Removed",                      ja: "ファイルを削除しました" },
  fileRemovedDesc:     { en: "File has been removed from upload queue.", ja: "アップロードキューからファイルが削除されました。" },
  uploadFail:          { en: "Upload Failed",                     ja: "アップロードに失敗しました" },        // legacy
  uploadFailed:        { en: "Upload Failed",                     ja: "アップロード失敗" },
  uploadFailedDesc:    { en: "Unable to upload file. Please try again.", ja: "ファイルをアップロードできませんでした。もう一度お試しください。" },

  /* ---------- chat input ---------- */
  askPlaceholder:      { en: "Ask about products or request a quotation.", ja: "製品や見積もりについてご質問ください。" },
  invalidEmail:        { en: "Invalid Email",                     ja: "メールアドレスが正しくありません" },
  invalidEmailDesc:    { en: "Please enter a valid email address.", ja: "有効なメールアドレスを入力してください。" },
  invalidPhone:        { en: "Invalid Phone Number",              ja: "電話番号が正しくありません" },
  invalidPhoneDesc:    { en: "Please enter a valid phone number.", ja: "有効な電話番号を入力してください。" },

  /* ---------- connection / system ---------- */
  connectionError:     { en: "Connection Error",                  ja: "接続エラー" },
  connectionErrorDesc: { en: "Unable to connect to the server. Please try again.", ja: "サーバーに接続できません。しばらくしてから再試行してください。" },
  serverBusyMsg:       { en: "I'm sorry, I'm having trouble connecting to the server right now. Please try again in a moment.", ja: "現在サーバーに接続できません。しばらくしてからもう一度お試しください。" },
  welcome:             { en: "Hello! I'm your sales agent for computers and peripherals. I can help you find the perfect products, generate quotations, and answer any questions you have. Can I please know your name?", ja: "こんにちは！私はコンピュータと周辺機器の営業アシスタントです。ご要望に最適な製品を探し、見積もりを作成し、ご質問にお答えします。まずお名前を教えていただけますか？" },

  /* ---------- speech / mic ---------- */
  browserUnsupported:  { en: "Browser unsupported",               ja: "ブラウザがサポートされていません" },
  transcribing:        { en: "Transcribing…",                     ja: "文字起こし中…" },
  pleaseWait:          { en: "Please wait.",                      ja: "お待ちください。" },
  noSpeech:            { en: "😕 No speech detected",             ja: "😕 音声が検出されませんでした" },
  recording:           { en: "Recording…",                        ja: "録音中…" },
  speakNow:            { en: "Speak your query, click again to stop.", ja: "話しかけてください。もう一度クリックで停止します。" },
  micError:            { en: "Microphone error",                  ja: "マイクエラー" },
  muteSpeechAria:      { en: "Mute Speech",                       ja: "音声をミュート" },
  unmuteSpeechAria:    { en: "Unmute Speech",                     ja: "音声をオン" },
  muteSpeechTitle:     { en: "Mute bot speech",                   ja: "ボイス出力をミュート" },
  unmuteSpeechTitle:   { en: "Unmute bot speech",                 ja: "ボイス出力をオン" },

  /* ---------- quotation card / actions ---------- */
  quotationReady:      { en: "Quotation Ready",                   ja: "見積もりの準備ができました" },
  quotationLabel:      { en: "Quotation",                         ja: "見積もり" },
  product:             { en: "Product",                           ja: "製品" },
  specs:               { en: "Specs",                             ja: "スペック" },
  price:               { en: "Price",                             ja: "価格" },
  quantity:            { en: "Quantity",                          ja: "数量" },
  total:               { en: "Total",                             ja: "合計" },
  combinedTotal:       { en: "Combined Total",                    ja: "合計金額" },
  recommendation:      { en: "Recommendation",                    ja: "推薦" },

  enterEmail:          { en: "Enter email address",               ja: "メールアドレスを入力" },

  downloadPDF:         { en: "Download PDF",                      ja: "PDFをダウンロード" },
  downloadPPT:         { en: "Download PPT",                      ja: "PPTをダウンロード" },
  downloading:         { en: "Downloading...",                    ja: "ダウンロード中..." },
  pleaseWaitGenerate:  { en: "Please wait while we generate your quotation", ja: "見積もりファイルを生成中です。しばらくお待ちください" },
  downloaded:          { en: "Downloaded",                        ja: "ダウンロード完了" },
  downloadSuccessDesc: { en: "Quotation has been downloaded successfully.", ja: "見積もりファイルを正常にダウンロードしました。" },
  downloadFailed:      { en: "Download Failed",                   ja: "ダウンロードに失敗しました" },
  downloadFailedDesc:  { en: "Unable to generate. Please try again.", ja: "ファイルを生成できませんでした。再試行してください。" },

  emailRequired:       { en: "Email Required",                    ja: "メールアドレスが必要です" },
  emailRequiredDesc:   { en: "Please enter a valid email address before sending.", ja: "送信前に有効なメールアドレスを入力してください。" },
  sending:             { en: "Sending...",                        ja: "送信中..." },
  sendEmail:           { en: "Send Email",                        ja: "メール送信" },
  emailSent:           { en: "Email Sent",                        ja: "メールを送信しました" },
  emailSentDesc:       { en: "Quotation email has been sent successfully.", ja: "見積もりメールを送信しました。" },
  emailSendFailed:     { en: "Email Sending Failed",              ja: "メール送信失敗" },
  emailSendFailedDesc: { en: "Could not send the email. Please try again.", ja: "メールを送信できませんでした。再試行してください。" },

  /* ---------- legacy / other ---------- */
  genPDF:              { en: "Generating PDF",                    ja: "PDF を生成しています" },
  genPPT:              { en: "Generating PPT",                    ja: "PPT を生成しています" },
  pdfDone:             { en: "PDF Downloaded",                    ja: "PDF をダウンロードしました" },
  pptDone:             { en: "PPT Downloaded",                    ja: "PPT をダウンロードしました" },
  emailNeed:           { en: "Email Required",                    ja: "メールアドレスを入力してください" },
  emailFail:           { en: "Email Sending Failed",              ja: "メール送信に失敗しました" },
} as const;

/* ------------------------------------------------------------------ */
/*  Helper: t("key", mode) → returns string in chosen language        */
/* ------------------------------------------------------------------ */
export const t = (k: keyof typeof UI, lang: LangMode | "en" | "ja") =>
  UI[k][lang === "ja" ? "ja" : "en"];
