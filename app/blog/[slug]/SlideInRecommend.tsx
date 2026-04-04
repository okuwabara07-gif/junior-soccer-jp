'use client'
import { useEffect, useState } from 'react'

type Props = { nextSlug: string; nextTitle: string; nextExcerpt: string }

export default function SlideInRecommend({ nextSlug, nextTitle, nextExcerpt }: Props) {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (scrolled / total > 0.8 && !dismissed) setShow(true)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  if (!nextSlug || !show || dismissed) return null

  return (
    <div style={{position:'fixed',bottom:'20px',right:'20px',width:'280px',background:'white',borderRadius:'16px',padding:'16px',boxShadow:'0 8px 32px rgba(147,51,234,0.2)',border:'2px solid #e8d4ff',zIndex:1000,animation:'slideIn 0.4s ease'}}>
      <style>{`@keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }`}</style>
      <button onClick={() => { setShow(false); setDismissed(true) }} style={{position:'absolute',top:'8px',right:'12px',background:'none',border:'none',cursor:'pointer',fontSize:'16px',color:'#999'}}>✕</button>
      <p style={{fontSize:'0.65rem',color:'#9333ea',fontWeight:700,marginBottom:'8px'}}>次のおすすめ記事</p>
      <a href={'/blog/'+nextSlug} style={{textDecoration:'none'}}>
        <div style={{fontSize:'0.85rem',fontWeight:700,color:'#333',marginBottom:'4px',lineHeight:1.4}}>{nextTitle}</div>
        <div style={{fontSize:'0.7rem',color:'#888',marginBottom:'12px'}}>{nextExcerpt}</div>
        <div style={{background:'#9333ea',color:'white',padding:'8px 16px',borderRadius:'8px',fontSize:'0.75rem',fontWeight:700,textAlign:'center'}}>続きを読む →</div>
      </a>
    </div>
  )
}