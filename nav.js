/* vita 연결: 학생 홈에서 활동을 눌러 들어온 경우에만 "할 일 목록" 고정 버튼을 띄우고, 눌러서 학생 홈으로 돌아간다. 초기화 버튼은 숨긴다. */
(function(){try{
  if(window.__vnav)return;window.__vnav=1;
  try{if(sessionStorage.getItem('vita-in')!=='1')return}catch(e){return}
  var D=document;
  function go(){try{(window.top||window).location.href='/vita/'}catch(e){location.href='/vita/'}}
  function add(){
    if(D.getElementById('vhome'))return;
    var s=D.createElement('style');
    s.textContent='.rst{display:none!important}html{padding-top:calc(46px + env(safe-area-inset-top,0px))!important}#vhome{position:fixed;top:0;left:0;right:0;height:calc(46px + env(safe-area-inset-top,0px));padding:env(safe-area-inset-top,0px) 0 0 16px;box-sizing:border-box;z-index:2147483000;background:#1f2937;color:#fff;font:700 16px/46px sans-serif;text-align:left;text-decoration:none;box-shadow:0 2px 8px rgba(0,0,0,.25)}';
    D.head.appendChild(s);
    var a=D.createElement('a');a.id='vhome';a.href='/vita/';a.textContent='← 오늘의 학습';
    a.addEventListener('click',function(e){e.preventDefault();go()});
    D.body.appendChild(a);
  }
  if(D.body)add();else D.addEventListener('DOMContentLoaded',add);
  D.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a'):null;if(a&&a.id!=='vhome'&&a.textContent.trim()==='홈으로'){e.preventDefault();go()}},true);
function ren(){var l=D.querySelectorAll('a');for(var i=0;i<l.length;i++){if(l[i].id!=='vhome'&&l[i].textContent.trim()==='홈으로')l[i].style.display='none'}}try{new MutationObserver(ren).observe(D.documentElement,{childList:true,subtree:true})}catch(e){}ren();
}catch(e){}})();
