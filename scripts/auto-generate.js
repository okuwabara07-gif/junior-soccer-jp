const https = require('https');
const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const AMAZON_TRACKING_ID = process.env.AMAZON_TRACKING_ID || 'haircolorab22-22';
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || '5253b9ed.08f9d938.5253b9ee.e71aefe8';

const SITE_NAME = '関東ジュニアサッカー用品ガイド';
const TOPIC = 'ジュニアサッカー・子供サッカー用品';
const SOCCER_INFO_URL = 'https://soccer-tokyo-jp.vercel.app';

// サッカー用品特化キーワード（多様なパターン）
const KEYWORDS = [
  // ランキング系
  'ジュニアサッカーシューズ おすすめランキング',
  'サッカーボール 小学生 おすすめランキング',
  'ジュニア サッカースパイク おすすめランキング',
  'サッカー 練習着 子供 おすすめランキング',
  'ジュニア ゴールキーパーグローブ おすすめ',
  'サッカー リュック ジュニア おすすめランキング',
  'サッカー ソックス ジュニア おすすめ',
  'ジュニア サッカー プロテクター おすすめ',
  'サッカー ユニフォーム 子供 おすすめ',
  'ジュニア フットサルシューズ おすすめランキング',
  // 選び方・質問系
  'ジュニアサッカーシューズ 選び方 失敗しない',
  'サッカーボール サイズ 学年別 選び方',
  'サッカースパイク 芝 人工芝 違い',
  'ジュニア サッカーシューズ 幅広 どれ',
  'サッカー 練習着 素材 選び方',
  'ゴールキーパーグローブ サイズ 選び方',
  'サッカーリュック 容量 何リットル がいい',
  'ジュニア サッカー 初心者 何を買えば',
  'サッカースパイク 土グラウンド おすすめ',
  'フットサル サッカー シューズ 兼用 できる',
  // 悩み・トラブル系
  'サッカーシューズ すぐ壊れる 対策',
  'ジュニアスパイク 足が痛い 原因',
  'サッカーボール すぐへたる 理由',
  'サッカー練習着 洗濯 臭い 取り方',
  'ゴールキーパーグローブ 雨 滑る 対策',
  // 比較系
  'アディダス ナイキ ジュニアシューズ 比較',
  'ミズノ アシックス サッカーシューズ 比較',
  'モルテン アディダス サッカーボール 比較',
  'プーマ ニューバランス ジュニアスパイク 比較',
  'ヴィクタス ミズノ フットサルシューズ 比較',
  // ハウツー系
  'ジュニアサッカーシューズ 正しいサイズ 測り方',
  'サッカーボール 空気入れ 正しい方法',
  'スパイク 手入れ 長持ち させる方法',
  'サッカー練習 自主練 おすすめグッズ',
  'ジュニア サッカー 体幹トレーニング グッズ',
  // 年代・レベル別
  '幼稚園 サッカー シューズ おすすめ',
  '小学1年生 サッカーボール おすすめ',
  '小学生 高学年 サッカースパイク おすすめ',
  'サッカー 中学生 スパイク おすすめ',
  'サッカー 初心者 子供 セット おすすめ',
  // 価格帯別
  'ジュニアサッカーシューズ 安い おすすめ',
  'サッカースパイク 3000円以下 おすすめ',
  'サッカーボール コスパ最強 おすすめ',
  'ジュニア サッカー用品 まとめ買い お得',
  // 季節・シーン別
  'サッカー 冬 防寒 インナー おすすめ',
  'サッカー 熱中症対策 グッズ おすすめ',
  'サッカー 雨 練習 グッズ おすすめ',
  'サッカー 合宿 持ち物 リスト おすすめ',
  // 親向け
  '少年サッカー 親 応援 グッズ おすすめ',
  'サッカー 送り迎え バッグ おすすめ',
];

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function getArticleType(keyword) {
  if (keyword.includes('選び方') || keyword.includes('どれ') || keyword.includes('違い') || keyword.includes('何を')) return 'question';
  if (keyword.includes('壊れ') || keyword.includes('痛い') || keyword.includes('臭い') || keyword.includes('滑る') || keyword.includes('へたる')) return 'worry';
  if (keyword.includes('方法') || keyword.includes('測り方') || keyword.includes('手入れ') || keyword.includes('トレーニング')) return 'howto';
  if (keyword.includes('比較') || keyword.includes('vs') || keyword.includes('兼用')) return 'comparison';
  return 'ranking';
}

