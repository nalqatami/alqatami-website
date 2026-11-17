// Cloudflare Pages: only signed in family can open anything under /private/
// The sign in token is checked with Supabase, and the account must be one Noor invited (or Noor's own).
const SUPA='https://jixvjqenzguqcaacddyc.supabase.co';
const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeHZqcWVuemd1cWNhYWNkZHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5NDU3MjUsImV4cCI6MjExMDUyMTcyNX0.v9B4lXQk54vN_woTPkZTPaxa8sqv-PwTCy_PFk3sgb8';
const OWNER='86a26a9089dcd82a710be65ffced299ddb41a7266b80edc2cfe67ade26ee7ce6';
const ok=new Map();
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const deny=()=>new Response('Family sign in needed',{status:401,headers:{'Cache-Control':'no-store'}});
export async function onRequest(ctx){
  const c=ctx.request.headers.get('Cookie')||'';const m=c.match(/(?:^|;\s*)aq_at=([^;]+)/);const t=m&&m[1];
  if(!t)return deny();
  const now=Date.now();let good=(ok.get(t)||0)>now;
  if(!good){const r=await fetch(SUPA+'/auth/v1/user',{headers:{apikey:ANON,Authorization:'Bearer '+t}});
    if(r.ok){const u=await r.json();good=!!u.invited_at||(await sha((u.email||'').toLowerCase()))===OWNER}
    if(good){ok.set(t,now+5*60000);if(ok.size>500)ok.clear()}}
  if(!good)return deny();
  const res=await ctx.next();const h=new Headers(res.headers);h.set('Cache-Control','private, no-store');h.set('X-Robots-Tag','noindex');
  return new Response(res.body,{status:res.status,headers:h});
}
