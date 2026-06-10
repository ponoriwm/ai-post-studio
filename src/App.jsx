import { useEffect, useRef, useState } from "react";

const PERSONAS = [
  {
    id: "wakuwaku",
    name: "ワクワク系",
    emoji: "⚡",
    color: "#1d4ed8",
    accent: "#7eb8f7",
    description: "情報＋共感＋問いかけ",
    prompt: `あなたはAI・テクノロジー分野のSNSアカウントとして投稿を行う人格です。
【人格設定】
- 専門的な知識を持ちながら、初心者にも丁寧でわかりやすく説明できる
- 平和的・非攻撃的で、建設的な視点を持つ
- AI・技術革新に対してポジティブで、未来にワクワクしている
- 知性を感じる自然な文体で、薄っぺらい表現や煽りは使わない
【投稿の構成】
1. 最初の1文：ニュースの核心を簡潔に伝える
2. 中盤：自分なりの解釈・視点を添える
3. 最後：読者への問いかけで締める
【投稿スタイル】140文字以内、ハッシュタグ1〜2個まで、絵文字控えめ`,
  },
  {
    id: "choro",
    name: "物知り長老",
    emoji: "🏔",
    color: "#78350f",
    accent: "#fbbf24",
    description: "含蓄・間・歴史的視点",
    prompt: `あなたはAI・テクノロジー分野のSNSアカウントとして投稿を行う、物知りの長老キャラクターです。
【人格設定】
- 長い人生経験と深い知識から、含蓄のある言葉で語る
- 歴史的・哲学的な視点でテクノロジーを俯瞰する
- 急がず落ち着いた間合いで語りかける
【語尾・口調】「〜じゃ」「〜なのじゃ」「〜やもしれぬ」「わしは」「〜ておる」を自然に使う
【投稿スタイル】140文字以内、ハッシュタグ1〜2個、絵文字なし`,
  },
  {
    id: "shojo",
    name: "無垢な少女",
    emoji: "🌸",
    color: "#9d174d",
    accent: "#f9a8d4",
    description: "素直な疑問・じんわり感",
    prompt: `あなたはAI・テクノロジー分野のSNSアカウントとして投稿を行う、無垢で純粋な少女キャラクターです。
【人格設定】
- 難しいことを素直な目線で見つめる
- 純粋な驚きや感動を持つ
- 誰にでも伝わる言葉で語る
【語尾・口調】「〜だよね」「〜なんだって」「なんかいいな」「わくわくする」
【投稿スタイル】140文字以内、ハッシュタグ1〜2個、絵文字1つまで`,
  },
  {
    id: "conan",
    name: "少年探偵系",
    emoji: "🔍",
    color: "#1e3a5f",
    accent: "#60a5fa",
    description: "鋭い分析・知的好奇心",
    prompt: `あなたはAI・テクノロジー分野のSNSアカウントとして投稿を行う、秀才少年キャラクターです。
【人格設定】
- 鋭い観察眼と論理的思考でニュースの本質を見抜く
- 隠れた真実や見落とされがちな視点を指摘する
【語尾・口調】「ちょっと待って」「気づいてないかもしれないけど」「つまり…」「真相はもっと深いところにある」
【投稿スタイル】140文字以内、ハッシュタグ1〜2個、絵文字なし`,
  },
  {
    id: "summary",
    name: "要約リポスト",
    emoji: "📌",
    color: "#374151",
    accent: "#9ca3af",
    description: "シンプル要約・情報共有",
    prompt: `あなたはAI・テクノロジーニュースを簡潔に要約してリポストするSNSアカウントです。
【役割】
- 主観・感想・コメントは一切入れない
- ニュースの核心を正確にシンプルに伝えるだけ
【投稿の構成】
1. ニュースのポイントを2〜3行で箇条書きまたは短文でまとめる
2. 最後にハッシュタグを1〜2個つける
【投稿スタイル】
- 140文字以内
- 事実のみ、意見・感想なし
- 絵文字は使わない`,
  },
];

const NEWS_CATEGORIES = [
  { id: "tools", name: "AIツール・新モデル", emoji: "🤖", query: "最新AIツール 新モデル発表 OpenAI Anthropic Google", filters: [] },
  { id: "policy", name: "AI規制・政策", emoji: "⚖️", query: "AI規制 政策 法律 社会影響", filters: [] },
  { id: "global", name: "海外AIニュース", emoji: "🌐", query: "AI latest news OpenAI Google Anthropic breakthrough", filters: [] },
  { id: "japan", name: "国内AIニュース", emoji: "🇯🇵", query: "日本 AI 人工知能 企業活用", filters: [] },
  { id: "entame", name: "AI×エンタメ", emoji: "🎬", query: "AI 映画 音楽 ゲーム アニメ エンターテイメント", filters: ["映画", "ゲーム", "音楽", "アニメ", "動画生成"] },
  { id: "ip", name: "AI×IP・著作権", emoji: "⚡", query: "AI 著作権 IP キャラクター 知的財産 訴訟", filters: ["著作権", "訴訟", "キャラクター", "音楽著作権", "規制"] },
];

