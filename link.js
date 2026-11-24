/* vita 연결: 학생 홈에서 항목을 눌러 연 활동 앱이 끝나면, 로그인한 그 학생의 홈 목록에 완료를 바로 기록한다.
   홈이 붙여 준 표시(vd, vi)가 주소에 있을 때만 동작한다. 표시가 없으면 아무것도 하지 않는다.
   앱 쪽에서는 이 스크립트 한 줄(data-app 포함)만 board/link.js 앞에 두면 된다. 기존 BoardLink.score 호출을 그대로 받는다. */
(function(){try{
  var W=window,D=document;if(W.__vl)return;W.__vl=1;
  var cs=D.currentScript,APP=(cs&&cs.getAttribute('data-app'))||'';if(!APP)return;
  var ss;try{ss=W.sessionStorage;ss.getItem('x')}catch(e){return}
  var q=new URLSearchParams(location.search),vd=q.get('vd'),vi=q.get('vi');
  if(vd!==null&&vi!==null&&/^(reg|fri|mkp)$/.test(vd)&&/^\d{1,2}$/.test(vi)){
    try{ss.setItem('vita-mk',JSON.stringify({k:vd,i:+vi,a:APP}))}catch(e){}
    try{q.delete('vd');q.delete('vi');var qs=q.toString();history.replaceState(null,'',location.pathname+(qs?'?'+qs:'')+location.hash)}catch(e){}
  }
  var mk=null;try{mk=JSON.parse(ss.getItem('vita-mk')||'null')}catch(e){}
  if(!mk||mk.a!==APP)return;
  var CFG={apiKey:'AIzaSyC88G-OjMJOqVqnIVqunzh7fvk91wtKKnA',authDomain:'h-roadmap.firebaseapp.com',projectId:'h-roadmap',appId:'1:575520405083:web:b9f40b64cb0ae3d1a9317e'};
  var V='https://www.gstatic.com/firebasejs/10.14.1/',fb=null;
  function init(){
    if(fb)return fb;
    fb=(async function(){
      var A=await import(V+'firebase-app.js'),U=await import(V+'firebase-auth.js'),F=await import(V+'firebase-firestore.js');
      var app=A.initializeApp(CFG,'vita'),auth=U.getAuth(app);
      await auth.authStateReady();
      return {auth:auth,db:F.getFirestore(app),F:F};
    })();
    return fb;
  }
  setTimeout(function(){init().catch(function(){fb=null})},2000);
  function write(n){
    return init().then(function(c){
      var u=c.auth.currentUser;if(!u)return;
      var now=Date.now(),up={t:now};up['done.'+mk.i]=now;
      return c.F.updateDoc(c.F.doc(c.db,'vday',u.uid,'days',mk.k),up);
    }).catch(function(){fb=null;if(n<2)return new Promise(function(r){setTimeout(r,3000)}).then(function(){return write(n+1)})});
  }
  function done(app,o){
    if(app!==APP)return;
    if(o&&o.ok!=null&&!o.ok)return;
    write(0);
  }
  var real=null,shim={score:function(a,o){try{done(a,o)}catch(e){}if(real&&real.score)return real.score(a,o)}};
  Object.defineProperty(W,'BoardLink',{configurable:true,get:function(){return shim},set:function(v){real=v}});
}catch(e){}})();
