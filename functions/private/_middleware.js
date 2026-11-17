// Cloudflare Pages: only signed in family can open anything under /private/
// The sign in token is checked with Supabase. Sign ups are off, so a valid token means an invited family member.
const SUPA='https://jixvjqenzguqcaacddyc.supabase.co';
const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeHZqcWVuemd1cWNhYWNkZHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5NDU3MjUsImV4cCI6MjExMDUyMTcyNX0.v9B4lXQk54vN_woTPkZTPaxa8sqv-PwTCy_PFk3sgb8';
const ok=new Map();
export async function onRequest(ctx){
  const c=ctx.request.headers.get('Cookie')||'';const m=c.match(/(?:^|;\s*)aq_at=([^;]+)/);const t=m&&m[1];
  if(!t)return new Response('Family sign in needed',{status:401});
  const now=Date.now();let good=(ok.get(t)||0)>now;
  if(!good){const r=await fetch(SUPA+'/auth/v1/user',{headers:{apikey:ANON,Authorization:'Bearer '+t}});good=r.ok;if(good){ok.set(t,now+5*60000);if(ok.size>500)ok.clear()}}
  if(!good)return new Response('Family sign in needed',{status:401});
  const res=await ctx.next();const h=new Headers(res.headers);h.set('Cache-Control','private, no-store');h.set('X-Robots-Tag','noindex');
  return new Response(res.body,{status:res.status,headers:h});
}
