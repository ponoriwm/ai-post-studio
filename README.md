# AI Post Studio

AIニュース収集＆SNS投稿生成アプリ

## 概要

Claude / Anthropic API 前提だった実装を、OpenAI Responses API 版に移行しました。

- ニュース検索：OpenAI Responses API + `web_search_preview`
- 投稿生成：OpenAI Responses API
- APIキー保護：Vercel Serverless Function `/api/openai` で中継
- フロント側：OpenAI APIキー入力UIに変更

## セットアップ

```bash
npm install
npm run dev
```

ローカルでフロントだけ確認する場合は `npm run dev` を使います。`/api/openai` も含めて確認する場合は、Vercel CLI の `vercel dev` を使うと本番に近い形で動作確認できます。

画面上部のAPIキー設定欄に OpenAI APIキーを入力してください。

## デプロイ（Vercel）

1. このリポジトリをGitHubにプッシュ
2. vercel.com でGitHubと連携
3. リポジトリを選択してデプロイ
4. Vercelの Environment Variables に `OPENAI_API_KEY` を設定

Vercel は Vite 構成を自動検出します。

- Build Command: `npm run build`
- Output Directory: `dist`
- Serverless Function: `api/openai.js`

> 画面から入力したAPIキーも利用できますが、本番運用では Vercel 側の `OPENAI_API_KEY` 管理を推奨します。

## 使い方

1. OpenAI APIキーを設定
2. カテゴリを選んでニュースを検索
3. 記事を選んでキャラクターでコメント生成
4. 承認してキューに追加
5. コピーしてXに投稿

## 主なファイル

- `src/App.jsx`：Reactフロントエンド本体
- `src/main.jsx`：Vite用のReactエントリポイント
- `api/openai.js`：OpenAI Responses APIへの中継エンドポイント

## モデル設定

`src/App.jsx` 内で以下を設定しています。

```js
const MODEL_SEARCH = "gpt-4.1-mini";
const MODEL_GEN = "gpt-4.1";
```

コストをさらに抑える場合は、投稿生成側も mini 系モデルに変更してください。
