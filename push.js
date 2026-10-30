import {getApps,getApp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import {getFirestore,doc,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
import {getMessaging,getToken,onMessage,isSupported} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging.js';
import {getFunctions,httpsCallable} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-functions.js';

const C=window.APP_CONFIG||{};
const waitForApp=()=>new Promise((resolve,reject)=>{let tries=0;const timer=setInterval(()=>{if(getApps().length){clearInterval(timer);resolve(getApp())}else if(++tries>200){clearInterval(timer);reject(new Error('Firebase-App nicht initialisiert.'))}},50)});
const toast=text=>{const el=document.querySelector('#toast');if(!el)return alert(text);el.textContent=text;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3500)};
const tokenId=async token=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)))].map(x=>x.toString(16).padStart(2,'0')).join('');

(async()=>{
  const app=await waitForApp(),auth=getAuth(app),db=getFirestore(app),functions=getFunctions(app,C.pushFunctionRegion||'europe-west1');
  let user=null,foregroundBound=false;

  async function enablePush(){
    try{
      if(!user)return toast('Bitte zuerst anmelden.');
      if(!await isSupported())return toast('Push wird auf diesem Gerät nicht unterstützt.');
      if(!C.vapidKey||C.vapidKey.startsWith('HIER_'))return toast('Web-Push-Schlüssel fehlt in config.js.');
      if(await Notification.requestPermission()!=='granted')return toast('Benachrichtigungen wurden nicht erlaubt.');
      const registration=await navigator.serviceWorker.register('./sw.js');
      await navigator.serviceWorker.ready;
      const messaging=getMessaging(app);
      const token=await getToken(messaging,{vapidKey:C.vapidKey,serviceWorkerRegistration:registration});
      if(!token)throw new Error('Kein Push-Token erhalten.');
      await setDoc(doc(db,'users',user.uid,'pushTokens',await tokenId(token)),{token,enabled:true,userAgent:navigator.userAgent,createdAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
      if(!foregroundBound){onMessage(messaging,p=>toast(p.notification?.title||p.data?.title||'Neue Benachrichtigung'));foregroundBound=true}
      localStorage.setItem('trainingsplan.push.enabled','1');
      toast('Push-Benachrichtigungen sind aktiviert.');mount();
    }catch(error){console.error('Push aktivieren:',error);toast('Push konnte nicht aktiviert werden: '+(error.code||error.message||'Unbekannter Fehler'))}
  }

  async function sendPush(){
    const title=document.querySelector('#pushTitle')?.value.trim(),body=document.querySelector('#pushBody')?.value.trim(),button=document.querySelector('#sendPushBtn');
    if(!title||!body)return toast('Bitte Titel und Nachricht eingeben.');
    try{button.disabled=true;button.textContent='Wird gesendet …';const result=await httpsCallable(functions,'sendPush')({title,body,url:'./'});toast(`Push gesendet: ${result.data.successCount} erfolgreich, ${result.data.failureCount} fehlgeschlagen.`);document.querySelector('#pushBody').value=''}
    catch(error){console.error('Push senden:',error);toast('Push-Nachricht konnte nicht gesendet werden.')}
    finally{button.disabled=false;button.textContent='Push an alle senden'}
  }

  function mount(){
    if(!user)return document.querySelector('#pushPanel')?.remove();
    const master=user.uid===C.masterUid,target=master?document.querySelector('#adminView'):document.querySelector('#appView main');
    if(!target)return;
    if(document.querySelector('#pushPanel'))return;
    const enabled=Notification.permission==='granted'&&localStorage.getItem('trainingsplan.push.enabled')==='1';
    const box=document.createElement('section');box.id='pushPanel';box.className=master?'master-section':'master-section';box.style.marginTop='12px';
    box.innerHTML=master?`<div class="master-heading"><h2>Push-Benachrichtigung</h2></div><label>Titel<input id="pushTitle" maxlength="60" value="Trainingsplan"></label><label>Nachricht<textarea id="pushBody" maxlength="240" rows="3" placeholder="Nachricht an alle aktiven Geräte"></textarea></label><button id="sendPushBtn" class="primary">Push an alle senden</button><button id="enablePushBtn">${enabled?'Push auf diesem Gerät aktiviert':'Push auf diesem Gerät aktivieren'}</button>`:`<div class="master-heading"><h2>Benachrichtigungen</h2></div><p>${enabled?'Push ist auf diesem Gerät aktiviert.':'Aktiviere Push, um Nachrichten auch bei geschlossener PWA zu erhalten.'}</p><button id="enablePushBtn" class="primary" ${enabled?'disabled':''}>${enabled?'Push aktiviert':'Push-Benachrichtigungen aktivieren'}</button>`;
    target.prepend(box);
    document.querySelector('#enablePushBtn').onclick=enablePush;
    if(master)document.querySelector('#sendPushBtn').onclick=sendPush;
  }

  new MutationObserver(()=>mount()).observe(document.body,{childList:true,subtree:true});
  onAuthStateChanged(auth,current=>{user=current;setTimeout(mount,100);if(current&&Notification.permission==='granted'&&localStorage.getItem('trainingsplan.push.enabled')==='1')setTimeout(enablePush,300)});
})().catch(error=>console.error('Push-Integration:',error));