function getTitleByType(keyword, year, type) {
  switch(type) {
    case 'question': return `【${year}年】${keyword}｜現役コーチが本音で解説`;
    case 'worry': return `${keyword}を解決｜原因と正しい対処法【${year}年版】`;
    case 'howto': return `【${year}年最新】${keyword}完全ガイド`;
    case 'comparison': return `【${year}年】${keyword}｜違いを徹底比較`;
    default: return `【${year}年最新】${keyword}TOP5｜現役コーチが厳選`;
  }
}

async function generateArticle(keyword) {
  const year = new Date().getFullYear();
  const articleType = getArticleType(keyword);
  const title = getTitleByType(keyword, year, articleType);
  const amazonLink = `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_TRACKING_ID}`;
  const rakutenLink = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/?f=1&af=${RAKUTEN_AFFILIATE_ID}`;

  const soccerInfoBlock = `
---

## 関東のジュニアサッカーチームを探すなら

お子さんのチーム選びや練習環境のリサーチには、関東ジュニアサッカー情報局が便利です。
東京・神奈川・埼玉・千葉の1,000チーム以上のデータベースから、
GPS検索やAIマッチングでお子さんに合ったチームを探せます。

[→ 関東ジュニアサッカー情報局で近くのチームを探す](${SOCCER_INFO_URL})

---
`;

  const typePrompts = {
    question: `「${keyword}」で悩む保護者・子供に、現役コーチとして本音で答える記事を書いてください。`,
    worry: `「${keyword}」というトラブルを抱える読者に共感しつつ、具体的な解決策と適切な商品を提案する記事を書いてください。`,
    howto: `「${keyword}」について、保護者・子供でもわかる具体的なステップで解説し、必要な用品を自然に紹介してください。`,
    comparison: `「${keyword}」について、実際の違いを明確に比較し、子供の学年・レベル・用途別におすすめを提示してください。`,
    ranking: `「${keyword}」について、実際に使った保護者・コーチ目線でのランキング記事を書いてください。`,
  };

  const prompt = `あなたはジュニアサッカーに詳しい現役コーチ兼レビューライターです。
${typePrompts[articleType]}

サイト名：${SITE_NAME}
読者：小学生・中学生の子を持つ保護者、ジュニアサッカーコーチ

以下のポイントを守ってください：
1. 保護者目線で「子供に安全か」「耐久性はどうか」「コスパは」を重視
2. 各商品に「こんな子には向かない」デメリットも正直に書く
3. 学年・レベル・ポジション別のおすすめを入れる
4. アフィリエイトリンクを自然に3箇所以上挿入
5. 記事の最後に関東ジュニアサッカー情報局への誘導ブロックを必ず入れる

MDX形式で出力：

---
title: "${title}"
date: "${new Date().toISOString().split('T')[0]}"
genre: "サッカー用品"
excerpt: "${keyword}について現役コーチが解説。失敗しない選び方と実際におすすめできる商品を紹介します。"
---

[→ Amazonで${keyword}を探す](${amazonLink})
[→ 楽天で${keyword}を探す](${rakutenLink})

（本文をここに書いてください。2000文字以上）

${soccerInfoBlock}

[→ Amazonで詳細を確認する](${amazonLink})
[→ 楽天市場で最安値を見る](${rakutenLink})

※本記事はアフィリエイト広告を含みます。`;

  const body = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  const res = await request({
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);

  const data = JSON.parse(res.body);
  if (!data.content || !data.content[0]) throw new Error('API error: ' + res.body.slice(0,200));
  return data.content[0].text;
}

async function main() {
  const blogDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

  console.log(`Generating articles for ${SITE_NAME}...`);

  for (const keyword of KEYWORDS.slice(0, 50)) {
    try {
      console.log(`Generating: ${keyword}`);
      const content = await generateArticle(keyword);
      const filename = `${Date.now()}.mdx`;
      fs.writeFileSync(path.join(blogDir, filename), content);
      console.log(`✅ Saved: ${filename}`);
      await new Promise(r => setTimeout(r, 3000));
    } catch (e) {
      console.error(`Error: ${keyword}`, e.message);
    }
  }
  console.log('Done!');
}

main();
