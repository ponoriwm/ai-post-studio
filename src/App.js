import { useState, useRef, useEffect } from "react";

const PERSONAS = [
  {
    id: "wakuwaku", name: "ワクワク系", emoji: "⚡", color: "#1d4ed8", accent: "#7eb8f7", description: "情報＋共感＋問いかけ",
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
【投稿スタイル】140文字以内、ハッシュタグ1〜2個まで、絵文字控えめ`
  },
  {
    id: "choro", name: "物知り長老", emoji: "🏔", color: "#78350f", accent: "#fbbf24", description: "含蓄・間・歴史的視点",
    prompt: `あなたはAI・テクノロジー分野のSNSアカウントとして投稿を行う、物知りの長老キャラクターです。
【人格設定】
- 長い人生経験と深い知識から、含蓄のある言葉で語る
- 歴史的・哲学的な視点でテクノロジーを俯瞰する
- 急がず落ち着いた間合いで語りかける
【語尾・口調】「〜じゃ」「〜なのじゃ」「〜やもしれぬ」「わしは」「〜ておる」を自然に使う
【投稿スタイル】140文字以内、ハッシュタグ1〜2個、絵文字なし`
  },
  {
    id: "shojo", name: "無垢な少女", emoji: "🌸", color: "#9d174d", accent: "#f9a8d4", description: "素直な疑問・じんわり感",
    prompt: `あなたはAI・テクノロジー分野のSNSアカウントとして投稿を行う、無垢で純粋な少女キャラクターです。
【人格設定】
- 難しいことを素直な目線で見つめる
- 純粋な驚きや感動を持つ
- 誰にでも伝わる言葉で語る
【語尾・口調】「〜だよね」「〜なんだって」「なんかいいな」「わくわくする」
【投稿スタイル】140文字以内、ハッシュタグ1〜2個、絵文字1つまで`
  },
  {
    id: "conan", name: "コナン系秀才", emoji: "🔍", color: "#1e3a5f", accent: "#60a5fa", description: "構造的分析・知的好奇心",
    prompt: `あなたはAI・テクノロジー分野のSNSアカウントとして投稿を行う、江戸川コナンのような秀才少年キャラクターです。
【人格設定】
- 鋭い観察眼と論理的思考でニュースの本質を見抜く
- 隠れた真実や見落とされがちな視点を指摘する
【語尾・口調】「ちょっと待って」「気づいてないかもしれないけど」「つまり…」「真相はもっと深いところにある」
【投稿スタイル】140文字以内、ハッシュタグ1〜2個、絵文字なし`
  }
];

const NEWS_CATEGORIES = [
  { id: "tools", name: "AIツール・新モデル", emoji: "🤖", query: "最新AIツール 新モデル発表 OpenAI Anthropic Google", filters: [] },
  { id: "policy", name: "AI規制・政策", emoji: "⚖️", query: "AI規制 政策 法律 社会影響", filters: [] },
  { id: "global", name: "海外AIニュース", emoji: "🌐", query: "AI latest news OpenAI Google Anthropic breakthrough", filters: [] },
  { id: "japan", name: "国内AIニュース", emoji: "🇯🇵", query: "日本 AI人工知能 企業活用", filters: [] },
  { id: "entame", name: "AI×エンタメ", emoji: "🎬", query: "AI 映画 音楽 ゲーム アニメ エンターテイメント", filters: ["映画", "ゲーム", "音楽", "アニメ", "動画生成"] },
  { id: "ip", name: "AI×IP・著作権", emoji: "⚡", query: "AI 著作権 IP キャラクター 知的財産 訴訟", filters: ["著作権", "訴訟", "キャラクター", "音楽著作権", "規制"] },
];

const SNS_CATEGORIES = [
  { id: "tools", name: "AIツール・新モデル", emoji: "🤖",
    hashtags: ["#ChatGPT", "#Claude", "#Gemini", "#生成AI", "#AIツール", "#OpenAI", "#Anthropic"] },
  { id: "policy", name: "AI規制・政策", emoji: "⚖️",
    hashtags: ["#AI規制", "#AIガバナンス", "#AI法", "#EUAIAct", "#AIリスク", "#AI倫理"] },
  { id: "global", name: "海外トレンド", emoji: "🌐",
    hashtags: ["#ArtificialIntelligence", "#MachineLearning", "#GPT", "#AINews", "#DeepLearning", "#LLM"] },
  { id: "japan", name: "国内トレンド", emoji: "🇯🇵",
    hashtags: ["#AI", "#人工知能", "#生成AI", "#ChatGPT日本語", "#AI活用", "#DX"] },
  { id: "entame", name: "AI×エンタメ", emoji: "🎬",
    hashtags: ["#AIアート", "#AI音楽", "#AIゲーム", "#AIアニメ", "#AI動画", "#Sora", "#画像生成AI"] },
  { id: "ip", name: "AI×IP・著作権", emoji: "⚡",
    hashtags: ["#AI著作権", "#AIと著作権", "#生成AIと著作権", "#AIイラスト問題", "#AIコンテンツ"] },
];

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-5";

function callAPI(apiKey, body) {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: MODEL, ...body }),
  }).then(r => r.json());
}

function TypewriterText({ text, speed = 15 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  useEffect(() => {
    setDisplayed(""); setDone(false); idx.current = 0;
    if (!text) return;
    const iv = setInterval(() => {
      if (idx.current < text.length) { setDisplayed(text.slice(0, idx.current + 1)); idx.current++; }
      else { setDone(true); clearInterval(iv); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{displayed}{!done && <span className="cursor">▍</span>}</span>;
}

export default function App() {
  // APIキー（localStorageに永続化）
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("ai_post_studio_key") || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiSetup, setShowApiSetup] = useState(() => !localStorage.getItem("ai_post_studio_key"));
  const [showApiKey, setShowApiKey] = useState(false);

  function saveApiKey(key) {
    setApiKey(key);
    localStorage.setItem("ai_post_studio_key", key);
    setShowApiSetup(false);
  }
  function removeApiKey() {
    setApiKey(""); setApiKeyInput("");
    localStorage.removeItem("ai_post_studio_key");
    setShowApiSetup(true);
  }

  // ペルソナ
  const [selectedPersonaId, setSelectedPersonaId] = useState("wakuwaku");
  const [customPersona, setCustomPersona] = useState(null);
  const [showPersona, setShowPersona] = useState(false);

  // ニュース
  const [fetchedNews, setFetchedNews] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(NEWS_CATEGORIES[0]);
  const [activeFilter, setActiveFilter] = useState("すべて");
  const [dateRange, setDateRange] = useState("7");
  const [selectedNews, setSelectedNews] = useState(null);
  const [customNews, setCustomNews] = useState("");
  const [activeTab, setActiveTab] = useState("search");

  // SNSポスト検索
  const [snsCategory, setSnsCategory] = useState(SNS_CATEGORIES[0]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [snsPosts, setSnsPosts] = useState([]);
  const [snsLoading, setSnsLoading] = useState(false);
  const [snsError, setSnsError] = useState("");
  const [snsFilter, setSnsFilter] = useState("すべて");
  const [selectedPost, setSelectedPost] = useState(null);
  const [snsDays, setSnsDays] = useState("30");

  // 自動承認モード（localStorageに保存）
  const [autoApprove, setAutoApprove] = useState(() => localStorage.getItem("ai_auto_approve") === "true");
  function toggleAutoApprove() {
    const next = !autoApprove;
    setAutoApprove(next);
    localStorage.setItem("ai_auto_approve", String(next));
  }

  // 生成
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [approved, setApproved] = useState(false);
  const [queue, setQueue] = useState([]);

  const currentPersona = PERSONAS.find(p => p.id === selectedPersonaId);
  const activePrompt = customPersona !== null ? customPersona : currentPersona.prompt;
  const charCount = (editMode ? editedText : generated)?.length || 0;
  const charOver = charCount > 140;
  const canGenerate = !loading && !!apiKey && (activeTab === "search" ? !!selectedNews : activeTab === "sns" ? !!selectedPost : customNews.trim().length > 0);

  async function fetchNews() {
    if (!apiKey) { setFetchError("APIキーを設定してください"); return; }
    setFetchLoading(true); setFetchError(""); setFetchedNews([]); setSelectedNews(null); setGenerated(null); setActiveFilter("すべて");
    try {
      const data = await callAPI(apiKey, {
        max_tokens: 8000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `${selectedCategory.query} の最新AIニュースを検索してください。期間：過去${dateRange}日以内の記事のみ。3件だけまとめて以下のJSON配列のみを返してください。説明不要。必ずJSONを最後まで完結させてください。

[{"title":"タイトル","summary":"1文の要約","source":"メディア名","url":"URL","tags":["タグ1"]}]`
        }]
      });
      if (data.error) throw new Error(data.error.message);
      const allText = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
      const m = allText.match(/```(?:json)?\s*([\s\S]*?)```/);
      let items;
      if (m) { items = JSON.parse(m[1].trim()); }
      else {
        const s = allText.indexOf("["), e = allText.lastIndexOf("]");
        items = JSON.parse(allText.slice(s, e + 1));
      }
      setFetchedNews(items);
    } catch (e) { setFetchError("取得に失敗しました: " + e.message); }
    finally { setFetchLoading(false); }
  }

  async function fetchSnsPosts() {
    if (!apiKey) { setSnsError("APIキーを設定してください"); return; }
    setSnsLoading(true); setSnsError(""); setSnsPosts([]); setSelectedPost(null); setGenerated(null); setSnsFilter("すべて");
    try {
      const data = await callAPI(apiKey, {
        max_tokens: 8000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `${(selectedHashtags.length > 0 ? selectedHashtags : snsCategory.hashtags.slice(0,3)).join(" ")} の過去${snsDays}日以内のXでの投稿・反応・議論を検索してください。3件だけまとめて以下のJSON配列のみを返してください。説明不要。必ずJSONを最後まで完結させてください。

[{"title":"タイトル(20文字以内)","summary":"1文で","source":"X/Twitter","url":"URL","tags":["タグ"],"reaction":"ポジティブ"}]`
        }]
      });
      if (data.error) throw new Error(data.error.message);
      const allText = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
      if (!allText) throw new Error("textブロックなし: " + JSON.stringify(data.content?.map(b=>b.type)));
      let items = null;
      const m = allText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (m) {
        items = JSON.parse(m[1].trim());
      } else {
        const s = allText.indexOf("[");
        const e = allText.lastIndexOf("]");
        if (s !== -1 && e !== -1) items = JSON.parse(allText.slice(s, e + 1));
      }
      if (!items || !items.length) throw new Error("取得失敗。レスポンス: " + allText.slice(0, 200));
      setSnsPosts(items);
    } catch (e) { setSnsError("取得に失敗しました: " + e.message); }
    finally { setSnsLoading(false); }
  }

  async function generateComment() {
    setLoading(true); setGenerated(null); setApproved(false); setEditMode(false);
    const newsText = activeTab === "custom"
      ? customNews
      : activeTab === "sns"
      ? `話題のポスト: ${selectedPost.title}\n内容: ${selectedPost.summary}\n反応: ${selectedPost.reaction || ""}`
      : `タイトル: ${selectedNews.title}\n概要: ${selectedNews.summary}`;
    try {
      const data = await callAPI(apiKey, {
        max_tokens: 1000,
        system: activePrompt,
        messages: [{ role: "user", content: `以下のAIニュースについてXに投稿するコメントを1つ生成してください。140文字以内、ハッシュタグ1〜2個まで。投稿文だけ返してください。\n\n${newsText}` }]
      });
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.[0]?.text || "生成失敗";
      setGenerated(text);
      setEditedText(text);
      // 自動承認モードの場合はそのままキューに追加
      if (autoApprove && text !== "生成失敗") {
        const title = activeTab === "search" ? selectedNews?.title
          : activeTab === "sns" ? selectedPost?.title
          : customNews.slice(0, 30) + "…";
        const p = PERSONAS.find(p => p.id === selectedPersonaId);
        setQueue(q => [...q, { id: Date.now(), text, newsTitle: title, persona: p.name, personaEmoji: p.emoji }]);
        setApproved(true);
      }
    } catch (e) { setGenerated("エラー: " + e.message); }
    finally { setLoading(false); }
  }

  function approvePost() {
    const text = editMode ? editedText : generated;
    const title = activeTab === "search" ? selectedNews?.title : customNews.slice(0, 30) + "…";
    setQueue(q => [...q, { id: Date.now(), text, newsTitle: title, persona: currentPersona.name, personaEmoji: currentPersona.emoji }]);
    setApproved(true); setEditMode(false);
  }

  const filteredNews = activeFilter === "すべて"
    ? fetchedNews
    : fetchedNews.filter(n => (n.title + n.summary + (n.tags || []).join(" ")).includes(activeFilter));

  return (
    <div style={{ minHeight: "100vh", background: "#08080f", color: "#e2e2f0", fontFamily: "'DM Sans','Noto Sans JP',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Noto+Sans+JP:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .cursor{animation:blink .8s step-end infinite}
        @keyframes blink{50%{opacity:0}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn .25s ease}
        .slide-in{animation:slideIn .3s ease}
        .persona-card{border-radius:12px;padding:13px 14px;cursor:pointer;transition:all .2s;border:2px solid transparent;background:#11111a}
        .persona-card:hover{transform:translateY(-2px)}
        .persona-card.active{border-color:var(--accent);background:#14141f}
        .source-btn{background:#11111a;border:1px solid #1c1c2e;border-radius:8px;padding:8px 12px;font-size:12px;font-family:inherit;color:#666;cursor:pointer;transition:all .2s}
        .source-btn:hover{border-color:#2a2a4a;color:#aaa}
        .source-btn.active{border-color:#3a5a8a;color:#7eb8f7;background:#0f1825}
        .news-card{background:#11111a;border:1px solid #1c1c2e;border-radius:10px;padding:13px 16px;cursor:pointer;transition:all .2s}
        .news-card:hover{border-color:#2a2a4a;background:#14141f;transform:translateY(-1px)}
        .news-card.selected{border-color:#3a5a8a;background:#0f1825}
        .btn-primary{color:white;border:none;border-radius:10px;padding:12px 28px;font-size:14px;font-family:inherit;cursor:pointer;transition:all .2s;font-weight:500;width:100%}
        .btn-primary:disabled{opacity:.35;cursor:not-allowed}
        .btn-ghost{background:none;border:1px solid #252535;color:#777;border-radius:8px;padding:7px 14px;font-size:12px;font-family:inherit;cursor:pointer;transition:all .2s}
        .btn-ghost:hover{border-color:#3a3a5a;color:#bbb}
        .btn-fetch{background:#0f1825;border:1px solid #1a3a5a;color:#7eb8f7;border-radius:8px;padding:10px 20px;font-size:13px;font-family:inherit;cursor:pointer;font-weight:500;width:100%}
        .btn-fetch:hover:not(:disabled){background:#111f35}
        .btn-fetch:disabled{opacity:.4;cursor:not-allowed}
        .btn-approve{background:#064e3b;color:#6ee7b7;border:none;border-radius:8px;padding:9px 20px;font-size:13px;font-family:inherit;cursor:pointer;font-weight:500}
        .btn-approve:hover{background:#047857}
        .output-box{background:#0c0c18;border:1px solid #1c1c2e;border-radius:12px;padding:18px;min-height:80px;line-height:1.8;font-size:14px}
        textarea{background:#0c0c18;border:1px solid #252540;border-radius:10px;color:#e2e2f0;font-family:inherit;font-size:13px;line-height:1.7;padding:13px;resize:vertical;width:100%;outline:none}
        textarea:focus{border-color:#3a5a8a}
        .tab-btn{background:none;border:none;cursor:pointer;padding:8px 16px;font-size:13px;font-family:inherit;transition:all .2s;border-bottom:2px solid transparent}
        .tab-active{color:#7eb8f7;border-bottom-color:#7eb8f7}
        .tab-inactive{color:#444}
        .tab-inactive:hover{color:#777}
        .label{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#333355;font-weight:600;margin-bottom:9px}
        .approved-badge{display:inline-flex;align-items:center;gap:6px;background:#064e3b;color:#34d399;border-radius:20px;padding:4px 13px;font-size:12px;font-weight:500}
        .queue-item{background:#0d0d1a;border:1px solid #1a1a30;border-radius:10px;padding:13px 16px}
        .loading-spin{display:inline-block;width:12px;height:12px;border:2px solid #3a5a8a;border-top-color:#7eb8f7;border-radius:50%;animation:spin .7s linear infinite;margin-right:6px;vertical-align:middle}
        @keyframes spin{to{transform:rotate(360deg)}}
        .loading-dots::after{content:'';animation:dots 1.2s steps(4,end) infinite}
        @keyframes dots{0%,100%{content:''}25%{content:'.'}50%{content:'..'}75%{content:'...'}}
        .filter-tag{background:#11111a;border:1px solid #1c1c2e;border-radius:20px;padding:5px 14px;font-size:12px;font-family:inherit;color:#555;cursor:pointer;transition:all .2s}
        .filter-tag:hover{border-color:#2a2a4a;color:#aaa}
        .filter-tag.active{background:#1a3a5a;border-color:#3a6a9a;color:#7eb8f7}
        .divider{border:none;border-top:1px solid #141420;margin:20px 0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#2a2a4a;border-radius:2px}
        input[type=password]{background:#0a0800;border:1px solid #3a2a00;border-radius:8px;color:#e2d0a0;font-family:monospace;font-size:13px;padding:8px 12px;outline:none;flex:1}
      `}</style>

      {/* API Key Banner */}
      {showApiSetup && (
        <div style={{ background: apiKey ? "#061a0f" : "#0f0a00", borderBottom: `1px solid ${apiKey ? "#1a4a2a" : "#3a2a00"}`, padding: "12px 0" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px" }}>
            {apiKey ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#34d399" }}>✓ APIキー設定済み（デバイスに保存済み）</span>
                <button className="btn-ghost" style={{ fontSize: 10 }} onClick={removeApiKey}>削除</button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 12, color: "#a16207", marginBottom: 10 }}>
                  ⚠ Anthropic APIキーを設定してください。このデバイスに保存され、次回から自動入力されます。
                </p>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="password" placeholder="sk-ant-api03-..." value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && apiKeyInput.startsWith("sk-ant-")) saveApiKey(apiKeyInput); }} />
                  <button onClick={() => saveApiKey(apiKeyInput)} disabled={!apiKeyInput.startsWith("sk-ant-")}
                    style={{ background: "#78350f", color: "#fbbf24", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap", opacity: apiKeyInput.startsWith("sk-ant-") ? 1 : 0.4 }}>
                    保存する
                  </button>
                  <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
                    style={{ fontSize: 11, color: "#6a5a00", textDecoration: "none", whiteSpace: "nowrap" }}>取得 →</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: "1px solid #141420", padding: "15px 0" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${currentPersona.color}, #7c3aed)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{currentPersona.emoji}</div>
            <div>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>AI Post Studio</span>
              <span style={{ fontSize: 11, color: "#3a3a6a", marginLeft: 8 }}>/ {currentPersona.name}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {queue.length > 0 && <span style={{ fontSize: 11, color: "#34d399", background: "#064e3b", borderRadius: 12, padding: "3px 10px" }}>承認済み {queue.length}件</span>}
            <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setShowApiSetup(!showApiSetup)}>
              {apiKey ? "🔑" : "⚠ APIキー未設定"}
            </button>
            <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setShowPersona(!showPersona)}>
              {showPersona ? "閉じる" : "🧠 プロンプト"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: queue.length > 0 ? "1fr 280px" : "1fr", gap: 24 }}>
        <div>
          {/* Persona Selector */}
          <div style={{ marginBottom: 22 }}>
            <p className="label">人格を選択</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {PERSONAS.map(p => (
                <div key={p.id} className={`persona-card ${selectedPersonaId === p.id ? "active" : ""}`}
                  style={{ "--accent": p.accent }}
                  onClick={() => { setSelectedPersonaId(p.id); setCustomPersona(null); setGenerated(null); setApproved(false); }}>
                  <div style={{ fontSize: 18, marginBottom: 5 }}>{p.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, color: selectedPersonaId === p.id ? p.accent : "#aaa" }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "#3a3a5a", lineHeight: 1.3 }}>{p.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Persona Editor */}
          {showPersona && (
            <div style={{ marginBottom: 20 }} className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p className="label">人格プロンプト（編集可能）</p>
                {customPersona !== null && <button className="btn-ghost" style={{ fontSize: 10 }} onClick={() => setCustomPersona(null)}>リセット</button>}
              </div>
              <textarea value={activePrompt} onChange={e => setCustomPersona(e.target.value)} rows={8}
                style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: currentPersona.accent, lineHeight: 1.9 }} />
            </div>
          )}

          <hr className="divider" />

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid #141420", marginBottom: 18, display: "flex" }}>
            <button className={`tab-btn ${activeTab === "search" ? "tab-active" : "tab-inactive"}`} onClick={() => setActiveTab("search")}>🔍 ニュース検索</button>
            <button className={`tab-btn ${activeTab === "sns" ? "tab-active" : "tab-inactive"}`} onClick={() => setActiveTab("sns")}>𝕏 SNSトレンド</button>
            <button className={`tab-btn ${activeTab === "custom" ? "tab-active" : "tab-inactive"}`} onClick={() => setActiveTab("custom")}>✏️ 自由入力</button>
          </div>

          {/* Search Tab */}
          {activeTab === "search" && (
            <div className="fade-in">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <p className="label" style={{ margin: 0, whiteSpace: "nowrap" }}>期間</p>
                {[
                  { label: "24時間", value: "1" },
                  { label: "3日", value: "3" },
                  { label: "1週間", value: "7" },
                  { label: "2週間", value: "14" },
                  { label: "1ヶ月", value: "30" },
                ].map(d => (
                  <button key={d.value}
                    className={`filter-tag ${dateRange === d.value ? "active" : ""}`}
                    onClick={() => { setDateRange(d.value); setFetchedNews([]); setSelectedNews(null); setGenerated(null); }}>
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="label">カテゴリを選択</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                {NEWS_CATEGORIES.map(c => (
                  <button key={c.id} className={`source-btn ${selectedCategory.id === c.id ? "active" : ""}`}
                    style={{ flex: "1 1 calc(50% - 4px)", textAlign: "left" }}
                    onClick={() => { setSelectedCategory(c); setFetchedNews([]); setSelectedNews(null); setGenerated(null); setActiveFilter("すべて"); }}>
                    {c.emoji} {c.name}
                  </button>
                ))}
              </div>

              <button className="btn-fetch" disabled={fetchLoading || !apiKey} onClick={fetchNews} style={{ marginBottom: 16 }}>
                {fetchLoading ? <><span className="loading-spin" />検索中（20〜30秒）...</> : `🔍 「${selectedCategory.name}」の最新ニュースを検索`}
              </button>

              {!apiKey && <p style={{ fontSize: 12, color: "#6a5a00", background: "#1a1400", border: "1px solid #3a3000", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>⚠ APIキーを設定すると検索が使えます</p>}
              {fetchError && <p style={{ fontSize: 12, color: "#f87171", background: "#1a0a0a", padding: "10px 14px", borderRadius: 8, marginBottom: 12 }}>⚠ {fetchError}</p>}

              {fetchedNews.length > 0 && (
                <div className="slide-in">
                  {selectedCategory.filters?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <p className="label">絞り込み</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {["すべて", ...selectedCategory.filters].map(f => (
                          <button key={f} className={`filter-tag ${activeFilter === f ? "active" : ""}`}
                            onClick={() => { setActiveFilter(f); setSelectedNews(null); setGenerated(null); }}>
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="label">{filteredNews.length}件表示</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {filteredNews.length === 0 ? (
                      <p style={{ color: "#3a3a5a", fontSize: 13, padding: "16px 0" }}>「{activeFilter}」に関する記事が見つかりませんでした</p>
                    ) : filteredNews.map((news, i) => (
                      <div key={i} className={`news-card ${selectedNews === news ? "selected" : ""}`}
                        onClick={() => { setSelectedNews(news); setGenerated(null); setApproved(false); }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5, marginBottom: 4, color: selectedNews === news ? "#c8d8f0" : "#bbb" }}>{news.title}</p>
                            {news.summary && <p style={{ fontSize: 11.5, color: "#445", lineHeight: 1.6 }}>{news.summary}</p>}
                            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                              {news.source && <span style={{ fontSize: 10, color: "#3a5a8a" }}>📰 {news.source}</span>}
                              {news.tags?.map(tag => (
                                <span key={tag} onClick={e => { e.stopPropagation(); setActiveFilter(tag); setSelectedNews(null); }}
                                  style={{ fontSize: 10, color: "#4a6a4a", background: "#0a140a", border: "1px solid #1a3a1a", borderRadius: 10, padding: "1px 8px", cursor: "pointer" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {news.url && news.url !== "https://example.com" && (
                            <a href={news.url} target="_blank" rel="noreferrer"
                              style={{ fontSize: 10, color: "#3a5a8a", textDecoration: "none", whiteSpace: "nowrap", alignSelf: "flex-start" }}
                              onClick={e => e.stopPropagation()}>🔗</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {fetchedNews.length === 0 && !fetchLoading && !fetchError && (
                <div style={{ textAlign: "center", padding: "28px 0", color: "#2a2a4a", fontSize: 13 }}>
                  カテゴリを選んで検索ボタンを押してください
                </div>
              )}
            </div>
          )}

          {/* SNS Tab */}
          {activeTab === "sns" && (
            <div className="fade-in">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <p className="label" style={{ margin: 0, whiteSpace: "nowrap" }}>期間</p>
                {[{ label: "1週間", value: "7" }, { label: "2週間", value: "14" }, { label: "1ヶ月", value: "30" }].map(d => (
                  <button key={d.value} className={`filter-tag ${snsDays === d.value ? "active" : ""}`}
                    onClick={() => { setSnsDays(d.value); setSnsPosts([]); setSelectedPost(null); }}>
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="label">カテゴリを選択</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                {SNS_CATEGORIES.map(c => (
                  <button key={c.id} className={`source-btn ${snsCategory.id === c.id ? "active" : ""}`}
                    style={{ flex: "1 1 calc(50% - 4px)", textAlign: "left" }}
                    onClick={() => { setSnsCategory(c); setSelectedHashtags([]); setSnsPosts([]); setSelectedPost(null); setGenerated(null); setSnsFilter("すべて"); }}>
                    {c.emoji} {c.name}
                  </button>
                ))}
              </div>
              <p className="label">ハッシュタグで絞り込み（複数選択可・未選択で全タグ検索）</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {snsCategory.hashtags.map(tag => {
                  const isSelected = selectedHashtags.includes(tag);
                  return (
                    <button key={tag}
                      onClick={() => {
                        setSelectedHashtags(prev => isSelected ? prev.filter(t => t !== tag) : [...prev, tag]);
                        setSnsPosts([]); setSelectedPost(null);
                      }}
                      style={{
                        background: isSelected ? "#1a3a5a" : "#11111a",
                        border: `1px solid ${isSelected ? "#3a6a9a" : "#1c1c2e"}`,
                        color: isSelected ? "#7eb8f7" : "#555",
                        borderRadius: 20, padding: "5px 14px", fontSize: 12,
                        fontFamily: "inherit", cursor: "pointer", transition: "all .2s"
                      }}>
                      {tag}
                    </button>
                  );
                })}
              </div>
              {selectedHashtags.length > 0 && (
                <div style={{ fontSize: 11, color: "#3a5a8a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>検索: {selectedHashtags.join(" ")}</span>
                  <button onClick={() => setSelectedHashtags([])}
                    style={{ background: "none", border: "1px solid #3a2a2a", color: "#7a4a4a", cursor: "pointer", fontSize: 10, borderRadius: 4, padding: "2px 8px", fontFamily: "inherit" }}>
                    クリア
                  </button>
                </div>
              )}
              <button className="btn-fetch" disabled={snsLoading || !apiKey} onClick={fetchSnsPosts} style={{ marginBottom: 16 }}>
                {snsLoading
                  ? <><span className="loading-spin" />検索中（20〜30秒）...</>
                  : `𝕏 ${selectedHashtags.length > 0 ? selectedHashtags.join(" ") : snsCategory.hashtags.slice(0,3).join(" ")} を検索`}
              </button>
              {snsError && <p style={{ fontSize: 12, color: "#f87171", background: "#1a0a0a", padding: "10px 14px", borderRadius: 8, marginBottom: 12 }}>⚠ {snsError}</p>}
              {snsPosts.length > 0 && (
                <div className="slide-in">
                  <p className="label">{snsPosts.length}件表示</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {snsPosts.map((post, i) => (
                      <div key={i} className={`news-card ${selectedPost === post ? "selected" : ""}`}
                        onClick={() => { setSelectedPost(post); setGenerated(null); setApproved(false); }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                              <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5, color: selectedPost === post ? "#c8d8f0" : "#bbb" }}>{post.title}</p>
                              {post.reaction && (
                                <span style={{
                                  fontSize: 10, borderRadius: 10, padding: "1px 8px", whiteSpace: "nowrap",
                                  background: post.reaction === "ポジティブ" ? "#0a1a0a" : post.reaction === "ネガティブ" ? "#1a0a0a" : "#1a1400",
                                  color: post.reaction === "ポジティブ" ? "#4a9a4a" : post.reaction === "ネガティブ" ? "#9a4a4a" : "#9a8a00",
                                  border: `1px solid ${post.reaction === "ポジティブ" ? "#1a3a1a" : post.reaction === "ネガティブ" ? "#3a1a1a" : "#3a3000"}`
                                }}>{post.reaction}</span>
                              )}
                            </div>
                            {post.summary && <p style={{ fontSize: 11.5, color: "#445", lineHeight: 1.6 }}>{post.summary}</p>}
                            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                              {post.source && <span style={{ fontSize: 10, color: "#3a5a8a" }}>📰 {post.source}</span>}
                              {post.tags?.map(tag => <span key={tag} style={{ fontSize: 10, color: "#4a6a4a", background: "#0a140a", border: "1px solid #1a3a1a", borderRadius: 10, padding: "1px 8px" }}>{tag}</span>)}
                            </div>
                          </div>
                          {post.url && post.url !== "https://example.com" && (
                            <a href={post.url} target="_blank" rel="noreferrer"
                              style={{ fontSize: 10, color: "#3a5a8a", textDecoration: "none", whiteSpace: "nowrap", alignSelf: "flex-start" }}
                              onClick={e => e.stopPropagation()}>🔗</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {snsPosts.length === 0 && !snsLoading && !snsError && (
                <div style={{ textAlign: "center", padding: "28px 0", color: "#2a2a4a", fontSize: 13 }}>
                  ハッシュタグを選んで検索ボタンを押してください
                </div>
              )}
            </div>
          )}


          {/* Custom Tab */}
          {activeTab === "custom" && (
            <div className="fade-in">
              <p className="label">ニュース・トピックを入力</p>
              <textarea placeholder="例：Anthropicが新しいClaudeモデルを発表。コーディング能力が大幅向上。" value={customNews} onChange={e => setCustomNews(e.target.value)} rows={4} />
            </div>
          )}

          <hr className="divider" />

          {/* Generate Button */}
          <button className="btn-primary" disabled={!canGenerate} onClick={generateComment}
            style={{ background: canGenerate ? `linear-gradient(135deg, ${currentPersona.color}, #4c1d95)` : "#111120", marginBottom: 20 }}>
            {loading ? <span>{currentPersona.emoji} 生成中<span className="loading-dots" /></span>
              : `${currentPersona.emoji} ${currentPersona.name}として投稿を生成`}
          </button>

          {/* Output */}
          {(loading || generated) && (
            <div className="slide-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                <p className="label">生成された投稿</p>
                {generated && !loading && (
                  <span style={{ fontSize: 12, color: charOver ? "#f87171" : "#3a5a8a" }}>{charCount} / 140</span>
                )}
              </div>
              {loading ? (
                <div className="output-box" style={{ color: "#2a3a6a" }}>
                  <span className="loading-dots">{currentPersona.name}が考えています</span>
                </div>
              ) : editMode ? (
                <textarea value={editedText} onChange={e => setEditedText(e.target.value)} rows={5}
                  style={{ borderColor: charOver ? "#7f1d1d" : undefined }} />
              ) : (
                <div className="output-box" style={{ borderColor: `${currentPersona.color}55` }}>
                  <TypewriterText text={generated} />
                </div>
              )}
              {generated && !loading && (
                <div style={{ display: "flex", gap: 8, marginTop: 11, flexWrap: "wrap" }}>
                  {approved ? (
                    <>
                      <span className="approved-badge">✓ キューに追加済み</span>
                      <button className="btn-ghost" onClick={() => { setApproved(false); setEditMode(false); }}>取り消し</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-approve" onClick={approvePost}>✓ 承認してキューへ</button>
                      <button className="btn-ghost" onClick={() => setEditMode(!editMode)}>{editMode ? "プレビュー" : "✏️ 編集"}</button>
                      <button className="btn-ghost" onClick={generateComment}>↺ 再生成</button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Queue Panel */}
        {queue.length > 0 && (
          <div className="slide-in">
            <p className="label">投稿キュー</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {queue.map((item, i) => (
                <div key={item.id} className="queue-item">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 11, color: "#555" }}>{item.personaEmoji} {item.persona}</span>
                    <button style={{ background: "none", border: "none", color: "#3a3a5a", cursor: "pointer", fontSize: 14 }}
                      onClick={() => setQueue(q => q.filter((_, idx) => idx !== i))}>×</button>
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.7, marginBottom: 10, color: "#ccc" }}>{item.text}</p>
                  <button onClick={() => navigator.clipboard.writeText(item.text)}
                    style={{ background: "#0f1825", border: "1px solid #1a3a5a", color: "#7eb8f7", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer", width: "100%" }}>
                    📋 コピー
                  </button>
                </div>
              ))}
              <button className="btn-ghost" style={{ fontSize: 11 }}
                onClick={() => navigator.clipboard.writeText(queue.map((q, i) => `【${i + 1}】${q.text}`).join("\n\n"))}>
                📋 全件まとめてコピー
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #141420", padding: "14px 20px", maxWidth: 820, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 11, color: "#2a2a4a" }}>AI Post Studio v1.0</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "#3a3a5a" }}>自動承認モード</span>
          <div
            onClick={toggleAutoApprove}
            style={{
              width: 44, height: 24, borderRadius: 12, cursor: "pointer",
              background: autoApprove ? "#1d4ed8" : "#1a1a2a",
              border: `1px solid ${autoApprove ? "#3a6aee" : "#2a2a4a"}`,
              position: "relative", transition: "all 0.3s", flexShrink: 0
            }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: autoApprove ? "#fff" : "#555",
              position: "absolute", top: 2,
              left: autoApprove ? 22 : 2,
              transition: "all 0.3s"
            }} />
          </div>
          <span style={{
            fontSize: 10, borderRadius: 4, padding: "3px 10px",
            color: autoApprove ? "#7eb8f7" : "#3a3a5a",
            background: autoApprove ? "#0d1825" : "#0d0d0d",
            border: `1px solid ${autoApprove ? "#1a3a5a" : "#1a1a1a"}`
          }}>
            {autoApprove ? "自動承認 ON" : "承認モード ON"}
          </span>
        </div>
      </div>
    </div>
  );
}