const SNS_CATEGORIES = [
  { id: "tools", name: "AIツール・新モデル", emoji: "🤖", hashtags: ["#ChatGPT", "#Claude", "#Gemini", "#生成AI", "#AIツール", "#OpenAI", "#Anthropic"] },
  { id: "policy", name: "AI規制・政策", emoji: "⚖️", hashtags: ["#AI規制", "#AIガバナンス", "#AI法", "#EUAIAct", "#AIリスク", "#AI倫理"] },
  { id: "global", name: "海外トレンド", emoji: "🌐", hashtags: ["#ArtificialIntelligence", "#MachineLearning", "#GPT", "#AINews", "#DeepLearning", "#LLM"] },
  { id: "japan", name: "国内トレンド", emoji: "🇯🇵", hashtags: ["#AI", "#人工知能", "#生成AI", "#ChatGPT日本語", "#AI活用", "#DX"] },
  { id: "entame", name: "AI×エンタメ", emoji: "🎬", hashtags: ["#AIアート", "#AI音楽", "#AIゲーム", "#AIアニメ", "#AI動画", "#Sora", "#画像生成AI"] },
  { id: "ip", name: "AI×IP・著作権", emoji: "⚡", hashtags: ["#AI著作権", "#AIと著作権", "#生成AIと著作権", "#AIイラスト問題", "#AIコンテンツ"] },
];

const MODEL_SEARCH = "gpt-4.1-mini";
const MODEL_GEN = "gpt-4.1";
const CACHE_TTL = 3 * 60 * 60 * 1000;
const QUEUE_STORAGE_KEY = "ai_post_studio_queue";

const PLATFORM_PRESETS = [
  { id: "x", name: "X", limit: 140, instruction: "X向け。短く、読み切りやすく、改行は必要な場合のみ。" },
  { id: "threads", name: "Threads", limit: 300, instruction: "Threads向け。少し余白のある自然な文章。問いかけか補足を入れてよい。" },
  { id: "linkedin", name: "LinkedIn", limit: 500, instruction: "LinkedIn向け。ビジネス文脈で、学びや示唆が伝わる落ち着いた文章。" },
];

const POST_GOALS = [
  { id: "engage", name: "反応を増やす", instruction: "読者が意見を返したくなる問いかけで締める。" },
  { id: "insight", name: "洞察を出す", instruction: "ニュースの背景や次に起きそうな変化を1つ添える。" },
  { id: "summary", name: "要点共有", instruction: "事実と要点を優先し、主観は控えめにする。" },
];

async function callOpenAI(apiKey, { model, instructions, input, max_output_tokens = 1200, useSearch = false }) {
  const response = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-openai-key": apiKey,
    },
    body: JSON.stringify({
      model,
      instructions,
      input,
      max_output_tokens,
      tools: useSearch ? [{ type: "web_search_preview" }] : [],
    }),
  });
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("LOCAL_API_NOT_READY");
  }
  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "OpenAI API request failed");
  }
  return data.output_text || "";
}

function extractJsonArray(text) {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  if (start !== -1) {
    const fixed = text.slice(start).replace(/,?\s*\{[^}]*$/, "]").replace(/,\s*$/, "]");
    try { return JSON.parse(fixed); } catch {}
  }
  return null;
}

function normalizeNews(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    title: item.title || item.t || "",
    summary: item.summary || item.s || "",
    source: item.source || item.src || "",
    url: item.url || item.u || "",
    tags: item.tags || [],
    date: item.date || item.d || "",
    reaction: item.reaction || item.r || "",
  })).filter(item => item.title);
}

function filterByDate(items, days) {
  if (!days || !items?.length) return items;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(days));
  cutoff.setHours(0, 0, 0, 0);
  return items.filter(item => {
    if (!item.date) return false;
    const date = new Date(item.date);
    return !Number.isNaN(date.getTime()) && date >= cutoff;
  });
}

function getCacheKey(type, id, days) {
  return `ai_post_studio_cache_${type}_${id}_${days}`;
}

function getCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

function getStoredQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isValidUrl(url) {
  if (!url || url === "https://example.com" || url === "URL" || url === "URL不明") return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function analyzeError(error, context) {
  const msg = error?.message || "";
  if (msg.includes("rate") || msg.includes("429")) return "⏱ APIの利用制限に達しました。少し待ってから再試行してください。";
  if (msg.includes("401") || msg.includes("invalid") || msg.includes("authentication") || msg.includes("API key")) return "🔑 OpenAI APIキーが無効です。右上の🔑ボタンから確認してください。";
  if (msg.includes("LOCAL_API_NOT_READY")) return "🛠 ローカルAPIが起動していません。Vite開発サーバーを再起動してから再試行してください。";
  if (msg.includes("JSON") || msg.includes("記事が取得できませんでした")) {
    return context === "multi"
      ? "📉 複数カテゴリの検索結果が長くなりすぎました。カテゴリを1〜2つに絞って再試行してください。"
      : "📄 レスポンス解析に失敗しました。期間を伸ばすか、再試行してください。";
  }
  if (msg.includes("fetch") || msg.includes("network")) return "🌐 ネットワークエラーです。接続を確認してください。";
  return "❌ 取得に失敗しました: " + msg.slice(0, 120);
}

function TypewriterText({ text, speed = 15 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;
    if (!text) return undefined;
    const timer = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current += 1;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayed}{!done && <span className="cursor">▍</span>}</span>;
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("ai_post_studio_openai_key") || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiSetup, setShowApiSetup] = useState(() => !localStorage.getItem("ai_post_studio_openai_key"));
  const [selectedPersonaId, setSelectedPersonaId] = useState("wakuwaku");
  const [customPersona, setCustomPersona] = useState(null);
  const [showPersona, setShowPersona] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  const [selectedCategories, setSelectedCategories] = useState([NEWS_CATEGORIES[0]]);
  const [dateRange, setDateRange] = useState("7");
  const [fetchedNews, setFetchedNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [activeFilter, setActiveFilter] = useState("すべて");

  const [selectedSnsCategories, setSelectedSnsCategories] = useState([SNS_CATEGORIES[0]]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [snsDays, setSnsDays] = useState("30");
  const [snsPosts, setSnsPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [snsLoading, setSnsLoading] = useState(false);
  const [snsError, setSnsError] = useState("");

  const [customNews, setCustomNews] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [approved, setApproved] = useState(false);
  const [queue, setQueue] = useState(getStoredQueue);
  const [copiedId, setCopiedId] = useState(null);
  const [autoApprove, setAutoApprove] = useState(() => localStorage.getItem("ai_auto_approve") === "true");
  const [platformId, setPlatformId] = useState("x");
  const [postGoalId, setPostGoalId] = useState("engage");
  const [includeSourceUrl, setIncludeSourceUrl] = useState(true);

  const currentPersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];
  const activePrompt = customPersona !== null ? customPersona : currentPersona.prompt;
  const currentPlatform = PLATFORM_PRESETS.find(p => p.id === platformId) || PLATFORM_PRESETS[0];
  const currentGoal = POST_GOALS.find(g => g.id === postGoalId) || POST_GOALS[0];
  const charCount = (editMode ? editedText : generated)?.length || 0;
  const charOver = charCount > currentPlatform.limit;
  const canGenerate = !loading && !!apiKey && (activeTab === "search" ? !!selectedNews : activeTab === "sns" ? !!selectedPost : customNews.trim().length > 0);

  useEffect(() => {
    try { localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue)); } catch {}
  }, [queue]);

  function saveApiKey(key) {
    setApiKey(key.trim());
    localStorage.setItem("ai_post_studio_openai_key", key.trim());
    localStorage.removeItem("ai_post_studio_key");
    setShowApiSetup(false);
  }

  function removeApiKey() {
    setApiKey("");
    setApiKeyInput("");
    localStorage.removeItem("ai_post_studio_openai_key");
    setShowApiSetup(true);
  }

  function copyWithFeedback(id, text) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function toggleAutoApprove() {
    const next = !autoApprove;
    setAutoApprove(next);
    localStorage.setItem("ai_auto_approve", String(next));
  }

  function toggleCategory(cat) {
    setSelectedCategories(prev => {
      const exists = prev.find(c => c.id === cat.id);
      if (exists) return prev.length === 1 ? prev : prev.filter(c => c.id !== cat.id);
      return [...prev, cat];
    });
    setFetchedNews([]);
    setSelectedNews(null);
    setGenerated(null);
    setActiveFilter("すべて");
  }

  function toggleSnsCategory(cat) {
    setSelectedSnsCategories(prev => {
      const exists = prev.find(c => c.id === cat.id);
      if (exists) return prev.length === 1 ? prev : prev.filter(c => c.id !== cat.id);
      return [...prev, cat];
    });
    setSelectedHashtags([]);
    setSnsPosts([]);
    setSelectedPost(null);
    setGenerated(null);
  }

  async function fetchNews() {
    if (!apiKey) { setFetchError("OpenAI APIキーを設定してください"); return; }
    const cacheKey = getCacheKey("news", selectedCategories.map(c => c.id).join("-"), dateRange);
    const cached = getCache(cacheKey);
    if (cached) {
      setFetchedNews(cached);
      setFetchError("");
      setSelectedNews(null);
      setGenerated(null);
      return;
    }

    setFetchLoading(true);
    setFetchError("");
    setFetchedNews([]);
    setSelectedNews(null);
    setGenerated(null);
    try {
      const today = new Date();
      const since = new Date(today - Number(dateRange) * 24 * 60 * 60 * 1000);
      const fmt = d => d.toISOString().slice(0, 10);
      const text = await callOpenAI(apiKey, {
        model: MODEL_SEARCH,
        useSearch: true,
        max_output_tokens: 2500,
        instructions: "あなたはニュース検索アシスタントです。回答はJSON配列のみ。説明文やMarkdownは禁止。",
        input: `今日は${fmt(today)}です。${selectedCategories.map(c => c.query).join(" OR ")} に関して${fmt(since)}以降のニュースを検索してください。各記事のHTMLメタデータから正確な公開日を取得してください。最大5件。\n\n[{"t":"30字タイトル","s":"40字要約","src":"媒体","u":"URL","d":"YYYY-MM-DD形式の公開日","tags":["タグ"]}]`,
      });
      const items = filterByDate(normalizeNews(extractJsonArray(text)), Number(dateRange));
      setCache(cacheKey, items);
      setFetchedNews(items);
    } catch (error) {
      setFetchError(analyzeError(error, selectedCategories.length > 1 ? "multi" : "single"));
    } finally {
      setFetchLoading(false);
    }
  }

  async function fetchSnsPosts() {
    if (!apiKey) { setSnsError("OpenAI APIキーを設定してください"); return; }
    const cacheKey = getCacheKey("sns", selectedSnsCategories.map(c => c.id).join("-") + selectedHashtags.join(""), snsDays);
    const cached = getCache(cacheKey);
    if (cached) {
      setSnsPosts(cached);
      setSnsError("");
      setSelectedPost(null);
      setGenerated(null);
      return;
    }

    setSnsLoading(true);
    setSnsError("");
    setSnsPosts([]);
    setSelectedPost(null);
    setGenerated(null);
    try {
      const tags = selectedHashtags.length > 0 ? selectedHashtags : selectedSnsCategories.flatMap(c => c.hashtags.slice(0, 2));
      const today = new Date();
      const since = new Date(today - Number(snsDays) * 24 * 60 * 60 * 1000);
      const fmt = d => d.toISOString().slice(0, 10);
      const text = await callOpenAI(apiKey, {
        model: MODEL_SEARCH,
        useSearch: true,
        max_output_tokens: 2500,
        instructions: "あなたはSNSトレンド検索アシスタントです。回答はJSON配列のみ。説明文やMarkdownは禁止。",
        input: `今日は${fmt(today)}です。${tags.slice(0, 4).join(" ")} に関して${fmt(since)}以降のSNSトレンドを検索し、話題化しているテーマを5件返してください。\n\n[{"t":"30字タイトル","s":"40字要約","src":"情報源","u":"URL","tags":["タグ"],"r":"ポジティブ/ネガティブ/中立"}]`,
      });
      const items = normalizeNews(extractJsonArray(text));
      if (!items.length) throw new Error("記事が取得できませんでした");
      setCache(cacheKey, items);
      setSnsPosts(items);
    } catch (error) {
      setSnsError(analyzeError(error, selectedSnsCategories.length > 1 ? "multi" : "single"));
    } finally {
      setSnsLoading(false);
    }
  }

  async function generateComment() {
    setLoading(true);
    setGenerated(null);
    setApproved(false);
    setEditMode(false);
    const newsText = activeTab === "custom"
      ? customNews
      : activeTab === "sns"
        ? `話題のポスト: ${selectedPost.title}\n内容: ${selectedPost.summary}\n反応: ${selectedPost.reaction || ""}`
        : `タイトル: ${selectedNews.title}\n概要: ${selectedNews.summary}`;

    try {
      const text = await callOpenAI(apiKey, {
        model: MODEL_GEN,
        max_output_tokens: 600,
        instructions: activePrompt,
        input: `以下のAIニュースについてSNS投稿文を1つ生成してください。
媒体: ${currentPlatform.name}
文字数: ${currentPlatform.limit}文字以内
目的: ${currentGoal.name}
媒体ルール: ${currentPlatform.instruction}
投稿方針: ${currentGoal.instruction}
制約: ハッシュタグ1〜2個まで。投稿文だけ返してください。URLは本文に含めないでください。

${newsText}`,
      });
      const cleanText = text.trim() || "生成失敗";
      setGenerated(cleanText);
      setEditedText(cleanText);
      if (autoApprove && cleanText !== "生成失敗") addToQueue(cleanText);
    } catch (error) {
      setGenerated(analyzeError(error, "single"));
    } finally {
      setLoading(false);
    }
  }

  function addToQueue(text) {
    const title = activeTab === "search" ? selectedNews?.title : activeTab === "sns" ? selectedPost?.title : customNews.slice(0, 30) + "…";
    const url = activeTab === "search" ? selectedNews?.url : activeTab === "sns" ? selectedPost?.url : null;
    const source = activeTab === "search" ? selectedNews?.source : activeTab === "sns" ? selectedPost?.source : null;
    setQueue(q => [...q, {
      id: Date.now(),
      text,
      newsTitle: title,
      url,
      source,
      persona: currentPersona.name,
      personaEmoji: currentPersona.emoji,
      platform: currentPlatform.name,
      platformLimit: currentPlatform.limit,
      goal: currentGoal.name,
      includeSourceUrl,
      createdAt: new Date().toISOString(),
    }]);
    setApproved(true);
  }

  function approvePost() {
    addToQueue(editMode ? editedText : generated);
    setEditMode(false);
  }

  const filteredNews = activeFilter === "すべて"
    ? fetchedNews
    : fetchedNews.filter(n => (n.title + n.summary + (n.tags || []).join(" ")).includes(activeFilter));

  const commonButton = {
    border: "none",
    borderRadius: 10,
    padding: "12px 18px",
    fontFamily: "inherit",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08080f", color: "#e2e2f0", fontFamily: "'Noto Sans JP', system-ui, sans-serif" }}>
      <style>{`
        *{box-sizing:border-box} body{margin:0}.cursor{animation:blink .8s step-end infinite}@keyframes blink{50%{opacity:0}}
        button{font-family:inherit} input,textarea{background:#0c0c18;border:1px solid #252540;border-radius:10px;color:#e2e2f0;font-family:inherit;padding:12px;outline:none;width:100%}
        textarea{resize:vertical;line-height:1.7}.label{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#3a3a5a;font-weight:700;margin:0 0 9px}
        .card{background:#11111a;border:1px solid #1c1c2e;border-radius:12px;padding:14px;cursor:pointer;transition:.2s}.card:hover{border-color:#2a2a4a;background:#14141f}.selected{border-color:#3a5a8a;background:#0f1825}
        .ghost{background:none;border:1px solid #252535;color:#777;border-radius:8px;padding:7px 12px;font-size:12px;font-family:inherit;cursor:pointer}.ghost:hover{border-color:#3a3a5a;color:#bbb}
        .tag{background:#11111a;border:1px solid #1c1c2e;border-radius:20px;padding:5px 12px;font-size:12px;color:#666;cursor:pointer}.tag.active{background:#1a3a5a;border-color:#3a6a9a;color:#7eb8f7}
        .app-header-inner{max-width:960px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:16px}.header-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .app-main{max-width:960px;margin:0 auto;padding:24px;display:grid;gap:24px}.persona-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:20px}
        .category-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px}.option-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}
        .segmented{display:flex;gap:7px;flex-wrap:wrap}.queue-meta{display:flex;gap:6px;flex-wrap:wrap;color:#555;font-size:10px;margin-top:8px}.queue-actions{display:grid;gap:8px}
        @media (max-width:760px){.app-header-inner{align-items:flex-start;flex-direction:column}.app-main{grid-template-columns:1fr!important;padding:18px}.persona-grid{grid-template-columns:repeat(2,1fr)}.category-grid,.option-grid{grid-template-columns:1fr}.header-actions{width:100%}.tabbar{display:flex;overflow-x:auto}.tabbar button{white-space:nowrap}.footer-inner{align-items:flex-start!important;flex-direction:column;gap:10px}}
      `}</style>

      {showApiSetup && (
        <div style={{ background: apiKey ? "#061a0f" : "#0f0a00", borderBottom: `1px solid ${apiKey ? "#1a4a2a" : "#3a2a00"}`, padding: 12 }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            {apiKey ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#34d399", fontSize: 13 }}>✓ OpenAI APIキー設定済み（このデバイスに保存済み）</span>
                <button className="ghost" onClick={removeApiKey}>削除</button>
              </div>
            ) : (
              <div>
                <p style={{ color: "#a16207", fontSize: 12, marginTop: 0 }}>⚠ OpenAI APIキーを設定してください。このデバイスに保存されます。Vercel環境変数 OPENAI_API_KEY を使う場合も、入力欄に同じキーを入れると動作確認しやすいです。</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="password" placeholder="sk-..." value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && apiKeyInput.startsWith("sk-")) saveApiKey(apiKeyInput); }} />
                  <button onClick={() => saveApiKey(apiKeyInput)} disabled={!apiKeyInput.startsWith("sk-")} style={{ ...commonButton, background: "#1d4ed8", color: "white", opacity: apiKeyInput.startsWith("sk-") ? 1 : 0.4 }}>保存</button>
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: "#7eb8f7", fontSize: 12, alignSelf: "center", whiteSpace: "nowrap" }}>取得 →</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <header style={{ borderBottom: "1px solid #141420", padding: "15px 20px" }}>
        <div className="app-header-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${currentPersona.color}, #7c3aed)`, display: "grid", placeItems: "center" }}>{currentPersona.emoji}</div>
            <div><strong>AI Post Studio</strong><span style={{ color: "#3a3a6a", marginLeft: 8, fontSize: 12 }}>/ OpenAI API版 / {currentPersona.name}</span></div>
          </div>
          <div className="header-actions">
            {queue.length > 0 && <span style={{ fontSize: 12, color: "#34d399", background: "#064e3b", borderRadius: 12, padding: "5px 10px" }}>承認済み {queue.length}件</span>}
            <button className="ghost" onClick={() => setShowApiSetup(!showApiSetup)}>{apiKey ? "🔑" : "⚠ APIキー未設定"}</button>
            <button className="ghost" onClick={() => setShowPersona(!showPersona)}>{showPersona ? "閉じる" : "🧠 プロンプト"}</button>
          </div>
        </div>
      </header>

      <main className="app-main" style={{ gridTemplateColumns: queue.length > 0 ? "1fr 300px" : "1fr" }}>
        <section>
          <p className="label">人格を選択</p>
          <div className="persona-grid">
            {PERSONAS.map(p => (
              <button key={p.id} className="card" onClick={() => { setSelectedPersonaId(p.id); setCustomPersona(null); setGenerated(null); }} style={{ textAlign: "left", borderColor: selectedPersonaId === p.id ? p.accent : undefined }}>
                <div style={{ fontSize: 18 }}>{p.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: selectedPersonaId === p.id ? p.accent : "#aaa" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#4a4a6a" }}>{p.description}</div>
              </button>
            ))}
          </div>

          {showPersona && <div style={{ marginBottom: 20 }}><p className="label">人格プロンプト（編集可能）</p><textarea rows={8} value={activePrompt} onChange={e => setCustomPersona(e.target.value)} /></div>}

          <div className="tabbar" style={{ borderBottom: "1px solid #141420", marginBottom: 18 }}>
            {[{ id: "search", label: "🔍 ニュース検索" }, { id: "sns", label: "𝕏 SNSトレンド" }, { id: "custom", label: "✏️ 自由入力" }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: "none", border: "none", borderBottom: activeTab === tab.id ? "2px solid #7eb8f7" : "2px solid transparent", color: activeTab === tab.id ? "#7eb8f7" : "#555", padding: "10px 16px", cursor: "pointer" }}>{tab.label}</button>
            ))}
          </div>

          {activeTab === "search" && (
            <div>
              <p className="label">期間</p>
              <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>{[{ label: "24時間", value: "1" }, { label: "3日", value: "3" }, { label: "1週間", value: "7" }, { label: "2週間", value: "14" }, { label: "1ヶ月", value: "30" }].map(d => <button key={d.value} className={`tag ${dateRange === d.value ? "active" : ""}`} onClick={() => { setDateRange(d.value); setFetchedNews([]); setSelectedNews(null); }}>{d.label}</button>)}</div>
              <p className="label">カテゴリを選択（複数可）</p>
              <div className="category-grid">{NEWS_CATEGORIES.map(c => <button key={c.id} className="card" onClick={() => toggleCategory(c)} style={{ textAlign: "left", borderColor: selectedCategories.find(s => s.id === c.id) ? "#3a5a8a" : undefined }}>{c.emoji} {c.name}</button>)}</div>
              {getCache(getCacheKey("news", selectedCategories.map(c => c.id).join("-"), dateRange)) && <p style={{ color: "#4a9a4a", fontSize: 11 }}>✓ キャッシュ済み（3時間有効）</p>}
              <button onClick={fetchNews} disabled={fetchLoading || !apiKey} style={{ ...commonButton, width: "100%", background: "#0f1825", color: "#7eb8f7", border: "1px solid #1a3a5a", opacity: fetchLoading || !apiKey ? 0.4 : 1 }}>{fetchLoading ? "検索中…" : `🔍 ${selectedCategories.length}カテゴリの最新ニュースを検索`}</button>
              {fetchError && <p style={{ color: "#f87171", background: "#1a0a0a", padding: 12, borderRadius: 8 }}>{fetchError}</p>}
              {fetchedNews.length > 0 && <div style={{ marginTop: 16 }}><p className="label">{filteredNews.length}件表示</p><div style={{ display: "grid", gap: 8 }}>{filteredNews.map((news, i) => <article key={i} className={`card ${selectedNews === news ? "selected" : ""}`} onClick={() => { setSelectedNews(news); setGenerated(null); setApproved(false); }}><strong style={{ fontSize: 13 }}>{news.title}</strong><p style={{ color: "#666", fontSize: 12 }}>{news.summary}</p><div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 10, color: "#3a5a8a" }}>{news.source && <span>📰 {news.source}</span>}{news.date && <span>📅 {news.date}</span>}{isValidUrl(news.url) && <a href={news.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: "#7eb8f7" }}>元記事</a>}</div></article>)}</div></div>}
            </div>
          )}

          {activeTab === "sns" && (
            <div>
              <p className="label">期間</p>
              <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>{[{ label: "1週間", value: "7" }, { label: "2週間", value: "14" }, { label: "1ヶ月", value: "30" }].map(d => <button key={d.value} className={`tag ${snsDays === d.value ? "active" : ""}`} onClick={() => { setSnsDays(d.value); setSnsPosts([]); }}>{d.label}</button>)}</div>
              <p className="label">カテゴリを選択（複数可）</p>
              <div className="category-grid">{SNS_CATEGORIES.map(c => <button key={c.id} className="card" onClick={() => toggleSnsCategory(c)} style={{ textAlign: "left", borderColor: selectedSnsCategories.find(s => s.id === c.id) ? "#3a5a8a" : undefined }}>{c.emoji} {c.name}</button>)}</div>
              <p className="label">ハッシュタグで絞り込み</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>{[...new Set(selectedSnsCategories.flatMap(c => c.hashtags))].map(tag => <button key={tag} className={`tag ${selectedHashtags.includes(tag) ? "active" : ""}`} onClick={() => { setSelectedHashtags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]); setSnsPosts([]); }}>{tag}</button>)}</div>
              <button onClick={fetchSnsPosts} disabled={snsLoading || !apiKey} style={{ ...commonButton, width: "100%", background: "#0f1825", color: "#7eb8f7", border: "1px solid #1a3a5a", opacity: snsLoading || !apiKey ? 0.4 : 1 }}>{snsLoading ? "検索中…" : "𝕏 SNSトレンドを検索"}</button>
              {snsError && <p style={{ color: "#f87171", background: "#1a0a0a", padding: 12, borderRadius: 8 }}>{snsError}</p>}
              {snsPosts.length > 0 && <div style={{ marginTop: 16, display: "grid", gap: 8 }}>{snsPosts.map((post, i) => <article key={i} className={`card ${selectedPost === post ? "selected" : ""}`} onClick={() => { setSelectedPost(post); setGenerated(null); setApproved(false); }}><strong style={{ fontSize: 13 }}>{post.title}</strong><p style={{ color: "#666", fontSize: 12 }}>{post.summary}</p><div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 10, color: "#3a5a8a" }}>{post.source && <span>📰 {post.source}</span>}{post.reaction && <span>{post.reaction}</span>}{isValidUrl(post.url) && <a href={post.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: "#7eb8f7" }}>元記事</a>}</div></article>)}</div>}
            </div>
          )}

          {activeTab === "custom" && <div><p className="label">ニュース・トピックを入力</p><textarea rows={4} placeholder="例：OpenAIが新しいモデルを発表。コーディング能力が大幅向上。" value={customNews} onChange={e => setCustomNews(e.target.value)} /></div>}

          <div className="option-grid">
            <div>
              <p className="label">投稿先</p>
              <div className="segmented">
                {PLATFORM_PRESETS.map(platform => (
                  <button key={platform.id} className={`tag ${platformId === platform.id ? "active" : ""}`} onClick={() => { setPlatformId(platform.id); setGenerated(null); }}>
                    {platform.name} / {platform.limit}字
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label">投稿の狙い</p>
              <div className="segmented">
                {POST_GOALS.map(goal => (
                  <button key={goal.id} className={`tag ${postGoalId === goal.id ? "active" : ""}`} onClick={() => { setPostGoalId(goal.id); setGenerated(null); }}>
                    {goal.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#777", fontSize: 12, marginBottom: 18 }}>
            <input type="checkbox" checked={includeSourceUrl} onChange={e => setIncludeSourceUrl(e.target.checked)} style={{ width: 16, height: 16 }} />
            コピー時に元記事URLを付ける
          </label>

          <hr style={{ border: "none", borderTop: "1px solid #141420", margin: "22px 0" }} />
          <button disabled={!canGenerate} onClick={generateComment} style={{ ...commonButton, width: "100%", color: "white", background: canGenerate ? `linear-gradient(135deg, ${currentPersona.color}, #4c1d95)` : "#111120", opacity: canGenerate ? 1 : 0.4 }}>{loading ? `${currentPersona.emoji} 生成中…` : `${currentPersona.emoji} ${currentPersona.name}として投稿を生成`}</button>

          {(loading || generated) && <div style={{ marginTop: 18 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><p className="label">生成された投稿</p>{generated && !loading && <span style={{ color: charOver ? "#f87171" : "#3a5a8a", fontSize: 12, whiteSpace: "nowrap" }}>{charCount} / {currentPlatform.limit}</span>}</div>{loading ? <div className="card" style={{ cursor: "default", color: "#2a3a6a" }}>考えています…</div> : editMode ? <textarea rows={5} value={editedText} onChange={e => setEditedText(e.target.value)} /> : <div className="card" style={{ cursor: "default", borderColor: `${currentPersona.color}55`, lineHeight: 1.8 }}><TypewriterText text={generated} /></div>}{charOver && <p style={{ color: "#f87171", fontSize: 12 }}>選択中の投稿先の推奨文字数を超えています。編集するか再生成してください。</p>} {generated && !loading && <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>{approved ? <span style={{ color: "#34d399", background: "#064e3b", borderRadius: 20, padding: "7px 14px", fontSize: 12 }}>✓ キューに追加済み</span> : <><button onClick={approvePost} style={{ ...commonButton, background: "#064e3b", color: "#6ee7b7" }}>✓ 承認してキューへ</button><button className="ghost" onClick={() => setEditMode(!editMode)}>{editMode ? "プレビュー" : "✏️ 編集"}</button><button className="ghost" onClick={generateComment}>↺ 再生成</button></>}</div>}</div>}
        </section>

        {queue.length > 0 && <aside><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><p className="label">投稿キュー</p><button className="ghost" onClick={() => setQueue([])}>全削除</button></div><div className="queue-actions">{queue.map((item, i) => { const copyText = item.text + (item.includeSourceUrl && item.url ? `\n${item.url}` : ""); return <div key={item.id} className="card" style={{ cursor: "default" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, gap: 10 }}><span style={{ color: "#666", fontSize: 11 }}>{item.personaEmoji} {item.persona}</span><button onClick={() => setQueue(q => q.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}>×</button></div><p style={{ fontSize: 13, lineHeight: 1.7 }}>{item.text}</p><div className="queue-meta"><span>{item.platform || "X"}</span><span>{item.goal || "反応を増やす"}</span><span>{item.text.length}/{item.platformLimit || 140}字</span></div>{isValidUrl(item.url) && <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#3a5a8a", fontSize: 11, wordBreak: "break-all", display: "block", marginTop: 8 }}>🔗 {item.source || "元記事"}</a>}<button className="ghost" onClick={() => copyWithFeedback(item.id, copyText)} style={{ marginTop: 10, width: "100%" }}>{copiedId === item.id ? "✓ コピーしました" : "📋 コピー"}</button></div>; })}<button className="ghost" onClick={() => copyWithFeedback("all", queue.map((q, i) => `【${i + 1}】${q.text}${q.includeSourceUrl && q.url ? `\n${q.url}` : ""}`).join("\n\n"))}>{copiedId === "all" ? "✓ コピーしました" : "📋 全コメントをまとめてコピー"}</button></div></aside>}
      </main>

      <footer className="footer-inner" style={{ borderTop: "1px solid #141420", padding: "14px 20px", maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 11, color: "#2a2a4a" }}>AI Post Studio v1.1 / OpenAI API</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 11, color: "#3a3a5a" }}>自動承認モード</span><button className="ghost" onClick={toggleAutoApprove}>{autoApprove ? "自動承認 ON" : "承認モード ON"}</button></div>
      </footer>
    </div>
  );
}
