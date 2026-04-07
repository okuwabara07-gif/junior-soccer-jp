import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'

export default function Home() {
  const allPosts = getAllPosts()
  const latest = allPosts.slice(0, 6)
  const popular = allPosts.slice(6, 12)
  const genres = Array.from(new Set(allPosts.map((p: any) => p.genre).filter(Boolean))).slice(0, 8)

  return (
    <main className="container">
    {/* ⚽ soccer-tokyo-jp 誘導バナー */}
    <div style={{marginBottom:'2rem',padding:'1.25rem',background:'linear-gradient(135deg,#0a3d62,#1a6ba0)',borderRadius:'16px',border:'2px solid #4CAF50'}}>
      <p style={{color:'rgba(255,255,255,0.7)',fontSize:'11px',margin:'0 0 6px'}}>⚽ 関東のジュニアサッカーチームを探している方へ</p>
      <p style={{color:'white',fontSize:'15px',fontWeight:700,margin:'0 0 8px'}}>関東1,000チーム以上をAIで検索・マッチング</p>
      <p style={{color:'rgba(255,255,255,0.8)',fontSize:'12px',margin:'0 0 12px'}}>東京・神奈川・埼玉・千葉のU-12〜U-15チーム情報・セレクション</p>
      <a href='https://soccer-tokyo-jp.vercel.app' target='_blank' rel='noopener noreferrer'
        style={{display:'inline-block',padding:'10px 20px',background:'#4CAF50',color:'white',borderRadius:'20px',textDecoration:'none',fontSize:'13px',fontWeight:700}}>
        チームを探す →
      </a>
    </div>

      {/* 最新記事 - クローラーが最初に見る場所 */}
      <section className="section">
        <h2 className="section-title">最新記事</h2>
        <div className="post-grid">
          {latest.map((post: any) => (
            <Link key={post.slug} href={'/blog/'+post.slug} className="post-card">
              <div className="post-card-thumb">📄</div>
              <div className="post-card-body">
                <p className="post-card-genre">{post.genre}</p>
                <h3 className="post-card-title">{post.title}</h3>
                <p className="post-card-excerpt">{post.excerpt}</p>
                <p className="post-card-date">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:'1.5rem'}}>
          <Link href="/blog" style={{display:'inline-block',padding:'10px 24px',background:'var(--primary)',color:'white',borderRadius:'20px',textDecoration:'none',fontSize:'0.85rem',fontWeight:700}}>
            記事一覧をすべて見る →
          </Link>
        </div>
      </section>

      {/* カテゴリ別リンク - 内部リンク強化 */}
      {genres.length > 0 && (
        <section className="section">
          <h2 className="section-title">カテゴリから探す</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'10px',marginTop:'1rem'}}>
            {genres.map((genre: any) => (
              <Link key={genre} href={'/blog?genre='+encodeURIComponent(genre)}
                style={{display:'block',padding:'12px',background:'var(--card)',borderRadius:'12px',border:'1px solid var(--secondary)',textDecoration:'none',textAlign:'center',fontSize:'0.8rem',fontWeight:700,color:'var(--text)'}}>
                {genre}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* おすすめ記事 - 別セクションで内部リンク追加 */}
      {popular.length > 0 && (
        <section className="section">
          <h2 className="section-title">おすすめ記事</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {popular.map((post: any) => (
              <Link key={post.slug} href={'/blog/'+post.slug}
                style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',background:'var(--card)',borderRadius:'12px',border:'1px solid var(--secondary)',textDecoration:'none'}}>
                <span style={{fontSize:'0.7rem',padding:'2px 8px',background:'var(--primary)',color:'white',borderRadius:'10px',whiteSpace:'nowrap'}}>{post.genre}</span>
                <span style={{fontSize:'0.85rem',fontWeight:600,color:'var(--text)',flex:1,lineHeight:1.4}}>{post.title}</span>
                <span style={{fontSize:'0.75rem',color:'var(--accent)',flexShrink:0}}>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Beauty Portal Japan リンク */}
      <section className="section">
        <div style={{padding:'1rem',background:'var(--card)',borderRadius:'12px',border:'1px solid var(--secondary)',textAlign:'center'}}>
          <p style={{fontSize:'0.75rem',color:'var(--accent)',marginBottom:'6px'}}>関連サイト</p>
          <a href="https://beauty-portal-jp.vercel.app" target="_blank" rel="noopener noreferrer"
            style={{color:'var(--primary)',textDecoration:'none',fontWeight:700,fontSize:'0.9rem'}}>
            Beauty Portal Japan - 美容総合ポータル
          </a>
        </div>
      </section>

        {/* 漫画・電子書籍 - ValueCommerce */}
        <div style={{margin:'1.5rem 0',padding:'1rem',background:'var(--card)',borderRadius:'12px',border:'1px solid var(--secondary)'}}>
          <p style={{fontSize:'11px',color:'var(--text)',fontWeight:600,marginBottom:'10px',textAlign:'center'}}>マンガをお得に読む</p>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',alignItems:'center'}}>
            {/* Renta! */}
            <a href="https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3767207&pid=892590463"
              target="_blank" rel="nofollow noopener noreferrer sponsored"
              style={{display:'block'}}>
              <img src="https://ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3767207&pid=892590463"
                border="0" alt="Renta!漫画レンタル" style={{display:'block'}}/>
            </a>
            {/* BookLive */}
            <a href="https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3767207&pid=892590475"
              target="_blank" rel="nofollow noopener noreferrer sponsored"
              style={{display:'block'}}>
              <img src="https://ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3767207&pid=892590475"
                border="0" alt="BookLive電子書籍" style={{display:'block'}}/>
            </a>
          </div>
          <p style={{fontSize:'9px',color:'var(--text)',opacity:0.4,textAlign:'center',marginTop:'6px'}}>PR</p>
        </div>
    </main>
  )
}
