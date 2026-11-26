/* vita 연결: 학생 홈에서 활동을 눌러 들어온 경우에만 위쪽 "← 오늘의 학습" 바를 띄우고, 활동이 끝나면 그 학생의 오늘의 학습 항목에 완료를 기록한다.
   board/link.js 와 이 파일을 불러오는 모든 활동 앱이 함께 쓴다(board/link.js 는 이 파일을 불러오기만 한다). 홈에서 들어오지 않았으면 아무것도 하지 않는다. */
(function(){try{
  if(window.__vnav)return;window.__vnav=1;
  var W=window,D=document,SS;
  try{SS=W.sessionStorage;if(SS.getItem('vita-in')!=='1')return}catch(e){return}
  var at=null;try{at=JSON.parse(SS.getItem('vita-at')||'null')}catch(e){}
  if(at&&!(/^(reg|reg2|fri|mkp)$/.test(at.k)&&typeof at.i==='number'&&at.i>=0&&at.i<100))at=null;
  var CFG={apiKey:'AIzaSyC88G-OjMJOqVqnIVqunzh7fvk91wtKKnA',authDomain:'h-roadmap.firebaseapp.com',projectId:'h-roadmap',appId:'1:575520405083:web:b9f40b64cb0ae3d1a9317e'};
  var V='https://www.gstatic.com/firebasejs/10.14.1/',fb=null,sent=false,auto=false,okd=false;
  function nm(){var n=at&&at.nm?String(at.nm).replace(/\s+/g,' ').trim():'';return n||'이 활동'}
  function jo(w){var c=w.charCodeAt(w.length-1);return (c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28)?'을':(c>=0xAC00&&c<=0xD7A3?'를':'을')}
  function exitTry(){if(!at||at.r||okd||wired())go();else ask()}
  function init(){
    if(fb)return fb;
    fb=(async function(){
      var A=await import(V+'firebase-app.js'),U=await import(V+'firebase-auth.js'),F=await import(V+'firebase-firestore.js');
      var app;try{app=A.getApp('vita')}catch(e){app=A.initializeApp(CFG,'vita')}
      var auth=U.getAuth(app);await auth.authStateReady();
      return {auth:auth,db:F.getFirestore(app),F:F};
    })();
    return fb;
  }
  function write(n){
    return init().then(function(c){
      var u=c.auth.currentUser;if(!u)return false;
      var now=Date.now(),up={t:now},dk=at.k==='reg2'?'reg':at.k;up['done.'+(at.i+(at.k==='reg2'?100:0))]=now;
      return c.F.updateDoc(c.F.doc(c.db,'vday',u.uid,'days',dk),up).then(function(){return true});
    }).catch(function(){fb=null;if(n<2)return new Promise(function(r){setTimeout(r,2500)}).then(function(){return write(n+1)})});
  }
  function mark(){if(sent||!at)return Promise.resolve();sent=true;return write(0)}
  function go(){try{(W.top||W).location.href='/vita/'}catch(e){location.href='/vita/'}}
  function wired(){try{return !!SS.getItem('vita-mk')}catch(e){return false}}
  function ask(){
    if(D.getElementById('vask'))return;
    var o=D.createElement('div');o.id='vask';o.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483646;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:20px';
    var b=D.createElement('div');b.style.cssText='background:#fff;border-radius:16px;padding:24px 20px;max-width:340px;width:100%;text-align:center;font-family:sans-serif';
    var h=D.createElement('div');var an=nm();h.textContent=an+jo(an)+' 마쳤습니다.';h.style.cssText='font:700 19px/1.4 sans-serif;color:#111;margin-bottom:18px';b.appendChild(h);
    function btn(t,bg,fg,fn){var x=D.createElement('button');x.type='button';x.textContent=t;x.style.cssText='display:block;width:100%;margin-top:10px;padding:15px 0;border:0;border-radius:12px;font:700 17px/1 sans-serif;background:'+bg+';color:'+fg;x.onclick=fn;b.appendChild(x)}
    btn('예','#1f2937','#fff',function(){okd=true;Promise.race([mark(),new Promise(function(r){setTimeout(r,2500)})]).then(go,go)});
    btn('아니오','#e5e7eb','#111',function(){o.parentNode.removeChild(o)});
    if(!auto){var z=D.createElement('button');z.type='button';z.textContent='나중에 이어서 하기';z.style.cssText='display:block;width:100%;margin-top:14px;padding:8px 0;border:0;background:none;font:14px/1 sans-serif;color:#777;text-decoration:underline';z.onclick=go;b.appendChild(z)}
    o.onclick=function(e){if(e.target===o)o.parentNode.removeChild(o)};
    o.appendChild(b);D.body.appendChild(o);
  }
  function fin(){
    if(D.getElementById('vfin'))return;
    var o=D.createElement('div');o.id='vfin';o.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483646;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:20px';
    var b=D.createElement('div');b.style.cssText='background:#fff;border-radius:16px;padding:26px 20px;max-width:340px;width:100%;text-align:center;font-family:sans-serif';
    var h=D.createElement('div');h.textContent='틀린 문제를 확인해 보세요';h.style.cssText='font:700 20px/1.4 sans-serif;color:#111;margin-bottom:6px';b.appendChild(h);
    var p=D.createElement('div');p.textContent='';p.style.cssText='font:15px/1.4 sans-serif;color:#555;margin-bottom:18px';b.appendChild(p);
    function btn(t,bg,fg,fn){var x=D.createElement('button');x.type='button';x.textContent=t;x.style.cssText='display:block;width:100%;margin-top:10px;padding:15px 0;border:0;border-radius:12px;font:700 17px/1 sans-serif;background:'+bg+';color:'+fg;x.onclick=fn;b.appendChild(x)}
    btn('오답 보기','#1f2937','#fff',function(){o.parentNode.removeChild(o)});
    o.appendChild(b);D.body.appendChild(o);return p;
  }
  function add(){
    if(D.getElementById('vhome'))return;
    var s=D.createElement('style');
    s.textContent='.rst{display:none!important}html{padding-top:calc(46px + env(safe-area-inset-top,0px))!important}#vhome{position:fixed;top:0;left:0;right:0;height:calc(46px + env(safe-area-inset-top,0px));padding:env(safe-area-inset-top,0px) 0 0 16px;box-sizing:border-box;z-index:2147483000;background:#1f2937;color:#fff;font:700 16px/46px sans-serif;text-align:left;text-decoration:none;box-shadow:0 2px 8px rgba(0,0,0,.25)}';
    D.head.appendChild(s);
    var a=D.createElement('a');a.id='vhome';a.href='/vita/';a.textContent='← 오늘의 학습';
    a.addEventListener('click',function(e){e.preventDefault();exitTry()});
    D.body.appendChild(a);
  }
  if(D.body)add();else D.addEventListener('DOMContentLoaded',add);
  D.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target:null;if(!t)return;var a=t.closest('a');
    if(a&&a.id!=='vhome'&&a.textContent.trim()==='홈으로'){e.preventDefault();exitTry();return}
    var b=t.closest('button');
    if(b&&b.textContent.trim()==='제출'){var n=0,iv=setInterval(function(){n++;if(D.querySelector('#sbar .score')){clearInterval(iv);auto=true;var pp=fin();mark().then(function(ok){if(ok&&pp)pp.textContent='기록이 저장됐어요'})}else if(n>25)clearInterval(iv)},300)}
  },true);
  function ren(){var b=D.querySelectorAll('button');for(var j=0;j<b.length;j++){if(/비우기/.test(b[j].textContent))b[j].style.display='none'}var l=D.querySelectorAll('a');for(var i=0;i<l.length;i++){if(l[i].id!=='vhome'&&l[i].textContent.trim()==='홈으로')l[i].style.display='none'}}
  try{new MutationObserver(ren).observe(D.documentElement,{childList:true,subtree:true})}catch(e){}
  ren();
  setTimeout(function(){if(at)init().catch(function(){fb=null})},2500);
}catch(e){}})();
