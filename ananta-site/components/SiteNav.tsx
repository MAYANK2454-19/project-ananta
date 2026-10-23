'use client';
import Link from 'next/link';
import { useState } from 'react';
export function SiteNav(){ const [open,setOpen]=useState(false); return <header className="nav"><Link className="wordmark" href="/">ANANTA<span>∞</span></Link><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?'CLOSE':'MENU'} <b>{open?'−':'+'}</b></button><nav className={open?'navlinks open':'navlinks'}><Link href="/about" onClick={()=>setOpen(false)}>THE IDEA</Link><Link href="/journey" onClick={()=>setOpen(false)}>THE JOURNEY</Link><Link href="/rules" onClick={()=>setOpen(false)}>RULES</Link><Link className="nav-cta" href="/register" onClick={()=>setOpen(false)}>ENTER ANANTA <span>↗</span></Link></nav></header> }
