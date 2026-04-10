import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ヘアカラーLab',
  description: 'ヘアカラー・白髪染め情報',
  keywords: 'ヘアカラーLab,ヘアカラー・白髪染め情報',
  openGraph: {
    title: 'ヘアカラーLab',
    description: 'ヘアカラー・白髪染め情報',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'ヘアカラーLab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ヘアカラーLab',
    description: 'ヘアカラー・白髪染め情報',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3460729726810386" crossOrigin="anonymous"></script>
        <meta name="google-site-verification" content="8c64b1447c588760" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SVQXY5C3PW"></script>
        <script dangerouslySetInnerHTML={{__html:`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-SVQXY5C3PW');`}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:`{"@context": "https://schema.org", "@type": "WebSite", "name": "ヘアカラーLab", "description": "ヘアカラー・白髪染め情報", "url": "https://junior-soccer-jp.vercel.app", "publisher": {"@type": "Organization", "name": "AOKAE合同会社", "url": "https://colorpass-web.vercel.app"}, "potentialAction": {"@type": "SearchAction", "target": "https://junior-soccer-jp.vercel.app/blog/{search_term_string}", "query-input": "required name=search_term_string"}}`}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
