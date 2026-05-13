// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection, addDoc, getDocs, doc,
  updateDoc, query, where, serverTimestamp, setDoc, getDoc
} from 'firebase/firestore';

const ADMIN_EMAIL = "esmanur@ciftcidenал.com";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --g1:#1a3209;--g2:#2d5016;--g3:#4a7c2f;--g4:#7ab648;--g5:#a8d87a;
  --gp:#d4edba;--gm:#f0f7e8;--earth:#8b5e3c;--cream:#faf6ef;
  --td:#1a2e0a;--tm:#4a5e3a;--tl:#8a9e7a;--sh:rgba(45,80,22,0.13);
  --red:#e05252;--orange:#e8952a;--gold:#d4a017;
}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--td);-webkit-font-smoothing:antialiased;}
input,select,button,textarea{font-family:'DM Sans',sans-serif;}
.splash{min-height:100vh;background:linear-gradient(160deg,var(--g1) 0%,var(--g2) 45%,var(--g3) 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;position:relative;overflow:hidden;}
.splash-leaf{font-size:5rem;display:block;text-align:center;margin-bottom:.8rem;animation:sway 5s ease-in-out infinite;}
@keyframes sway{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}
.splash-title{font-family:'Playfair Display',serif;font-size:4rem;font-weight:700;color:#fff;text-align:center;line-height:1.05;margin-bottom:.5rem;}
.splash-title em{font-style:italic;color:#a8d87a;}
.splash-sub{color:#d4edba;font-size:1rem;text-align:center;margin-bottom:3rem;font-weight:300;letter-spacing:.08em;text-transform:uppercase;}
.role-cards{display:flex;gap:1.5rem;flex-wrap:wrap;justify-content:center;}
.role-card{background:rgba(255,255,255,.1);backdrop-filter:blur(16px);border:1.5px solid rgba(255,255,255,.22);border-radius:28px;padding:2.8rem 2.4rem;cursor:pointer;transition:all .35s;text-align:center;color:#fff;min-width:200px;}
.role-card:hover{background:rgba(255,255,255,.2);transform:translateY(-10px);box-shadow:0 28px 56px rgba(0,0,0,.25);}
.role-card .icon{font-size:3.8rem;margin-bottom:1rem;display:block;}
.role-card h3{font-family:'Playfair Display',serif;font-size:1.6rem;margin-bottom:.4rem;}
.role-card p{font-size:.85rem;opacity:.78;font-weight:300;line-height:1.5;}
.admin-link{position:absolute;bottom:1.5rem;right:1.5rem;color:rgba(255,255,255,.4);font-size:.75rem;cursor:pointer;text-decoration:underline;}
.admin-link:hover{color:rgba(255,255,255,.7);}
.auth-wrap{min-height:100vh;background:linear-gradient(150deg,var(--g1),var(--g3));display:flex;align-items:center;justify-content:center;padding:1.5rem;}
.auth-card{background:#fff;border-radius:28px;padding:2.8rem;width:100%;max-width:440px;box-shadow:0 32px 80px rgba(0,0,0,.22);}
.auth-logo{font-family:'Playfair Display',serif;font-size:2rem;color:var(--g2);text-align:center;margin-bottom:.25rem;}
.auth-logo em{font-style:italic;color:var(--g3);}
.auth-sub{text-align:center;color:var(--tl);font-size:.85rem;margin-bottom:2rem;letter-spacing:.03em;}
.auth-tabs{display:flex;background:var(--gm);border-radius:14px;padding:.3rem;margin-bottom:1.6rem;}
.auth-tab{flex:1;padding:.65rem;text-align:center;cursor:pointer;border-radius:11px;font-weight:600;font-size:.88rem;color:var(--tm);border:none;background:none;transition:all .2s;}
.auth-tab.active{background:#fff;color:var(--g2);box-shadow:0 2px 10px var(--sh);}
.field{margin-bottom:1rem;}
.field label{display:block;font-size:.8rem;font-weight:600;color:var(--tm);margin-bottom:.38rem;letter-spacing:.02em;}
.inp{width:100%;padding:.82rem 1rem;border:2px solid var(--gp);border-radius:12px;font-size:.93rem;outline:none;transition:all .2s;background:#fff;color:var(--td);}
.inp:focus{border-color:var(--g3);box-shadow:0 0 0 3px rgba(74,124,47,.1);}
.role-row{display:flex;gap:.65rem;margin-bottom:1rem;}
.role-opt{flex:1;padding:.75rem;border:2px solid var(--gp);border-radius:12px;cursor:pointer;text-align:center;font-weight:600;font-size:.83rem;color:var(--tm);transition:all .2s;}
.role-opt.active{border-color:var(--g3);background:var(--gm);color:var(--g2);}
.auth-btn{width:100%;padding:1rem;background:var(--g3);color:#fff;border:none;border-radius:14px;font-size:1rem;font-weight:600;cursor:pointer;transition:all .2s;margin-top:.5rem;}
.auth-btn:hover{background:var(--g2);}
.auth-btn:disabled{background:#aaa;cursor:not-allowed;}
.auth-back{display:block;text-align:center;margin-top:1rem;color:var(--tl);font-size:.83rem;cursor:pointer;}
.auth-back:hover{color:var(--g3);}
.note-box{background:var(--gm);border:1.5px solid var(--gp);border-radius:10px;padding:.75rem 1rem;font-size:.8rem;color:var(--tm);margin-bottom:1rem;line-height:1.6;}
.err-box{background:#fee;border:1.5px solid var(--red);border-radius:10px;padding:.75rem 1rem;font-size:.82rem;color:var(--red);margin-bottom:1rem;}
.nav{background:var(--g2);color:#fff;padding:.85rem 1.4rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200;box-shadow:0 4px 24px var(--sh);}
.nav-logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;cursor:pointer;}
.nav-logo em{font-style:italic;color:#a8d87a;}
.nav-center{display:flex;align-items:center;gap:.6rem;}
.nbadge{background:var(--g4);color:var(--g2);font-weight:700;font-size:.7rem;padding:.2rem .7rem;border-radius:20px;}
.nav-user{font-size:.82rem;opacity:.82;}
.nav-actions{display:flex;gap:.5rem;align-items:center;}
.nbtn{background:rgba(255,255,255,.14);border:none;color:#fff;padding:.42rem .85rem;border-radius:9px;cursor:pointer;font-size:.83rem;transition:background .2s;position:relative;}
.nbtn:hover{background:rgba(255,255,255,.24);}
.bdg{position:absolute;top:-6px;right:-6px;background:var(--red);color:#fff;font-size:.6rem;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;}
.tabs{display:flex;background:#fff;border-bottom:2px solid var(--gp);overflow-x:auto;scrollbar-width:none;}
.tab{flex:1;min-width:72px;padding:.85rem .4rem;text-align:center;cursor:pointer;font-weight:600;font-size:.78rem;color:var(--tl);border:none;background:none;transition:all .2s;white-space:nowrap;}
.tab.active{color:var(--g3);border-bottom:3px solid var(--g3);margin-bottom:-2px;}
.main{flex:1;padding:1.3rem;max-width:980px;margin:0 auto;width:100%;}
.sh2{margin-bottom:1.2rem;}
.sh2 h2{font-family:'Playfair Display',serif;font-size:1.7rem;color:var(--g2);}
.sh2 p{color:var(--tl);font-size:.85rem;margin-top:.2rem;}
.srow{display:flex;gap:.7rem;margin-bottom:.9rem;flex-wrap:wrap;}
.sinp{flex:1;min-width:180px;padding:.78rem 1rem;border:2px solid var(--gp);border-radius:12px;font-size:.9rem;outline:none;transition:border .2s;background:#fff;}
.sinp:focus{border-color:var(--g3);}
.pills{display:flex;gap:.45rem;flex-wrap:wrap;margin-bottom:1.1rem;}
.pill{padding:.32rem .85rem;border-radius:20px;border:2px solid var(--gp);background:#fff;cursor:pointer;font-size:.78rem;font-weight:600;color:var(--tm);transition:all .2s;}
.pill.active{background:var(--g3);color:#fff;border-color:var(--g3);}
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:1rem;}
.pcard{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 2px 14px var(--sh);transition:all .3s;}
.pcard:hover{transform:translateY(-6px);box-shadow:0 16px 36px var(--sh);}
.pimg{height:120px;display:flex;align-items:center;justify-content:center;font-size:3.8rem;background:var(--gm);position:relative;}
.org-dot{position:absolute;top:8px;right:8px;background:var(--g4);color:#fff;font-size:.62rem;font-weight:700;padding:.18rem .5rem;border-radius:6px;}
.pinfo{padding:.9rem;}
.pname{font-family:'Playfair Display',serif;font-size:1.02rem;margin-bottom:.15rem;}
.pfarmer{font-size:.75rem;color:var(--earth);font-weight:600;margin-bottom:.12rem;}
.ploc{font-size:.72rem;color:var(--tl);margin-bottom:.55rem;}
.stars{font-size:.75rem;color:var(--orange);margin-bottom:.12rem;}
.pfoot{display:flex;align-items:center;justify-content:space-between;}
.pp{font-size:1.1rem;font-weight:700;color:var(--g2);}
.pu{font-size:.68rem;color:var(--tl);}
.addbtn{background:var(--g3);color:#fff;border:none;padding:.35rem .85rem;border-radius:8px;cursor:pointer;font-weight:600;font-size:.78rem;transition:all .2s;}
.addbtn:hover{background:var(--g2);}
.loading{text-align:center;padding:3rem;color:var(--tl);}
.loading-spin{font-size:2rem;animation:spin 1s linear infinite;display:block;margin-bottom:1rem;}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.msg-list{display:flex;flex-direction:column;gap:.65rem;}
.msg-item{background:#fff;border-radius:14px;padding:.85rem 1rem;box-shadow:0 2px 10px var(--sh);cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.85rem;}
.msg-item:hover{transform:translateX(4px);}
.mav{font-size:2rem;width:42px;text-align:center;}
.mif{flex:1;}
.mn{font-weight:700;font-family:'Playfair Display',serif;font-size:.95rem;margin-bottom:.1rem;}
.mp{font-size:.8rem;color:var(--tl);}
.mt{font-size:.7rem;color:var(--tl);}
.mu{background:var(--g3);color:#fff;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;}
.chat-win{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 2px 14px var(--sh);}
.chat-hdr{background:var(--g2);color:#fff;padding:.85rem 1rem;display:flex;align-items:center;gap:.85rem;}
.cbk{background:none;border:none;color:#fff;cursor:pointer;font-size:1.2rem;}
.chat-msgs{padding:1rem;min-height:260px;max-height:350px;overflow-y:auto;display:flex;flex-direction:column;gap:.6rem;}
.bbl{max-width:75%;padding:.65rem .9rem;border-radius:16px;font-size:.85rem;line-height:1.55;}
.bbl.them{background:var(--gm);align-self:flex-start;border-bottom-left-radius:4px;}
.bbl.me{background:var(--g3);color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}
.chat-inp-row{display:flex;gap:.6rem;padding:.85rem;border-top:2px solid var(--gp);}
.ci{flex:1;padding:.68rem .9rem;border:2px solid var(--gp);border-radius:10px;font-size:.86rem;outline:none;}
.ci:focus{border-color:var(--g3);}
.sbtn{background:var(--g3);color:#fff;border:none;padding:.68rem 1rem;border-radius:10px;cursor:pointer;}
.cart-empty{text-align:center;padding:3rem;color:var(--tl);}
.cart-items{display:flex;flex-direction:column;gap:.65rem;margin-bottom:1.3rem;}
.citem{background:#fff;border-radius:14px;padding:.85rem;display:flex;align-items:center;gap:.85rem;box-shadow:0 2px 10px var(--sh);}
.cicn{font-size:2.2rem;}
.cii{flex:1;}
.cin{font-weight:600;font-size:.9rem;}
.cif{font-size:.75rem;color:var(--earth);}
.qc{display:flex;align-items:center;gap:.38rem;}
.qb{background:var(--gp);border:none;width:26px;height:26px;border-radius:7px;cursor:pointer;font-size:.95rem;font-weight:700;color:var(--g2);transition:background .2s;}
.qb:hover{background:var(--g3);color:#fff;}
.cpr{font-weight:700;color:var(--g2);font-size:1rem;}
.cargo-box{background:#fff;border-radius:18px;padding:1.3rem;box-shadow:0 2px 14px var(--sh);margin-bottom:1.2rem;}
.cargo-box h4{font-family:'Playfair Display',serif;color:var(--g2);margin-bottom:.9rem;}
.cargo-opts{display:grid;grid-template-columns:1fr 1fr;gap:.65rem;}
.cargo-opt{border:2px solid var(--gp);border-radius:12px;padding:.9rem;cursor:pointer;transition:all .2s;}
.cargo-opt.sel{border-color:var(--g3);background:var(--gm);}
.cargo-opt h5{font-weight:700;font-size:.88rem;margin-bottom:.2rem;}
.cargo-opt p{font-size:.75rem;color:var(--tl);line-height:1.4;}
.cargo-opt .cprice{font-weight:700;color:var(--g3);font-size:.95rem;margin-top:.35rem;}
.addr-box{background:var(--gm);border-radius:14px;padding:1.1rem;margin-bottom:1.2rem;}
.addr-box h4{font-family:'Playfair Display',serif;color:var(--g2);margin-bottom:.75rem;}
.addr-row{display:flex;gap:.65rem;margin-bottom:.65rem;flex-wrap:wrap;}
.addr-inp{flex:1;min-width:130px;padding:.72rem .9rem;border:2px solid var(--gp);border-radius:10px;font-size:.86rem;outline:none;background:#fff;}
.addr-inp:focus{border-color:var(--g3);}
.cart-sum{background:var(--g2);color:#fff;border-radius:18px;padding:1.4rem;display:flex;flex-direction:column;gap:.6rem;}
.sr{display:flex;justify-content:space-between;align-items:center;font-size:.9rem;}
.sr.big{font-size:1.15rem;font-weight:700;font-family:'Playfair Display',serif;}
.sdiv{border-top:1px solid rgba(255,255,255,.18);padding-top:.6rem;}
.ordbtn{background:var(--g4);color:var(--g2);border:none;padding:1rem;border-radius:14px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .2s;width:100%;margin-top:.5rem;}
.ordbtn:hover{background:#fff;}
.orders-list{display:flex;flex-direction:column;gap:1rem;}
.ocard{background:#fff;border-radius:18px;padding:1.2rem;box-shadow:0 2px 14px var(--sh);}
.otop{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.9rem;}
.oid{font-weight:700;font-size:.84rem;color:var(--tl);}
.ostatus{font-size:.74rem;font-weight:700;padding:.25rem .7rem;border-radius:20px;}
.s0{background:#fef3cd;color:#856404;}
.s1{background:#d1ecf1;color:#0c5460;}
.s2{background:#cce5ff;color:#004085;}
.s3{background:#d4edda;color:#155724;}
.oitems{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.9rem;}
.otag{background:var(--gm);padding:.25rem .65rem;border-radius:8px;font-size:.77rem;}
.prog-bar{height:5px;background:var(--gp);border-radius:3px;margin-bottom:.55rem;overflow:hidden;}
.prog-fill{height:100%;background:var(--g3);border-radius:3px;transition:width .6s;}
.prog-steps{display:flex;justify-content:space-between;font-size:.65rem;color:var(--tl);}
.prog-steps span.dn{color:var(--g3);font-weight:700;}
.ofoot{display:flex;justify-content:space-between;align-items:center;margin-top:.85rem;padding-top:.85rem;border-top:1px solid var(--gp);}
.ototal{font-weight:700;color:var(--g2);}
.kargo-info{font-size:.75rem;color:var(--tl);margin-top:.3rem;}
.kargo-kod{background:var(--gm);border-radius:6px;padding:.2rem .5rem;font-size:.75rem;font-weight:600;font-family:monospace;}
.fpanel{display:flex;flex-direction:column;gap:1.3rem;}
.pc{background:#fff;border-radius:18px;padding:1.3rem;box-shadow:0 2px 14px var(--sh);}
.pc h3{font-family:'Playfair Display',serif;color:var(--g2);margin-bottom:.9rem;font-size:1.2rem;}
.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.85rem;}
.stb{text-align:center;background:var(--gm);border-radius:12px;padding:.85rem;}
.stn{font-size:1.55rem;font-weight:700;color:var(--g2);font-family:'Playfair Display',serif;}
.stl{font-size:.7rem;color:var(--tl);margin-top:.1rem;}
.fc{display:flex;flex-direction:column;gap:.7rem;}
.fr{display:flex;gap:.65rem;flex-wrap:wrap;}
.fi{flex:1;min-width:105px;padding:.72rem .9rem;border:2px solid var(--gp);border-radius:10px;font-size:.88rem;outline:none;}
.fi:focus{border-color:var(--g3);}
.fsel{flex:1;min-width:105px;padding:.72rem .9rem;border:2px solid var(--gp);border-radius:10px;font-size:.88rem;outline:none;background:#fff;}
.subbtn{background:var(--g3);color:#fff;border:none;padding:.85rem;border-radius:12px;font-size:.95rem;font-weight:600;cursor:pointer;transition:background .2s;}
.subbtn:hover{background:var(--g2);}
.order-row{display:flex;justify-content:space-between;align-items:center;padding:.68rem 0;border-bottom:1px solid var(--gp);}
.order-row:last-child{border-bottom:none;}
.cnfbtn{background:var(--g4);color:var(--g2);border:none;padding:.3rem .75rem;border-radius:8px;cursor:pointer;font-weight:700;font-size:.76rem;}
.admin-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:1.3rem;}
.admin-stat{background:var(--g2);color:#fff;border-radius:16px;padding:1.2rem;text-align:center;}
.admin-stat .n{font-size:2rem;font-weight:700;font-family:'Playfair Display',serif;}
.admin-stat .l{font-size:.78rem;opacity:.75;margin-top:.2rem;}
.farmer-list{display:flex;flex-direction:column;gap:.65rem;}
.farmer-row{background:#fff;border-radius:12px;padding:.9rem 1.1rem;display:flex;align-items:center;gap:.9rem;box-shadow:0 2px 8px var(--sh);}
.farmer-row-info{flex:1;}
.farmer-row-name{font-weight:700;font-size:.92rem;}
.farmer-row-detail{font-size:.78rem;color:var(--tl);}
.appr-btn{background:var(--g4);color:var(--g2);border:none;padding:.35rem .8rem;border-radius:8px;cursor:pointer;font-weight:700;font-size:.76rem;}
.rej-btn{background:#fee;color:var(--red);border:2px solid var(--red);padding:.35rem .8rem;border-radius:8px;cursor:pointer;font-weight:700;font-size:.76rem;}
.approved{background:var(--gm);color:var(--g3);font-size:.75rem;font-weight:700;padding:.3rem .7rem;border-radius:8px;}
.profile-card{background:#fff;border-radius:22px;padding:1.8rem;box-shadow:0 4px 24px var(--sh);}
.prav{font-size:5rem;text-align:center;margin-bottom:.85rem;}
.prname{font-family:'Playfair Display',serif;font-size:1.75rem;text-align:center;color:var(--g2);margin-bottom:.2rem;}
.prrole{text-align:center;color:var(--tl);margin-bottom:1.4rem;font-size:.85rem;}
.info-list{display:flex;flex-direction:column;gap:.65rem;}
.info-row{display:flex;justify-content:space-between;padding:.72rem 1rem;background:var(--gm);border-radius:10px;font-size:.88rem;}
.info-row span:first-child{color:var(--tl);}
.info-row span:last-child{font-weight:600;}
.logout-btn{width:100%;margin-top:1.4rem;padding:.9rem;background:#fff;border:2px solid var(--red);color:var(--red);border-radius:14px;font-weight:700;font-size:.92rem;cursor:pointer;transition:all .2s;}
.logout-btn:hover{background:var(--red);color:#fff;}
.toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--g1);color:#fff;padding:.72rem 1.5rem;border-radius:14px;font-weight:600;font-size:.88rem;box-shadow:0 8px 32px rgba(0,0,0,.22);z-index:1000;animation:tin .3s ease;white-space:nowrap;max-width:90vw;text-align:center;}
@keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.pending-badge{background:#fef3cd;color:#856404;font-size:.72rem;font-weight:700;padding:.2rem .6rem;border-radius:8px;}
`;

const SL = ["Sipariş Alındı","Çiftçi Onayladı","Kargoda","Teslim Edildi"];
const SC = ["s0","s1","s2","s3"];

function Stars({n}){
  const r = Math.round(n||0);
  return <span className="stars">{"★".repeat(r)}{"☆".repeat(5-r)} {(n||0).toFixed(1)}</span>;
}

export default function App(){
  const [screen, setScreen] = useState("splash");
  const [role, setRole] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authRole, setAuthRole] = useState("buyer");
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [tab, setTab] = useState("market");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tümü");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [kargoType, setKargoType] = useState("yurtici");
  const [addr, setAddr] = useState({street:"",district:"",city:"",note:""});
  const [form, setForm] = useState({name:"",email:"",password:"",phone:"",city:""});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [newProd, setNewProd] = useState({name:"",price:"",unit:"kg",emoji:"🌱",cat:"Sebze",stock:""});
  const endRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 2800); };

  // Auth state listener
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if(u){
        setUser(u);
        const profileDoc = await getDoc(doc(db,"users",u.uid));
        if(profileDoc.exists()){
          const profile = profileDoc.data();
          setUserProfile(profile);
          setRole(profile.role);
          setTab(profile.role==="farmer"?"panel":profile.role==="admin"?"admin":"market");
          setScreen("app");
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setRole(null);
        setScreen("splash");
      }
    });
    return ()=>unsub();
  },[]);

  // Load products
  useEffect(()=>{
    if(screen==="app"){
      loadProducts();
    }
  },[screen]);

  const loadProducts = async () => {
    try {
      const snap = await getDocs(collection(db,"products"));
      const prods = snap.docs.map(d=>({id:d.id,...d.data()}));
      setProducts(prods);
    } catch(e){ console.log(e); }
  };

  const loadOrders = async () => {
    if(!user) return;
    try {
      let q;
      if(role==="buyer"){
        q = query(collection(db,"orders"), where("buyerId","==",user.uid));
      } else if(role==="farmer"){
        q = query(collection(db,"orders"), where("farmerId","==",user.uid));
      } else {
        q = collection(db,"orders");
      }
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e){ console.log(e); }
  };

  const loadFarmers = async () => {
    try {
      const q = query(collection(db,"users"), where("role","==","farmer"));
      const snap = await getDocs(q);
      setFarmers(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e){ console.log(e); }
  };

  const handleAuth = async () => {
    setAuthError("");
    if(!form.email || !form.password){ setAuthError("E-posta ve şifre zorunlu!"); return; }
    if(authMode==="register" && !form.name){ setAuthError("İsim zorunlu!"); return; }
    setLoading(true);
    try {
      if(authMode==="register"){
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await setDoc(doc(db,"users",cred.user.uid),{
          name: form.name,
          email: form.email,
          phone: form.phone||"",
          city: form.city||"",
          role: authRole,
          verified: authRole==="buyer",
          createdAt: serverTimestamp()
        });
        showToast(`Hoş geldin, ${form.name}! 🌿`);
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        showToast("Giriş yapıldı! 🌿");
      }
    } catch(e){
      const msgs = {
        "auth/email-already-in-use":"Bu e-posta zaten kayıtlı!",
        "auth/wrong-password":"Şifre yanlış!",
        "auth/user-not-found":"Bu e-posta kayıtlı değil!",
        "auth/weak-password":"Şifre en az 6 karakter olmalı!",
        "auth/invalid-email":"Geçersiz e-posta!"
      };
      setAuthError(msgs[e.code]||"Bir hata oluştu, tekrar dene.");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCart([]);
    setProducts([]);
    setOrders([]);
  };

  const addToCart = (p) => {
    setCart(prev=>{
      const ex=prev.find(i=>i.id===p.id);
      if(ex) return prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i);
      return [...prev,{...p,qty:1}];
    });
    showToast(`${p.emoji} ${p.name} sepete eklendi!`);
  };

  const updateQty = (id,d) => setCart(prev=>prev.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));

  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const kargoBedel = cartTotal>=300?0:kargoType==="oz"?20:30;

  const placeOrder = async () => {
    if(!addr.street||!addr.city){ showToast("Teslimat adresini doldurun!"); return; }
    try {
      const kod = kargoType==="oz"?`OZ${Math.floor(10000+Math.random()*90000)}`:`YK${Math.floor(10000000+Math.random()*90000000)}`;
      await addDoc(collection(db,"orders"),{
        buyerId: user.uid,
        buyerName: userProfile?.name||"",
        items: cart.map(i=>`${i.emoji} ${i.name} ${i.qty}${i.unit}`),
        farmerId: cart[0]?.farmerId||"",
        farmer: cart[0]?.farmer||"",
        total: cartTotal+kargoBedel,
        status: 0,
        kargo: kargoType==="oz"?"Öz Kurye":"Yurtiçi Kargo",
        kod,
        addr:`${addr.district}, ${addr.city}`,
        createdAt: serverTimestamp()
      });
      setCart([]);
      showToast("🎉 Siparişiniz alındı!");
      setTab("orders");
      loadOrders();
    } catch(e){ showToast("Hata: "+e.message); }
  };

  const addProduct = async () => {
    if(!newProd.name||!newProd.price){ showToast("Ürün adı ve fiyat zorunlu!"); return; }
    try {
      await addDoc(collection(db,"products"),{
        name: newProd.name,
        emoji: newProd.emoji,
        price: parseFloat(newProd.price),
        unit: newProd.unit,
        cat: newProd.cat,
        org: false,
        stock: newProd.stock||"",
        farmer: userProfile?.name||"",
        farmerId: user.uid,
        loc: userProfile?.city||"",
        rating: 0,
        reviews: 0,
        createdAt: serverTimestamp()
      });
      showToast(`${newProd.emoji} ${newProd.name} listelendi!`);
      setNewProd({name:"",price:"",unit:"kg",emoji:"🌱",cat:"Sebze",stock:""});
      loadProducts();
    } catch(e){ showToast("Hata: "+e.message); }
  };

  const approveFarmer = async (farmerId) => {
    try {
      await updateDoc(doc(db,"users",farmerId),{verified:true});
      showToast("✅ Çiftçi onaylandı!");
      loadFarmers();
    } catch(e){ showToast("Hata!"); }
  };

  const filtered = products.filter(p=>{
    const ms = p.name?.toLowerCase().includes(search.toLowerCase())||p.farmer?.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="Tümü"||p.cat===filter||(filter==="Organik"&&p.org);
    return ms && mf;
  });

  // SPLASH
  if(screen==="splash") return(
    <><style>{CSS}</style>
    <div className="splash">
      <span className="splash-leaf">🌿</span>
      <div className="splash-title">Çiftçiden <em>Al</em></div>
      <div className="splash-sub">Tarladan sofrana · Aracısız · Taze · Dürüst</div>
      <div className="role-cards">
        <div className="role-card" onClick={()=>{setAuthRole("buyer");setAuthMode("login");setScreen("auth");}}>
          <span className="icon">🛒</span><h3>Alıcıyım</h3><p>Taze ürünü direkt çiftçiden al</p>
        </div>
        <div className="role-card" onClick={()=>{setAuthRole("farmer");setAuthMode("login");setScreen("auth");}}>
          <span className="icon">👨‍🌾</span><h3>Çiftçiyim</h3><p>Ürünlerini listele, daha çok kazan</p>
        </div>
      </div>
      <span className="admin-link" onClick={()=>{setAuthRole("admin");setAuthMode("login");setScreen("auth");}}>Yönetici Girişi</span>
    </div></>
  );

  // AUTH
  if(screen==="auth") return(
    <><style>{CSS}</style>
    <div className="auth-wrap"><div className="auth-card">
      <div className="auth-logo">🌿 Çiftçiden <em>Al</em></div>
      <div className="auth-sub">{authRole==="admin"?"Yönetici Paneli":"Tarladan sofrana, aracısız"}</div>
      {authRole!=="admin"&&<div className="auth-tabs">
        <button className={`auth-tab ${authMode==="login"?"active":""}`} onClick={()=>{setAuthMode("login");setAuthError("");}}>Giriş Yap</button>
        <button className={`auth-tab ${authMode==="register"?"active":""}`} onClick={()=>{setAuthMode("register");setAuthError("");}}>Kayıt Ol</button>
      </div>}
      {authMode==="register"&&authRole!=="admin"&&<>
        <div style={{fontSize:".8rem",fontWeight:600,color:"var(--tm)",marginBottom:".45rem"}}>Hesap türü</div>
        <div className="role-row">
          <div className={`role-opt ${authRole==="buyer"?"active":""}`} onClick={()=>setAuthRole("buyer")}>🛒 Alıcı</div>
          <div className={`role-opt ${authRole==="farmer"?"active":""}`} onClick={()=>setAuthRole("farmer")}>👨‍🌾 Çiftçi</div>
        </div>
        {authRole==="farmer"&&<div className="note-box">📋 Çiftçi hesabınız admin onayı gerektirir.</div>}
        <div className="field"><label>Ad Soyad</label><input className="inp" placeholder="Adınız Soyadınız" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
        <div className="field"><label>Telefon</label><input className="inp" placeholder="05XX XXX XX XX" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
        <div className="field"><label>Şehir</label><input className="inp" placeholder="Adana" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}/></div>
      </>}
      {authError&&<div className="err-box">⚠️ {authError}</div>}
      <div className="field"><label>E-posta</label><input className="inp" placeholder="ornek@mail.com" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
      <div className="field"><label>Şifre</label><input className="inp" placeholder="••••••••" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleAuth()}/></div>
      <button className="auth-btn" onClick={handleAuth} disabled={loading}>
        {loading?"⏳ Bekleyin...":authRole==="admin"?"Yönetici Girişi →":authMode==="login"?"Giriş Yap →":"Kayıt Ol →"}
      </button>
      <span className="auth-back" onClick={()=>{setScreen("splash");setAuthError("");}}>← Geri dön</span>
    </div></div></>
  );

  // MAIN APP
  const buyerTabs=[{key:"market",label:"🛒 Market"},{key:"messages",label:"💬 Mesajlar"},{key:"orders",label:"📦 Siparişler"},{key:"cart",label:`🧺${cartCount>0?` (${cartCount})`:""}`},{key:"profile",label:"👤 Profil"}];
  const farmerTabs=[{key:"panel",label:"📊 Panel"},{key:"market",label:"📦 Ürünler"},{key:"messages",label:"💬 Mesajlar"},{key:"profile",label:"👤 Profil"}];
  const adminTabs=[{key:"admin",label:"⚙️ Dashboard"},{key:"farmers",label:"👨‍🌾 Çiftçiler"},{key:"market",label:"🛒 Market"}];
  const allTabs = role==="buyer"?buyerTabs:role==="farmer"?farmerTabs:adminTabs;

  return(
    <><style>{CSS}</style>
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <nav className="nav">
        <div className="nav-logo" onClick={()=>setTab(role==="buyer"?"market":role==="farmer"?"panel":"admin")}>🌿 Çiftçiden <em>Al</em></div>
        <div className="nav-center">
          <span className="nbadge">{role==="buyer"?"Alıcı":role==="farmer"?"Çiftçi":"Admin"}</span>
          <span className="nav-user">{userProfile?.name}</span>
        </div>
        <div className="nav-actions">
          {role==="buyer"&&<button className="nbtn" onClick={()=>setTab("cart")}>🧺{cartCount>0&&<span className="bdg">{cartCount}</span>}</button>}
          <button className="nbtn" onClick={handleLogout}>Çıkış</button>
        </div>
      </nav>
      <div className="tabs">
        {allTabs.map(t=><button key={t.key} className={`tab ${tab===t.key?"active":""}`} onClick={()=>{setTab(t.key);if(t.key==="orders")loadOrders();if(t.key==="farmers"||t.key==="admin")loadFarmers();}}>{t.label}</button>)}
      </div>
      <div className="main">

        {/* MARKET */}
        {tab==="market"&&<>
          <div className="sh2"><h2>Taze Ürünler</h2><p>Çiftçilerden direkt, aracısız</p></div>
          <div className="srow"><input className="sinp" placeholder="🔍 Ürün veya çiftçi ara..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <div className="pills">{["Tümü","Sebze","Meyve","Organik","Diğer"].map(f=><button key={f} className={`pill ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>{f}</button>)}</div>
          {products.length===0?<div className="loading"><span className="loading-spin">🌿</span><p>Ürünler yükleniyor...</p></div>:
          <div className="pgrid">{filtered.map(p=>(
            <div key={p.id} className="pcard">
              <div className="pimg">{p.emoji}{p.org&&<span className="org-dot">🌱 Org</span>}</div>
              <div className="pinfo">
                <Stars n={p.rating}/>
                <div className="pname">{p.name}</div>
                <div className="pfarmer">👨‍🌾 {p.farmer}</div>
                <div className="ploc">📍 {p.loc}</div>
                <div className="pfoot">
                  <div><span className="pp">{p.price}₺</span><span className="pu"> /{p.unit}</span></div>
                  {role==="buyer"&&<button className="addbtn" onClick={()=>addToCart(p)}>+ Ekle</button>}
                </div>
              </div>
            </div>
          ))}</div>}
        </>}

        {/* MESSAGES */}
        {tab==="messages"&&<>
          <div className="sh2"><h2>Mesajlar</h2><p>Çiftçilerle direkt iletişim</p></div>
          <div style={{background:"#fff",borderRadius:"16px",padding:"2rem",textAlign:"center",color:"var(--tl)",boxShadow:"0 2px 14px var(--sh)"}}>
            <div style={{fontSize:"3rem",marginBottom:"1rem"}}>💬</div>
            <p style={{fontWeight:600,marginBottom:".5rem"}}>Mesajlaşma yakında!</p>
            <p style={{fontSize:".85rem"}}>Çiftçilerle direkt mesajlaşma özelliği çok yakında eklenecek.</p>
          </div>
        </>}

        {/* ORDERS */}
        {tab==="orders"&&<>
          <div className="sh2"><h2>Siparişlerim</h2></div>
          {orders.length===0?<div className="loading"><p>Sipariş bulunamadı</p></div>:
          <div className="orders-list">{orders.map(o=>{
            const pct=[0,33,66,100][o.status||0];
            return<div key={o.id} className="ocard">
              <div className="otop">
                <div><div className="oid">{o.id?.slice(0,8)} · {o.createdAt?.toDate?.().toLocaleDateString("tr-TR")||"Bugün"}</div><div style={{fontSize:".82rem",color:"var(--tl)",marginTop:".18rem"}}>👨‍🌾 {o.farmer}</div></div>
                <span className={`ostatus ${SC[o.status||0]}`}>{SL[o.status||0]}</span>
              </div>
              <div className="oitems">{(o.items||[]).map((it,i)=><span key={i} className="otag">{it}</span>)}</div>
              <div className="prog-bar"><div className="prog-fill" style={{width:`${pct}%`}}/></div>
              <div className="prog-steps">{SL.map((l,i)=><span key={i} className={i<=(o.status||0)?"dn":""}>{l}</span>)}</div>
              <div className="ofoot">
                <div><div className="ototal">{o.total}₺</div><div className="kargo-info">🚚 {o.kargo} · <span className="kargo-kod">{o.kod}</span></div></div>
              </div>
            </div>;
          })}</div>}
        </>}

        {/* CART */}
        {tab==="cart"&&<>
          <div className="sh2"><h2>Sepetim</h2></div>
          {cart.length===0?<div className="cart-empty">
            <div style={{fontSize:"4rem",marginBottom:".9rem"}}>🧺</div>
            <p style={{fontWeight:600}}>Sepetiniz boş</p>
            <button className="addbtn" style={{marginTop:".9rem",padding:".6rem 1.2rem"}} onClick={()=>setTab("market")}>Markete Git →</button>
          </div>:<>
            <div className="cart-items">{cart.map(item=>(
              <div key={item.id} className="citem">
                <div className="cicn">{item.emoji}</div>
                <div className="cii"><div className="cin">{item.name}</div><div className="cif">👨‍🌾 {item.farmer}</div></div>
                <div className="qc">
                  <button className="qb" onClick={()=>updateQty(item.id,-1)}>−</button>
                  <span style={{fontWeight:700,minWidth:"18px",textAlign:"center"}}>{item.qty}</span>
                  <button className="qb" onClick={()=>updateQty(item.id,1)}>+</button>
                </div>
                <div className="cpr">{item.price*item.qty}₺</div>
              </div>
            ))}</div>
            <div className="cargo-box">
              <h4>🚚 Teslimat Yöntemi</h4>
              {cartTotal>=300&&<div style={{background:"var(--g4)",color:"var(--g2)",borderRadius:"10px",padding:".6rem .9rem",fontSize:".85rem",fontWeight:600,marginBottom:".75rem"}}>🎉 300₺ üzeri kargo ücretsiz!</div>}
              <div className="cargo-opts">
                <div className={`cargo-opt ${kargoType==="oz"?"sel":""}`} onClick={()=>setKargoType("oz")}>
                  <h5>🛵 Öz Kurye</h5><p>Şehir içi, aynı gün</p>
                  <div className="cprice">{cartTotal>=300?"Ücretsiz":"20₺"}</div>
                </div>
                <div className={`cargo-opt ${kargoType==="yurtici"?"sel":""}`} onClick={()=>setKargoType("yurtici")}>
                  <h5>📦 Yurtiçi Kargo</h5><p>1-3 iş günü</p>
                  <div className="cprice">{cartTotal>=300?"Ücretsiz":"30₺"}</div>
                </div>
              </div>
            </div>
            <div className="addr-box">
              <h4>📍 Teslimat Adresi</h4>
              <div className="addr-row"><input className="addr-inp" placeholder="Sokak / Cadde" value={addr.street} onChange={e=>setAddr(a=>({...a,street:e.target.value}))}/></div>
              <div className="addr-row">
                <input className="addr-inp" placeholder="İlçe" value={addr.district} onChange={e=>setAddr(a=>({...a,district:e.target.value}))}/>
                <input className="addr-inp" placeholder="Şehir" value={addr.city} onChange={e=>setAddr(a=>({...a,city:e.target.value}))}/>
              </div>
            </div>
            <div className="cart-sum">
              <div className="sr"><span>Ara toplam</span><span>{cartTotal}₺</span></div>
              <div className="sr"><span>Aracı komisyonu</span><span style={{color:"#a8d87a"}}>0₺ 🎉</span></div>
              <div className="sr"><span>Kargo</span><span>{kargoBedel===0?"Ücretsiz":kargoBedel+"₺"}</span></div>
              <div className="sdiv"><div className="sr big"><span>Toplam</span><span>{cartTotal+kargoBedel}₺</span></div></div>
              <button className="ordbtn" onClick={placeOrder}>Sipariş Ver 🌿</button>
            </div>
          </>}
        </>}

        {/* FARMER PANEL */}
        {tab==="panel"&&<div className="fpanel">
          <div className="sh2"><h2>Çiftçi Paneliniz</h2><p>Hoş geldin, {userProfile?.name}! {userProfile?.verified?"✅ Onaylı hesap":"⏳ Onay bekliyor"}</p></div>
          {!userProfile?.verified&&<div className="note-box" style={{borderColor:"var(--orange)"}}>⏳ Hesabınız admin onayı bekliyor. Onaylandıktan sonra ürün ekleyebilirsiniz.</div>}
          <div className="pc"><h3>➕ Yeni Ürün Ekle</h3>
            <div className="fc">
              <div className="fr">
                <input className="fi" placeholder="Emoji 🍅" value={newProd.emoji} onChange={e=>setNewProd(p=>({...p,emoji:e.target.value}))} style={{maxWidth:"72px"}}/>
                <input className="fi" placeholder="Ürün adı" value={newProd.name} onChange={e=>setNewProd(p=>({...p,name:e.target.value}))}/>
              </div>
              <div className="fr">
                <input className="fi" placeholder="Fiyat (₺)" type="number" value={newProd.price} onChange={e=>setNewProd(p=>({...p,price:e.target.value}))}/>
                <input className="fi" placeholder="Birim (kg/adet)" value={newProd.unit} onChange={e=>setNewProd(p=>({...p,unit:e.target.value}))}/>
                <select className="fsel" value={newProd.cat} onChange={e=>setNewProd(p=>({...p,cat:e.target.value}))}>
                  <option>Sebze</option><option>Meyve</option><option>Diğer</option>
                </select>
              </div>
              <button className="subbtn" onClick={addProduct}>Ürünü Listele 🌿</button>
            </div>
          </div>
          <div className="pc"><h3>📦 Siparişlerim</h3>
            {orders.length===0?<p style={{color:"var(--tl)",fontSize:".88rem"}}>Henüz sipariş yok.</p>:
            orders.map((o,i)=>(
              <div key={i} className="order-row">
                <div><div style={{fontWeight:600,fontSize:".88rem"}}>{(o.items||[]).join(", ")}</div><div style={{fontSize:".75rem",color:"var(--tl)"}}>👤 {o.buyerName}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:".55rem"}}>
                  <span className={`ostatus ${SC[o.status||0]}`}>{SL[o.status||0]}</span>
                  <span style={{fontWeight:700,color:"var(--g2)"}}>{o.total}₺</span>
                  {(o.status||0)<3&&<button className="cnfbtn" onClick={async()=>{await updateDoc(doc(db,"orders",o.id),{status:(o.status||0)+1});showToast("Durum güncellendi!");loadOrders();}}>Güncelle</button>}
                </div>
              </div>
            ))}
          </div>
        </div>}

        {/* ADMIN */}
        {tab==="admin"&&<>
          <div className="sh2"><h2>Admin Paneli</h2></div>
          <div className="admin-grid">
            <div className="admin-stat"><div className="n">{farmers.length}</div><div className="l">Toplam Çiftçi</div></div>
            <div className="admin-stat"><div className="n">{farmers.filter(f=>!f.verified).length}</div><div className="l">Onay Bekleyen</div></div>
            <div className="admin-stat"><div className="n">{products.length}</div><div className="l">Aktif Ürün</div></div>
          </div>
        </>}

        {/* FARMERS */}
        {tab==="farmers"&&<>
          <div className="sh2"><h2>Çiftçi Yönetimi</h2></div>
          <div className="pc">
            <h3>Tüm Çiftçiler</h3>
            <div className="farmer-list">
              {farmers.length===0?<p style={{color:"var(--tl)",fontSize:".88rem"}}>Henüz kayıtlı çiftçi yok.</p>:
              farmers.map(f=>(
                <div key={f.id} className="farmer-row">
                  <div style={{fontSize:"2rem"}}>👨‍🌾</div>
                  <div className="farmer-row-info">
                    <div className="farmer-row-name">{f.name}</div>
                    <div className="farmer-row-detail">📍 {f.city} · 📱 {f.phone}</div>
                  </div>
                  {!f.verified?<div style={{display:"flex",gap:".4rem"}}>
                    <button className="appr-btn" onClick={()=>approveFarmer(f.id)}>✓ Onayla</button>
                  </div>:<span className="approved">✓ Onaylı</span>}
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* PROFILE */}
        {tab==="profile"&&<>
          <div className="sh2"><h2>Profilim</h2></div>
          <div className="profile-card">
            <div className="prav">{role==="buyer"?"🛒":"👨‍🌾"}</div>
            <div className="prname">{userProfile?.name}</div>
            <div className="prrole">{role==="buyer"?"Alıcı Hesabı":"Çiftçi Hesabı"}</div>
            <div className="info-list">
              <div className="info-row"><span>📧 E-posta</span><span>{userProfile?.email}</span></div>
              <div className="info-row"><span>📱 Telefon</span><span>{userProfile?.phone||"—"}</span></div>
              <div className="info-row"><span>📍 Şehir</span><span>{userProfile?.city||"—"}</span></div>
              {role==="farmer"&&<div className="info-row"><span>✅ Durum</span><span style={{color:userProfile?.verified?"var(--g3)":"var(--orange)"}}>{userProfile?.verified?"Onaylandı":"Onay Bekliyor"}</span></div>}
            </div>
            <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>
          </div>
        </>}

      </div>
    </div>
    {toast&&<div className="toast">{toast}</div>}
    </>
  );
}
