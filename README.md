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
npm start
```

ローカル開発では、画面上部のAPIキー設定欄に OpenAI APIキーを入力してください。

## デプロイ（Vercel）

1. このリポジトリをGitHubにプッシュ
2. vercel.com でGitHubと連携
3. リポジトリを選択してデプロイ
4. Vercelの Environment Variables に `OPENAI_API_KEY` を設定

> 画面から入力したAPIキーも利用できますが、本番運用では Vercel 側の `OPENAI_API_KEY` 管理を推奨します。

## 使い方

1. OpenAI APIキーを設定
2. カテゴリを選んでニュースを検索
3. 記事を選んでキャラクターでコメント生成
4. 承認してキューに追加
5. コピーしてXに投稿

## 主なファイル

- `src/App.js`：Reactフロントエンド本体
- `api/openai.js`：OpenAI Responses APIへの中継エンドポイント

## モデル設定

`src/App.js` 内で以下を設定しています。

```js
const MODEL_SEARCH = "gpt-4.1-mini";
const MODEL_GEN = "gpt-4.1";
```

コストをさらに抑える場合は、投稿生成側も mini 系モデルに変更してください。
