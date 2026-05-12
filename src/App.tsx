import { useState, useRef, useEffect } from 'react';

/* ─── THEME ─────────────────────────────────────────────────────── */
const G = {
  g1: '#1a3209',
  g2: '#2d5016',
  g3: '#4a7c2f',
  g4: '#7ab648',
  g5: '#a8d87a',
  gp: '#d4edba',
  gm: '#f0f7e8',
  earth: '#8b5e3c',
  cream: '#faf6ef',
  td: '#1a2e0a',
  tm: '#4a5e3a',
  tl: '#8a9e7a',
  sh: 'rgba(45,80,22,0.13)',
  red: '#e05252',
  orange: '#e8952a',
  blue: '#3a7bd5',
  gold: '#d4a017',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --g1:${G.g1};--g2:${G.g2};--g3:${G.g3};--g4:${G.g4};--g5:${G.g5};
  --gp:${G.gp};--gm:${G.gm};--earth:${G.earth};--cream:${G.cream};
  --td:${G.td};--tm:${G.tm};--tl:${G.tl};--sh:${G.sh};
  --red:${G.red};--orange:${G.orange};--gold:${G.gold};
}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--td);-webkit-font-smoothing:antialiased;}
input,select,button{font-family:'DM Sans',sans-serif;}

/* SPLASH */
.splash{min-height:100vh;background:linear-gradient(160deg,var(--g1) 0%,var(--g2) 45%,var(--g3) 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;position:relative;overflow:hidden;}
.splash::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 70%,rgba(122,182,72,.18) 0%,transparent 55%),radial-gradient(ellipse at 80% 20%,rgba(168,216,122,.12) 0%,transparent 45%);}
.splash-leaf{font-size:5rem;display:block;text-align:center;margin-bottom:.8rem;animation:sway 5s ease-in-out infinite;position:relative;}
@keyframes sway{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}
.splash-title{font-family:'Playfair Display',serif;font-size:4rem;font-weight:700;color:#fff;text-align:center;line-height:1.05;margin-bottom:.5rem;position:relative;}
.splash-title em{font-style:italic;color:var(--g5);}
.splash-sub{color:var(--gp);font-size:1rem;text-align:center;margin-bottom:3rem;font-weight:300;letter-spacing:.08em;text-transform:uppercase;position:relative;}
.role-cards{display:flex;gap:1.5rem;flex-wrap:wrap;justify-content:center;position:relative;}
.role-card{background:rgba(255,255,255,.1);backdrop-filter:blur(16px);border:1.5px solid rgba(255,255,255,.22);border-radius:28px;padding:2.8rem 2.4rem;cursor:pointer;transition:all .35s cubic-bezier(.23,1,.32,1);text-align:center;color:#fff;min-width:200px;}
.role-card:hover{background:rgba(255,255,255,.2);transform:translateY(-10px) scale(1.02);box-shadow:0 28px 56px rgba(0,0,0,.25);}
.role-card .icon{font-size:3.8rem;margin-bottom:1rem;display:block;}
.role-card h3{font-family:'Playfair Display',serif;font-size:1.6rem;margin-bottom:.4rem;}
.role-card p{font-size:.85rem;opacity:.78;font-weight:300;line-height:1.5;}
.admin-link{position:absolute;bottom:1.5rem;right:1.5rem;color:rgba(255,255,255,.4);font-size:.75rem;cursor:pointer;text-decoration:underline;}
.admin-link:hover{color:rgba(255,255,255,.7);}

/* AUTH */
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
.auth-btn{width:100%;padding:1rem;background:var(--g3);color:#fff;border:none;border-radius:14px;font-size:1rem;font-weight:600;cursor:pointer;transition:all .2s;margin-top:.5rem;letter-spacing:.02em;}
.auth-btn:hover{background:var(--g2);transform:translateY(-1px);box-shadow:0 8px 24px rgba(45,80,22,.25);}
.auth-back{display:block;text-align:center;margin-top:1rem;color:var(--tl);font-size:.83rem;cursor:pointer;transition:color .2s;}
.auth-back:hover{color:var(--g3);}
.note-box{background:var(--gm);border:1.5px solid var(--gp);border-radius:10px;padding:.75rem 1rem;font-size:.8rem;color:var(--tm);margin-bottom:1rem;line-height:1.6;}

/* NAV */
.nav{background:var(--g2);color:#fff;padding:.85rem 1.4rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200;box-shadow:0 4px 24px var(--sh);}
.nav-logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;cursor:pointer;}
.nav-logo em{font-style:italic;color:var(--g5);}
.nav-center{display:flex;align-items:center;gap:.6rem;}
.nbadge{background:var(--g4);color:var(--g2);font-weight:700;font-size:.7rem;padding:.2rem .7rem;border-radius:20px;letter-spacing:.03em;}
.vbadge{background:var(--gold);color:#fff;font-weight:700;font-size:.65rem;padding:.15rem .6rem;border-radius:20px;}
.nav-user{font-size:.82rem;opacity:.82;}
.nav-actions{display:flex;gap:.5rem;align-items:center;}
.nbtn{background:rgba(255,255,255,.14);border:none;color:#fff;padding:.42rem .85rem;border-radius:9px;cursor:pointer;font-size:.83rem;transition:background .2s;position:relative;}
.nbtn:hover{background:rgba(255,255,255,.24);}
.bdg{position:absolute;top:-6px;right:-6px;background:var(--red);color:#fff;font-size:.6rem;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;}

/* TABS */
.tabs{display:flex;background:#fff;border-bottom:2px solid var(--gp);overflow-x:auto;scrollbar-width:none;}
.tabs::-webkit-scrollbar{display:none;}
.tab{flex:1;min-width:72px;padding:.85rem .4rem;text-align:center;cursor:pointer;font-weight:600;font-size:.78rem;color:var(--tl);border:none;background:none;transition:all .2s;white-space:nowrap;font-family:'DM Sans',sans-serif;}
.tab.active{color:var(--g3);border-bottom:3px solid var(--g3);margin-bottom:-2px;}

/* MAIN */
.main{flex:1;padding:1.3rem;max-width:980px;margin:0 auto;width:100%;}
.sh2{margin-bottom:1.2rem;}
.sh2 h2{font-family:'Playfair Display',serif;font-size:1.7rem;color:var(--g2);}
.sh2 p{color:var(--tl);font-size:.85rem;margin-top:.2rem;}

/* SEARCH */
.srow{display:flex;gap:.7rem;margin-bottom:.9rem;flex-wrap:wrap;}
.sinp{flex:1;min-width:180px;padding:.78rem 1rem;border:2px solid var(--gp);border-radius:12px;font-size:.9rem;outline:none;transition:border .2s;background:#fff;}
.sinp:focus{border-color:var(--g3);}
.pills{display:flex;gap:.45rem;flex-wrap:wrap;margin-bottom:1.1rem;}
.pill{padding:.32rem .85rem;border-radius:20px;border:2px solid var(--gp);background:#fff;cursor:pointer;font-size:.78rem;font-weight:600;color:var(--tm);transition:all .2s;}
.pill.active{background:var(--g3);color:#fff;border-color:var(--g3);}

/* PRODUCT GRID */
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:1rem;}
.pcard{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 2px 14px var(--sh);transition:all .3s cubic-bezier(.23,1,.32,1);}
.pcard:hover{transform:translateY(-6px);box-shadow:0 16px 36px var(--sh);}
.pimg{height:120px;display:flex;align-items:center;justify-content:center;font-size:3.8rem;background:var(--gm);position:relative;}
.org-dot{position:absolute;top:8px;right:8px;background:var(--g4);color:#fff;font-size:.62rem;font-weight:700;padding:.18rem .5rem;border-radius:6px;}
.vrf-dot{position:absolute;top:8px;left:8px;background:var(--gold);color:#fff;font-size:.6rem;font-weight:700;padding:.15rem .45rem;border-radius:6px;}
.pinfo{padding:.9rem;}
.pname{font-family:'Playfair Display',serif;font-size:1.02rem;margin-bottom:.15rem;}
.pfarmer{font-size:.75rem;color:var(--earth);font-weight:600;margin-bottom:.12rem;cursor:pointer;}
.pfarmer:hover{text-decoration:underline;}
.ploc{font-size:.72rem;color:var(--tl);margin-bottom:.55rem;}
.stars{font-size:.75rem;color:var(--orange);margin-bottom:.12rem;}
.pfoot{display:flex;align-items:center;justify-content:space-between;}
.pp{font-size:1.1rem;font-weight:700;color:var(--g2);}
.pu{font-size:.68rem;color:var(--tl);}
.addbtn{background:var(--g3);color:#fff;border:none;padding:.35rem .85rem;border-radius:8px;cursor:pointer;font-weight:600;font-size:.78rem;transition:all .2s;}
.addbtn:hover{background:var(--g2);}

/* FARMER PROFILE */
.back-btn{background:var(--gm);border:none;color:var(--g2);padding:.55rem 1.1rem;border-radius:10px;cursor:pointer;font-weight:600;font-size:.85rem;margin-bottom:.9rem;transition:background .2s;}
.back-btn:hover{background:var(--gp);}
.fp-wrap{background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 4px 24px var(--sh);margin-bottom:1.4rem;}
.fp-hdr{background:linear-gradient(135deg,var(--g1),var(--g3));padding:2rem;color:#fff;display:flex;align-items:center;gap:1.4rem;}
.fp-av{font-size:4rem;background:rgba(255,255,255,.15);width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.fp-name{font-family:'Playfair Display',serif;font-size:1.8rem;margin-bottom:.22rem;}
.fp-tags{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.4rem;}
.fp-tag{background:rgba(255,255,255,.18);font-size:.7rem;padding:.15rem .5rem;border-radius:6px;}
.fp-body{padding:1.5rem;}
.fp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.9rem;margin-bottom:1.3rem;}
.fp-stat{text-align:center;background:var(--gm);border-radius:12px;padding:.85rem;}
.fp-sn{font-size:1.6rem;font-weight:700;color:var(--g2);font-family:'Playfair Display',serif;}
.fp-sl{font-size:.7rem;color:var(--tl);margin-top:.1rem;}
.fp-about{font-size:.88rem;line-height:1.75;color:var(--tm);margin-bottom:1.3rem;}
.rev-list{display:flex;flex-direction:column;gap:.7rem;margin-bottom:1.2rem;}
.rev{background:var(--gm);border-radius:12px;padding:.9rem;}
.rev-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem;}
.rev-user{font-weight:600;font-size:.84rem;}
.rev-text{font-size:.82rem;color:var(--tm);line-height:1.6;}

/* MAP */
.map-box{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 2px 14px var(--sh);margin-bottom:1.4rem;}
.map-hdr{padding:.9rem 1.3rem;background:var(--gm);border-bottom:2px solid var(--gp);display:flex;align-items:center;justify-content:space-between;}
.map-hdr h3{font-family:'Playfair Display',serif;color:var(--g2);}
.map-vis{height:270px;background:linear-gradient(135deg,#e8f5d4,#d4edba,#c8e5a5);position:relative;overflow:hidden;}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(74,124,47,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(74,124,47,.07) 1px,transparent 1px);background-size:34px 34px;}
.mpin{position:absolute;cursor:pointer;transition:transform .2s;text-align:center;}
.mpin:hover{transform:scale(1.3);}
.mpin-i{font-size:1.8rem;display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,.28));}
.mpin-l{font-size:.6rem;font-weight:700;background:#fff;padding:.12rem .38rem;border-radius:5px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.14);}
.map-leg{padding:.85rem 1.3rem;display:flex;gap:.9rem;flex-wrap:wrap;border-top:1px solid var(--gp);}
.leg-i{display:flex;align-items:center;gap:.3rem;font-size:.77rem;color:var(--tm);}

/* MESSAGES */
.msg-list{display:flex;flex-direction:column;gap:.65rem;margin-bottom:.9rem;}
.msg-item{background:#fff;border-radius:14px;padding:.85rem 1rem;box-shadow:0 2px 10px var(--sh);cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.85rem;}
.msg-item:hover{transform:translateX(4px);box-shadow:0 6px 22px var(--sh);}
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
.sbtn{background:var(--g3);color:#fff;border:none;padding:.68rem 1rem;border-radius:10px;cursor:pointer;transition:background .2s;}
.sbtn:hover{background:var(--g2);}

/* CART */
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

/* KARGO KUTUSU */
.cargo-box{background:#fff;border-radius:18px;padding:1.3rem;box-shadow:0 2px 14px var(--sh);margin-bottom:1.2rem;}
.cargo-box h4{font-family:'Playfair Display',serif;color:var(--g2);margin-bottom:.9rem;font-size:1.1rem;}
.cargo-opts{display:grid;grid-template-columns:1fr 1fr;gap:.65rem;}
.cargo-opt{border:2px solid var(--gp);border-radius:12px;padding:.9rem;cursor:pointer;transition:all .2s;}
.cargo-opt.sel{border-color:var(--g3);background:var(--gm);}
.cargo-opt h5{font-weight:700;font-size:.88rem;margin-bottom:.2rem;}
.cargo-opt p{font-size:.75rem;color:var(--tl);line-height:1.4;}
.cargo-opt .cprice{font-weight:700;color:var(--g3);font-size:.95rem;margin-top:.35rem;}
.free-badge{background:var(--g4);color:#fff;font-size:.65rem;font-weight:700;padding:.1rem .4rem;border-radius:5px;margin-left:.4rem;}
.addr-box{background:var(--gm);border-radius:14px;padding:1.1rem;margin-bottom:1.2rem;}
.addr-box h4{font-family:'Playfair Display',serif;color:var(--g2);margin-bottom:.75rem;font-size:1rem;}
.addr-row{display:flex;gap:.65rem;margin-bottom:.65rem;flex-wrap:wrap;}
.addr-inp{flex:1;min-width:130px;padding:.72rem .9rem;border:2px solid var(--gp);border-radius:10px;font-size:.86rem;outline:none;background:#fff;}
.addr-inp:focus{border-color:var(--g3);}

/* CART SUMMARY */
.cart-sum{background:var(--g2);color:#fff;border-radius:18px;padding:1.4rem;display:flex;flex-direction:column;gap:.6rem;}
.sr{display:flex;justify-content:space-between;align-items:center;font-size:.9rem;}
.sr.big{font-size:1.15rem;font-weight:700;font-family:'Playfair Display',serif;}
.sdiv{border-top:1px solid rgba(255,255,255,.18);padding-top:.6rem;}
.ordbtn{background:var(--g4);color:var(--g2);border:none;padding:1rem;border-radius:14px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .2s;width:100%;margin-top:.5rem;}
.ordbtn:hover{background:#fff;transform:scale(1.02);}
.wabtn{background:#25D366;color:#fff;border:none;padding:.85rem;border-radius:14px;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .2s;width:100%;margin-top:.6rem;display:flex;align-items:center;justify-content:center;gap:.5rem;}
.wabtn:hover{background:#1da851;}

/* ORDERS */
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
.otag{background:var(--gm);padding:.25rem .65rem;border-radius:8px;font-size:.77rem;font-weight:500;}
.prog-bar{height:5px;background:var(--gp);border-radius:3px;margin-bottom:.55rem;overflow:hidden;}
.prog-fill{height:100%;background:var(--g3);border-radius:3px;transition:width .6s;}
.prog-steps{display:flex;justify-content:space-between;font-size:.65rem;color:var(--tl);}
.prog-steps span.dn{color:var(--g3);font-weight:700;}
.ofoot{display:flex;justify-content:space-between;align-items:center;margin-top:.85rem;padding-top:.85rem;border-top:1px solid var(--gp);}
.ototal{font-weight:700;color:var(--g2);}
.kargo-info{font-size:.75rem;color:var(--tl);margin-top:.3rem;}
.kargo-kod{background:var(--gm);border:1.5px solid var(--gp);border-radius:8px;padding:.4rem .75rem;font-size:.78rem;font-weight:600;color:var(--g2);font-family:monospace;}

/* FARMER PANEL */
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

/* ADMIN PANEL */
.admin-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:1.3rem;}
.admin-stat{background:var(--g2);color:#fff;border-radius:16px;padding:1.2rem;text-align:center;}
.admin-stat .n{font-size:2rem;font-weight:700;font-family:'Playfair Display',serif;}
.admin-stat .l{font-size:.78rem;opacity:.75;margin-top:.2rem;}
.farmer-list{display:flex;flex-direction:column;gap:.65rem;}
.farmer-row{background:#fff;border-radius:12px;padding:.9rem 1.1rem;display:flex;align-items:center;gap:.9rem;box-shadow:0 2px 8px var(--sh);}
.farmer-row-info{flex:1;}
.farmer-row-name{font-weight:700;font-size:.92rem;}
.farmer-row-detail{font-size:.78rem;color:var(--tl);}
.appr-btn{background:var(--g4);color:var(--g2);border:none;padding:.35rem .8rem;border-radius:8px;cursor:pointer;font-weight:700;font-size:.76rem;transition:background .2s;}
.appr-btn:hover{background:var(--g3);color:#fff;}
.rej-btn{background:#fee;color:var(--red);border:2px solid var(--red);padding:.35rem .8rem;border-radius:8px;cursor:pointer;font-weight:700;font-size:.76rem;}
.approved{background:var(--gm);color:var(--g3);font-size:.75rem;font-weight:700;padding:.3rem .7rem;border-radius:8px;}

/* PROFILE */
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

/* TOAST */
.toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--g1);color:#fff;padding:.72rem 1.5rem;border-radius:14px;font-weight:600;font-size:.88rem;box-shadow:0 8px 32px rgba(0,0,0,.22);z-index:1000;animation:tin .3s ease;white-space:nowrap;max-width:90vw;text-align:center;}
@keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

/* UTILS */
.btn-green{background:var(--g3);color:#fff;border:none;padding:.75rem 1.2rem;border-radius:12px;font-weight:600;cursor:pointer;transition:background .2s;font-size:.9rem;}
.btn-green:hover{background:var(--g2);}
.divider{border:none;border-top:1px solid var(--gp);margin:1rem 0;}
`;

/* ─── DATA ───────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: 'Domates',
    emoji: '🍅',
    farmer: 'Ahmet Usta',
    fid: 1,
    loc: 'Antalya',
    price: 8,
    unit: 'kg',
    cat: 'Sebze',
    org: true,
    rating: 4.8,
    reviews: 34,
  },
  {
    id: 2,
    name: 'Yeşil Biber',
    emoji: '🫑',
    farmer: 'Fatma Hanım',
    fid: 2,
    loc: 'Mersin',
    price: 12,
    unit: 'kg',
    cat: 'Sebze',
    org: false,
    rating: 4.5,
    reviews: 21,
  },
  {
    id: 3,
    name: 'Patlıcan',
    emoji: '🍆',
    farmer: 'Mehmet Bey',
    fid: 3,
    loc: 'Adana',
    price: 10,
    unit: 'kg',
    cat: 'Sebze',
    org: true,
    rating: 4.7,
    reviews: 18,
  },
  {
    id: 4,
    name: 'Elma',
    emoji: '🍎',
    farmer: 'Zeynep Hanım',
    fid: 4,
    loc: 'Isparta',
    price: 15,
    unit: 'kg',
    cat: 'Meyve',
    org: true,
    rating: 5.0,
    reviews: 52,
  },
  {
    id: 5,
    name: 'Portakal',
    emoji: '🍊',
    farmer: 'Ali Usta',
    fid: 5,
    loc: 'Adana',
    price: 9,
    unit: 'kg',
    cat: 'Meyve',
    org: false,
    rating: 4.3,
    reviews: 29,
  },
  {
    id: 6,
    name: 'Üzüm',
    emoji: '🍇',
    farmer: 'Hüseyin Bey',
    fid: 6,
    loc: 'Manisa',
    price: 18,
    unit: 'kg',
    cat: 'Meyve',
    org: true,
    rating: 4.9,
    reviews: 41,
  },
  {
    id: 7,
    name: 'Marul',
    emoji: '🥬',
    farmer: 'Fatma Hanım',
    fid: 2,
    loc: 'Mersin',
    price: 5,
    unit: 'adet',
    cat: 'Sebze',
    org: true,
    rating: 4.6,
    reviews: 15,
  },
  {
    id: 8,
    name: 'Bal',
    emoji: '🍯',
    farmer: 'Mustafa Bey',
    fid: 7,
    loc: 'Karadeniz',
    price: 120,
    unit: 'kg',
    cat: 'Diğer',
    org: true,
    rating: 5.0,
    reviews: 67,
  },
  {
    id: 9,
    name: 'Kabak',
    emoji: '🥒',
    farmer: 'Mehmet Bey',
    fid: 3,
    loc: 'Adana',
    price: 7,
    unit: 'kg',
    cat: 'Sebze',
    org: true,
    rating: 4.7,
    reviews: 9,
  },
  {
    id: 10,
    name: 'Çilek',
    emoji: '🍓',
    farmer: 'Zeynep Hanım',
    fid: 4,
    loc: 'Isparta',
    price: 25,
    unit: 'kg',
    cat: 'Meyve',
    org: true,
    rating: 4.9,
    reviews: 38,
  },
];

const FARMERS_DB = {
  1: {
    name: 'Ahmet Usta',
    emoji: '👨‍🌾',
    loc: 'Antalya',
    about:
      '30 yıldır domates yetiştiriyorum. Tohumlarımı kendim saklıyor, hiç kimyasal kullanmıyorum. Ürünlerimi sabah erkenden topluyorum, aynı gün yola çıkıyor.',
    rating: 4.8,
    sales: 1240,
    since: '1994',
    tags: ['Organik', 'Sertifikalı', 'Hızlı Teslimat'],
    verified: true,
    reviews: [
      {
        user: 'Ayşe K.',
        stars: 5,
        text: 'Domatesler gerçekten tarladan gelmiş gibi, süpermarket domatesiyle kıyaslanamaz!',
      },
      {
        user: 'Can M.',
        stars: 5,
        text: 'Paketleme çok özenli, hiçbiri ezilmemiş. Kesinlikle tavsiye ederim.',
      },
    ],
  },
  2: {
    name: 'Fatma Hanım',
    emoji: '👩‍🌾',
    loc: 'Mersin',
    about:
      'Aile çiftliğimizde 3 nesildir sebze yetiştiriyoruz. Biber ve marulda uzmanız.',
    rating: 4.6,
    sales: 892,
    since: '2003',
    tags: ['Aile Çiftliği', 'Taze', 'Uygun Fiyat'],
    verified: true,
    reviews: [
      { user: 'Mert Y.', stars: 4, text: 'Biberler çok tazeydi, teşekkürler.' },
      {
        user: 'Elif T.',
        stars: 5,
        text: 'Marullar harika, haftaya da sipariş vereceğim!',
      },
    ],
  },
  3: {
    name: 'Mehmet Bey',
    emoji: '🧑‍🌾',
    loc: 'Adana',
    about: 'Patlıcan ve kabak konusunda uzmanım. Adana toprağı çok verimli.',
    rating: 4.7,
    sales: 654,
    since: '2010',
    tags: ['Organik', 'Yerel Tohumlar'],
    verified: false,
    reviews: [
      { user: 'Hande A.', stars: 5, text: 'Patlıcanlar etli ve lezzetliydi!' },
      { user: 'Burak S.', stars: 4, text: 'Hızlı teslimat, taze ürün.' },
    ],
  },
  4: {
    name: 'Zeynep Hanım',
    emoji: '👩‍🌾',
    loc: 'Isparta',
    about:
      "Isparta'nın meşhur elmaları ve çileklerini yetiştiriyorum. Her birini elle topluyoruz.",
    rating: 4.9,
    sales: 2100,
    since: '1998',
    tags: ['Organik', 'El Hasadı', 'Sertifikalı'],
    verified: true,
    reviews: [
      {
        user: 'Selin K.',
        stars: 5,
        text: 'Elmalar müthiş, marketten alamazsınız böylesini!',
      },
      {
        user: 'Ozan B.',
        stars: 5,
        text: 'Çilekler fevkalade, her hafta sipariş veriyorum.',
      },
    ],
  },
};

const FARMERS_PENDING = [
  {
    id: 8,
    name: 'Kadir Bey',
    emoji: '👨‍🌾',
    loc: 'Konya',
    products: 'Buğday, Nohut',
    phone: '0532 111 2233',
    status: 'pending',
  },
  {
    id: 9,
    name: 'Selma Hanım',
    emoji: '👩‍🌾',
    loc: 'Bursa',
    products: 'Şeftali, Erik',
    phone: '0544 333 4455',
    status: 'pending',
  },
];

const CONVOS_INIT = {
  1: [
    { from: 'them', text: 'Merhaba! Domates siparişinizi aldım 🍅' },
    { from: 'me', text: 'Teşekkürler! Ne zaman hazır olur?' },
    {
      from: 'them',
      text: "Yarın sabah kargoya veriyorum, takip kodunu WhatsApp'tan göndereceğim 🚚",
    },
  ],
  2: [
    { from: 'me', text: 'Biber organik mi?' },
    {
      from: 'them',
      text: 'Evet, organik sertifikalıyız 🌿 Doğrulamalı çiftçiyiz.',
    },
  ],
  3: [
    { from: 'me', text: '5 kg patlıcan ne kadar?' },
    {
      from: 'them',
      text: '5 kg için 45₺ yapabilirim, kargo dahil mi istersiniz?',
    },
  ],
};

const MSGS_INIT = [
  {
    id: 1,
    name: 'Ahmet Usta',
    emoji: '👨‍🌾',
    prev: 'Yarın sabah kargoya veriyorum',
    time: '09:12',
    unread: 1,
  },
  {
    id: 2,
    name: 'Fatma Hanım',
    emoji: '👩‍🌾',
    prev: 'Evet, organik sertifikalıyız',
    time: 'Dün',
    unread: 0,
  },
  {
    id: 3,
    name: 'Mehmet Bey',
    emoji: '🧑‍🌾',
    prev: '5 kg için 45₺ yapabilirim',
    time: 'Pzt',
    unread: 2,
  },
];

const ORDERS_INIT = [
  {
    id: '#CF2041',
    items: ['🍅 Domates 3kg', '🥬 Marul 2 adet'],
    farmer: 'Ahmet Usta',
    total: 49,
    status: 2,
    date: '3 Mayıs',
    kargo: 'Yurtiçi Kargo',
    kod: 'YK38291047',
    addr: 'Seyhan, Adana',
  },
  {
    id: '#CF2038',
    items: ['🍎 Elma 5kg'],
    farmer: 'Zeynep Hanım',
    total: 100,
    status: 3,
    date: '28 Nisan',
    kargo: 'Ücretsiz (Öz Kurye)',
    kod: 'OZ10284',
    addr: 'Çukurova, Adana',
  },
];

const SL = ['Sipariş Alındı', 'Çiftçi Onayladı', 'Kargoda', 'Teslim Edildi'];
const SC = ['s0', 's1', 's2', 's3'];

function Stars({ n }) {
  return (
    <span className="stars">
      {'★'.repeat(Math.round(n))}
      {'☆'.repeat(5 - Math.round(n))} {n?.toFixed(1)}
    </span>
  );
}

/* ─── KARGO HESAPLAMA ───────────────────────────────────────────── */
function calcKargo(total, type) {
  if (total >= 300) return 0;
  if (type === 'oz') return 20;
  if (type === 'yurtici') return 30;
  return 25;
}

/* ─── APP ────────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [role, setRole] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authRole, setAuthRole] = useState('buyer');
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('market');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tümü');
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const [convos, setConvos] = useState(CONVOS_INIT);
  const [orders, setOrders] = useState(ORDERS_INIT);
  const [farmerView, setFarmerView] = useState(null);
  const [pendingFarmers, setPendingFarmers] = useState(FARMERS_PENDING);
  const [newProd, setNewProd] = useState({
    name: '',
    price: '',
    unit: 'kg',
    emoji: '🌱',
    cat: 'Sebze',
    stock: '',
  });
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
  });
  const [kargoType, setKargoType] = useState('yurtici');
  const [addr, setAddr] = useState({
    street: '',
    district: '',
    city: '',
    note: '',
  });
  const [ratingInput, setRatingInput] = useState({});
  const [reviewText, setReviewText] = useState({});
  const endRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convos, activeChat]);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const kargoBedel = calcKargo(cartTotal, kargoType);

  const handleAuth = () => {
    if (authMode === 'register' && !form.name) {
      showToast('İsim girin!');
      return;
    }
    if (!form.email || !form.password) {
      showToast('Tüm alanları doldurun!');
      return;
    }
    const u = {
      name: form.name || 'Kullanıcı',
      email: form.email,
      role: authRole,
      emoji: authRole === 'buyer' ? '🛒' : authRole === 'farmer' ? '👨‍🌾' : '⚙️',
      phone: form.phone || '—',
      city: form.city || 'Adana',
      verified: authRole === 'farmer' ? false : true,
    };
    setUser(u);
    setRole(authRole);
    setTab(
      authRole === 'farmer'
        ? 'panel'
        : authRole === 'admin'
        ? 'admin'
        : 'market'
    );
    setScreen('app');
    showToast(`Hoş geldin, ${u.name}! 🌿`);
  };

  const addToCart = (p) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex)
        return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
    showToast(`${p.emoji} ${p.name} sepete eklendi!`);
  };

  const updateQty = (id, d) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + d } : i))
        .filter((i) => i.qty > 0)
    );

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    setConvos((prev) => ({
      ...prev,
      [activeChat]: [
        ...(prev[activeChat] || []),
        { from: 'me', text: chatMsg },
      ],
    }));
    setChatMsg('');
    setTimeout(
      () =>
        setConvos((prev) => ({
          ...prev,
          [activeChat]: [
            ...prev[activeChat],
            { from: 'them', text: 'Mesajınız için teşekkürler! 🌿' },
          ],
        })),
      1000
    );
  };

  const placeOrder = () => {
    if (!addr.street || !addr.city) {
      showToast('Lütfen teslimat adresini doldurun!');
      return;
    }
    const kargoLabel =
      kargoType === 'oz' ? 'Öz Kurye (Kısa Mesafe)' : 'Yurtiçi Kargo';
    const kod =
      kargoType === 'oz'
        ? `OZ${Math.floor(10000 + Math.random() * 90000)}`
        : `YK${Math.floor(10000000 + Math.random() * 90000000)}`;
    const o = {
      id: `#CF${2042 + orders.length}`,
      items: cart.map((i) => `${i.emoji} ${i.name} ${i.qty}${i.unit}`),
      farmer: cart[0]?.farmer || 'Çiftçi',
      total: cartTotal + kargoBedel,
      status: 0,
      date: 'Bugün',
      kargo: kargoLabel,
      kod,
      addr: `${addr.district}, ${addr.city}`,
    };
    setOrders((prev) => [o, ...prev]);
    setCart([]);
    showToast('🎉 Siparişiniz alındı! Çiftçi onaylayacak.');
    setTab('orders');
  };

  const approveFarmer = (id) => {
    setPendingFarmers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'approved' } : f))
    );
    showToast('✅ Çiftçi onaylandı ve platforma eklendi!');
  };

  const rejectFarmer = (id) => {
    setPendingFarmers((prev) => prev.filter((f) => f.id !== id));
    showToast('❌ Çiftçi reddedildi.');
  };

  const filtered = PRODUCTS.filter((p) => {
    const ms =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.farmer.toLowerCase().includes(search.toLowerCase());
    const mf =
      filter === 'Tümü' || p.cat === filter || (filter === 'Organik' && p.org);
    return ms && mf;
  });

  /* ── SPLASH ── */
  if (screen === 'splash')
    return (
      <>
        <style>{CSS}</style>
        <div className="splash">
          <span className="splash-leaf">🌿</span>
          <div className="splash-title">
            Çiftçiden <em>Al</em>
          </div>
          <div className="splash-sub">
            Tarladan sofrana · Aracısız · Taze · Dürüst
          </div>
          <div className="role-cards">
            <div
              className="role-card"
              onClick={() => {
                setAuthRole('buyer');
                setScreen('auth');
              }}
            >
              <span className="icon">🛒</span>
              <h3>Alıcıyım</h3>
              <p>Taze ürünü direkt çiftçiden, uygun fiyata al</p>
            </div>
            <div
              className="role-card"
              onClick={() => {
                setAuthRole('farmer');
                setScreen('auth');
              }}
            >
              <span className="icon">👨‍🌾</span>
              <h3>Çiftçiyim</h3>
              <p>Ürünlerini listele, aracısız daha fazla kazan</p>
            </div>
          </div>
          <span
            className="admin-link"
            onClick={() => {
              setAuthRole('admin');
              setScreen('auth');
            }}
          >
            Yönetici Girişi
          </span>
        </div>
      </>
    );

  /* ── AUTH ── */
  if (screen === 'auth')
    return (
      <>
        <style>{CSS}</style>
        <div className="auth-wrap">
          <div className="auth-card">
            <div className="auth-logo">
              🌿 Çiftçiden <em>Al</em>
            </div>
            <div className="auth-sub">
              {authRole === 'admin'
                ? 'Yönetici Paneli'
                : 'Tarladan sofrana, aracısız'}
            </div>
            {authRole !== 'admin' && (
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => setAuthMode('login')}
                >
                  Giriş Yap
                </button>
                <button
                  className={`auth-tab ${
                    authMode === 'register' ? 'active' : ''
                  }`}
                  onClick={() => setAuthMode('register')}
                >
                  Kayıt Ol
                </button>
              </div>
            )}
            {authMode === 'register' && authRole !== 'admin' && (
              <>
                <div
                  style={{
                    fontSize: '.8rem',
                    fontWeight: 600,
                    color: 'var(--tm)',
                    marginBottom: '.45rem',
                  }}
                >
                  Hesap türü
                </div>
                <div className="role-row">
                  <div
                    className={`role-opt ${
                      authRole === 'buyer' ? 'active' : ''
                    }`}
                    onClick={() => setAuthRole('buyer')}
                  >
                    🛒 Alıcı
                  </div>
                  <div
                    className={`role-opt ${
                      authRole === 'farmer' ? 'active' : ''
                    }`}
                    onClick={() => setAuthRole('farmer')}
                  >
                    👨‍🌾 Çiftçi
                  </div>
                </div>
                {authRole === 'farmer' && (
                  <div className="note-box">
                    📋 Çiftçi kaydında bilgileriniz admin tarafından
                    doğrulanacak. Onaylandıktan sonra ürün ekleyebilirsiniz.
                  </div>
                )}
                <div className="field">
                  <label>Ad Soyad</label>
                  <input
                    className="inp"
                    placeholder="Adınız Soyadınız"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Telefon</label>
                  <input
                    className="inp"
                    placeholder="05XX XXX XX XX"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Şehir</label>
                  <input
                    className="inp"
                    placeholder="Adana"
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                  />
                </div>
              </>
            )}
            <div className="field">
              <label>E-posta</label>
              <input
                className="inp"
                placeholder="ornek@mail.com"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Şifre</label>
              <input
                className="inp"
                placeholder="••••••••"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            </div>
            <button className="auth-btn" onClick={handleAuth}>
              {authRole === 'admin'
                ? 'Yönetici Olarak Giriş →'
                : authMode === 'login'
                ? 'Giriş Yap →'
                : 'Kayıt Ol →'}
            </button>
            <span className="auth-back" onClick={() => setScreen('splash')}>
              ← Geri dön
            </span>
          </div>
        </div>
      </>
    );

  /* ── MAIN APP ── */
  const buyerTabs = [
    { key: 'market', label: '🛒 Market' },
    { key: 'map', label: '🗺️ Harita' },
    { key: 'messages', label: '💬 Mesajlar' },
    { key: 'orders', label: '📦 Siparişler' },
    { key: 'cart', label: `🧺${cartCount > 0 ? ` (${cartCount})` : ''}` },
    { key: 'profile', label: '👤 Profil' },
  ];
  const farmerTabs = [
    { key: 'panel', label: '📊 Panel' },
    { key: 'market', label: '📦 Ürünler' },
    { key: 'messages', label: '💬 Mesajlar' },
    { key: 'profile', label: '👤 Profil' },
  ];
  const adminTabs = [
    { key: 'admin', label: '⚙️ Dashboard' },
    { key: 'farmers', label: '👨‍🌾 Çiftçiler' },
    { key: 'orders-admin', label: '📦 Siparişler' },
    { key: 'market', label: '🛒 Market' },
  ];
  const allTabs =
    role === 'buyer' ? buyerTabs : role === 'farmer' ? farmerTabs : adminTabs;

  return (
    <>
      <style>{CSS}</style>
      <div
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* NAV */}
        <nav className="nav">
          <div
            className="nav-logo"
            onClick={() => {
              setTab(
                role === 'buyer'
                  ? 'market'
                  : role === 'farmer'
                  ? 'panel'
                  : 'admin'
              );
              setFarmerView(null);
            }}
          >
            🌿 Çiftçiden <em>Al</em>
          </div>
          <div className="nav-center">
            <span className="nbadge">
              {role === 'buyer'
                ? 'Alıcı'
                : role === 'farmer'
                ? 'Çiftçi'
                : 'Admin'}
            </span>
            {role === 'farmer' && user?.verified && (
              <span className="vbadge">✓ Doğrulandı</span>
            )}
            <span className="nav-user">{user?.name}</span>
          </div>
          <div className="nav-actions">
            {role === 'buyer' && (
              <button className="nbtn" onClick={() => setTab('cart')}>
                🧺{cartCount > 0 && <span className="bdg">{cartCount}</span>}
              </button>
            )}
            <button
              className="nbtn"
              onClick={() => {
                setScreen('splash');
                setUser(null);
                setRole(null);
                setCart([]);
                setFarmerView(null);
              }}
            >
              Çıkış
            </button>
          </div>
        </nav>

        {/* TABS */}
        <div className="tabs">
          {allTabs.map((t) => (
            <button
              key={t.key}
              className={`tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => {
                setTab(t.key);
                setActiveChat(null);
                setFarmerView(null);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="main">
          {/* ── MARKET ── */}
          {tab === 'market' && !farmerView && (
            <>
              <div className="sh2">
                <h2>Taze Ürünler</h2>
                <p>Çiftçilerden direkt, aracısız ve taze</p>
              </div>
              <div className="srow">
                <input
                  className="sinp"
                  placeholder="🔍 Ürün veya çiftçi ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="pills">
                {['Tümü', 'Sebze', 'Meyve', 'Organik', 'Diğer'].map((f) => (
                  <button
                    key={f}
                    className={`pill ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="pgrid">
                {filtered.map((p) => (
                  <div key={p.id} className="pcard">
                    <div className="pimg">
                      {p.emoji}
                      {p.org && <span className="org-dot">🌱 Org</span>}
                      {FARMERS_DB[p.fid]?.verified && (
                        <span className="vrf-dot">✓</span>
                      )}
                    </div>
                    <div className="pinfo">
                      <Stars n={p.rating} />
                      <div className="pname">{p.name}</div>
                      <div
                        className="pfarmer"
                        onClick={() => {
                          if (FARMERS_DB[p.fid]) setFarmerView(p.fid);
                        }}
                      >
                        👨‍🌾 {p.farmer}
                      </div>
                      <div className="ploc">📍 {p.loc}</div>
                      <div className="pfoot">
                        <div>
                          <span className="pp">{p.price}₺</span>
                          <span className="pu"> /{p.unit}</span>
                        </div>
                        {role !== 'admin' && (
                          <button
                            className="addbtn"
                            onClick={() => addToCart(p)}
                          >
                            + Ekle
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── FARMER PROFILE ── */}
          {tab === 'market' &&
            farmerView &&
            (() => {
              const f = FARMERS_DB[farmerView];
              if (!f) return null;
              return (
                <>
                  <button
                    className="back-btn"
                    onClick={() => setFarmerView(null)}
                  >
                    ← Geri
                  </button>
                  <div className="fp-wrap">
                    <div className="fp-hdr">
                      <div className="fp-av">{f.emoji}</div>
                      <div>
                        <div className="fp-name">
                          {f.name}{' '}
                          {f.verified && (
                            <span
                              style={{
                                fontSize: '.7rem',
                                background: 'var(--gold)',
                                color: '#fff',
                                padding: '.12rem .45rem',
                                borderRadius: '6px',
                                marginLeft: '.4rem',
                              }}
                            >
                              ✓ Doğrulandı
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            opacity: 0.82,
                            fontSize: '.88rem',
                            margin: '.2rem 0',
                          }}
                        >
                          📍 {f.loc} · {f.since}'den beri
                        </div>
                        <div className="fp-tags">
                          {f.tags.map((t) => (
                            <span key={t} className="fp-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="fp-body">
                      <div className="fp-stats">
                        <div className="fp-stat">
                          <div className="fp-sn">{f.rating}</div>
                          <div className="fp-sl">⭐ Puan</div>
                        </div>
                        <div className="fp-stat">
                          <div className="fp-sn">{f.sales}</div>
                          <div className="fp-sl">Toplam Satış</div>
                        </div>
                        <div className="fp-stat">
                          <div className="fp-sn">
                            {new Date().getFullYear() - parseInt(f.since)}
                          </div>
                          <div className="fp-sl">Yıl Deneyim</div>
                        </div>
                      </div>
                      <div className="fp-about">{f.about}</div>
                      <h4
                        style={{
                          fontFamily: "'Playfair Display',serif",
                          color: 'var(--g2)',
                          marginBottom: '.7rem',
                        }}
                      >
                        Müşteri Yorumları
                      </h4>
                      <div className="rev-list">
                        {f.reviews.map((r, i) => (
                          <div key={i} className="rev">
                            <div className="rev-top">
                              <span className="rev-user">👤 {r.user}</span>
                              <span className="stars">
                                {'★'.repeat(r.stars)}
                              </span>
                            </div>
                            <div className="rev-text">{r.text}</div>
                          </div>
                        ))}
                      </div>
                      {/* Yorum ekle */}
                      <div
                        style={{
                          background: 'var(--gm)',
                          borderRadius: '12px',
                          padding: '1rem',
                          marginTop: '.8rem',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '.88rem',
                            marginBottom: '.6rem',
                          }}
                        >
                          Yorum Yaz
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '.3rem',
                            marginBottom: '.6rem',
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              style={{
                                fontSize: '1.4rem',
                                cursor: 'pointer',
                                color:
                                  (ratingInput[farmerView] || 0) >= s
                                    ? 'var(--orange)'
                                    : 'var(--gp)',
                              }}
                              onClick={() =>
                                setRatingInput((r) => ({
                                  ...r,
                                  [farmerView]: s,
                                }))
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <input
                          className="inp"
                          placeholder="Deneyiminizi paylaşın..."
                          value={reviewText[farmerView] || ''}
                          onChange={(e) =>
                            setReviewText((r) => ({
                              ...r,
                              [farmerView]: e.target.value,
                            }))
                          }
                          style={{ marginBottom: '.6rem' }}
                        />
                        <button
                          className="btn-green"
                          style={{ width: '100%' }}
                          onClick={() => {
                            if (reviewText[farmerView]) {
                              showToast('✅ Yorumunuz eklendi, teşekkürler!');
                              setReviewText((r) => ({
                                ...r,
                                [farmerView]: '',
                              }));
                            } else showToast('Lütfen yorum yazın!');
                          }}
                        >
                          Yorum Gönder
                        </button>
                      </div>
                      <button
                        className="subbtn"
                        style={{ marginTop: '1rem', width: '100%' }}
                        onClick={() => {
                          setActiveChat(1);
                          setTab('messages');
                        }}
                      >
                        💬 Çiftçiye Mesaj Gönder
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}

          {/* ── MAP ── */}
          {tab === 'map' && (
            <>
              <div className="sh2">
                <h2>Çiftçi Haritası</h2>
                <p>Yakınındaki çiftçileri keşfet</p>
              </div>
              <div className="map-box">
                <div className="map-hdr">
                  <h3>🗺️ Türkiye Geneli</h3>
                  <span style={{ fontSize: '.8rem', color: 'var(--tl)' }}>
                    7 aktif çiftçi
                  </span>
                </div>
                <div className="map-vis">
                  <div className="map-grid" />
                  {[
                    { top: '22%', left: '28%', n: 'Ahmet Usta', fid: 1 },
                    { top: '48%', left: '62%', n: 'Fatma H.', fid: 2 },
                    { top: '32%', left: '72%', n: 'Mehmet B.', fid: 3 },
                    { top: '18%', left: '45%', n: 'Zeynep H.', fid: 4 },
                    { top: '15%', left: '55%', n: 'Ali Usta', fid: null },
                    { top: '60%', left: '32%', n: 'Hüseyin B.', fid: null },
                    { top: '12%', left: '68%', n: 'Mustafa B.', fid: null },
                  ].map((p, i) => (
                    <div
                      key={i}
                      className="mpin"
                      style={{ top: p.top, left: p.left }}
                      onClick={() => {
                        if (p.fid) {
                          setFarmerView(p.fid);
                          setTab('market');
                        }
                      }}
                    >
                      <span className="mpin-i">📍</span>
                      <div className="mpin-l">{p.n}</div>
                    </div>
                  ))}
                </div>
                <div className="map-leg">
                  <div className="leg-i">📍 Çiftçi konumu</div>
                  <div className="leg-i">🌿 Organik</div>
                  <div className="leg-i" style={{ color: 'var(--gold)' }}>
                    ✓ Doğrulanmış
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: '.84rem',
                  color: 'var(--tl)',
                  textAlign: 'center',
                }}
              >
                İkona tıklayarak çiftçi profilini görüntüle
              </div>
            </>
          )}

          {/* ── MESSAGES ── */}
          {tab === 'messages' && (
            <>
              {!activeChat ? (
                <>
                  <div className="sh2">
                    <h2>Mesajlar</h2>
                    <p>Çiftçilerle direkt iletişim</p>
                  </div>
                  <div className="msg-list">
                    {MSGS_INIT.map((m) => (
                      <div
                        key={m.id}
                        className="msg-item"
                        onClick={() => setActiveChat(m.id)}
                      >
                        <div className="mav">{m.emoji}</div>
                        <div className="mif">
                          <div className="mn">{m.name}</div>
                          <div className="mp">{m.prev}</div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '.3rem',
                          }}
                        >
                          <span className="mt">{m.time}</span>
                          {m.unread > 0 && (
                            <span className="mu">{m.unread}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="chat-win">
                  <div className="chat-hdr">
                    <button className="cbk" onClick={() => setActiveChat(null)}>
                      ←
                    </button>
                    <span style={{ fontSize: '1.3rem' }}>
                      {MSGS_INIT.find((m) => m.id === activeChat)?.emoji}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {MSGS_INIT.find((m) => m.id === activeChat)?.name}
                      </div>
                      <div style={{ fontSize: '.75rem', opacity: 0.8 }}>
                        🟢 Çevrimiçi
                      </div>
                    </div>
                    <button
                      className="nbtn"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => {
                        const n = MSGS_INIT.find(
                          (m) => m.id === activeChat
                        )?.name;
                        window.open(
                          `https://wa.me/?text=Merhaba ${n}, Çiftçiden Al uygulamasından yazıyorum.`,
                          '_blank'
                        );
                      }}
                    >
                      📱 WhatsApp
                    </button>
                  </div>
                  <div className="chat-msgs">
                    {(convos[activeChat] || []).map((msg, i) => (
                      <div key={i} className={`bbl ${msg.from}`}>
                        {msg.text}
                      </div>
                    ))}
                    <div ref={endRef} />
                  </div>
                  <div className="chat-inp-row">
                    <input
                      className="ci"
                      placeholder="Mesajınızı yazın..."
                      value={chatMsg}
                      onChange={(e) => setChatMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                    />
                    <button className="sbtn" onClick={sendMsg}>
                      ➤
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── ORDERS (Alıcı) ── */}
          {tab === 'orders' && (
            <>
              <div className="sh2">
                <h2>Siparişlerim</h2>
                <p>Tüm siparişlerini takip et</p>
              </div>
              <div className="orders-list">
                {orders.map((o) => {
                  const pct = [0, 33, 66, 100][o.status];
                  return (
                    <div key={o.id} className="ocard">
                      <div className="otop">
                        <div>
                          <div className="oid">
                            {o.id} · {o.date}
                          </div>
                          <div
                            style={{
                              fontSize: '.82rem',
                              color: 'var(--tl)',
                              marginTop: '.18rem',
                            }}
                          >
                            👨‍🌾 {o.farmer}
                          </div>
                        </div>
                        <span className={`ostatus ${SC[o.status]}`}>
                          {SL[o.status]}
                        </span>
                      </div>
                      <div className="oitems">
                        {o.items.map((it, i) => (
                          <span key={i} className="otag">
                            {it}
                          </span>
                        ))}
                      </div>
                      <div className="prog-bar">
                        <div
                          className="prog-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="prog-steps">
                        {SL.map((l, i) => (
                          <span key={i} className={i <= o.status ? 'dn' : ''}>
                            {l}
                          </span>
                        ))}
                      </div>
                      <div className="ofoot">
                        <div>
                          <div className="ototal">{o.total}₺</div>
                          <div className="kargo-info">🚚 {o.kargo}</div>
                          {o.status >= 2 && (
                            <div
                              style={{
                                marginTop: '.4rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '.5rem',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '.75rem',
                                  color: 'var(--tl)',
                                }}
                              >
                                Takip Kodu:
                              </span>
                              <span className="kargo-kod">{o.kod}</span>
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: '.73rem',
                              color: 'var(--tl)',
                              marginTop: '.2rem',
                            }}
                          >
                            📍 {o.addr}
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '.4rem',
                          }}
                        >
                          <button
                            className="nbtn"
                            style={{
                              background: 'var(--gm)',
                              color: 'var(--g2)',
                            }}
                            onClick={() => {
                              setActiveChat(1);
                              setTab('messages');
                            }}
                          >
                            💬 Çiftçiye Sor
                          </button>
                          {o.status === 3 && (
                            <button
                              className="nbtn"
                              style={{
                                background: 'var(--g4)',
                                color: 'var(--g2)',
                              }}
                              onClick={() =>
                                showToast('Tekrar sipariş sepete eklendi!')
                              }
                            >
                              🔄 Tekrar Sipariş
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── CART ── */}
          {tab === 'cart' && (
            <>
              <div className="sh2">
                <h2>Sepetim</h2>
              </div>
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div style={{ fontSize: '4rem', marginBottom: '.9rem' }}>
                    🧺
                  </div>
                  <p style={{ fontWeight: 600 }}>Sepetiniz boş</p>
                  <p
                    style={{
                      fontSize: '.83rem',
                      marginTop: '.45rem',
                      color: 'var(--tl)',
                    }}
                  >
                    Marketten ürün ekleyin
                  </p>
                  <button
                    className="addbtn"
                    style={{ marginTop: '.9rem', padding: '.6rem 1.2rem' }}
                    onClick={() => setTab('market')}
                  >
                    Markete Git →
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="citem">
                        <div className="cicn">{item.emoji}</div>
                        <div className="cii">
                          <div className="cin">{item.name}</div>
                          <div className="cif">👨‍🌾 {item.farmer}</div>
                        </div>
                        <div className="qc">
                          <button
                            className="qb"
                            onClick={() => updateQty(item.id, -1)}
                          >
                            −
                          </button>
                          <span
                            style={{
                              fontWeight: 700,
                              minWidth: '18px',
                              textAlign: 'center',
                            }}
                          >
                            {item.qty}
                          </span>
                          <button
                            className="qb"
                            onClick={() => updateQty(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="cpr">{item.price * item.qty}₺</div>
                      </div>
                    ))}
                  </div>

                  {/* KARGO SEÇİMİ */}
                  <div className="cargo-box">
                    <h4>🚚 Teslimat Yöntemi</h4>
                    {cartTotal >= 300 && (
                      <div
                        style={{
                          background: 'var(--g4)',
                          color: 'var(--g2)',
                          borderRadius: '10px',
                          padding: '.6rem .9rem',
                          fontSize: '.85rem',
                          fontWeight: 600,
                          marginBottom: '.75rem',
                        }}
                      >
                        🎉 300₺ üzeri siparişte kargo ücretsiz!
                      </div>
                    )}
                    <div className="cargo-opts">
                      <div
                        className={`cargo-opt ${
                          kargoType === 'oz' ? 'sel' : ''
                        }`}
                        onClick={() => setKargoType('oz')}
                      >
                        <h5>🛵 Öz Kurye</h5>
                        <p>Kısa mesafe, aynı gün teslim. Şehir içi.</p>
                        <div className="cprice">
                          {cartTotal >= 300 ? (
                            <>
                              Ücretsiz{' '}
                              <span className="free-badge">ÜCRETSİZ</span>
                            </>
                          ) : (
                            '20₺'
                          )}
                        </div>
                      </div>
                      <div
                        className={`cargo-opt ${
                          kargoType === 'yurtici' ? 'sel' : ''
                        }`}
                        onClick={() => setKargoType('yurtici')}
                      >
                        <h5>📦 Yurtiçi Kargo</h5>
                        <p>Uzak mesafe, 1-3 iş günü teslim.</p>
                        <div className="cprice">
                          {cartTotal >= 300 ? (
                            <>
                              Ücretsiz{' '}
                              <span className="free-badge">ÜCRETSİZ</span>
                            </>
                          ) : (
                            '30₺'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ADRES */}
                  <div className="addr-box">
                    <h4>📍 Teslimat Adresi</h4>
                    <div className="addr-row">
                      <input
                        className="addr-inp"
                        placeholder="Sokak / Cadde / Mahalle"
                        value={addr.street}
                        onChange={(e) =>
                          setAddr((a) => ({ ...a, street: e.target.value }))
                        }
                      />
                    </div>
                    <div className="addr-row">
                      <input
                        className="addr-inp"
                        placeholder="İlçe"
                        value={addr.district}
                        onChange={(e) =>
                          setAddr((a) => ({ ...a, district: e.target.value }))
                        }
                      />
                      <input
                        className="addr-inp"
                        placeholder="Şehir"
                        value={addr.city}
                        onChange={(e) =>
                          setAddr((a) => ({ ...a, city: e.target.value }))
                        }
                      />
                    </div>
                    <input
                      className="addr-inp"
                      placeholder="Kapı notu (opsiyonel)"
                      value={addr.note}
                      onChange={(e) =>
                        setAddr((a) => ({ ...a, note: e.target.value }))
                      }
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* ÖZET */}
                  <div className="cart-sum">
                    <div className="sr">
                      <span>Ara toplam</span>
                      <span>{cartTotal}₺</span>
                    </div>
                    <div className="sr">
                      <span>Aracı komisyonu</span>
                      <span style={{ color: 'var(--g5)' }}>0₺ 🎉</span>
                    </div>
                    <div className="sr">
                      <span>
                        Kargo ({kargoType === 'oz' ? 'Öz Kurye' : 'Yurtiçi'})
                      </span>
                      <span>
                        {kargoBedel === 0 ? 'Ücretsiz ✓' : `${kargoBedel}₺`}
                      </span>
                    </div>
                    <div className="sdiv">
                      <div className="sr big">
                        <span>Toplam</span>
                        <span>{cartTotal + kargoBedel}₺</span>
                      </div>
                    </div>
                    <button className="ordbtn" onClick={placeOrder}>
                      Sipariş Ver 🌿
                    </button>
                    <button
                      className="wabtn"
                      onClick={() =>
                        window.open(
                          `https://wa.me/905001234567?text=Merhaba! Çiftçiden Al uygulamasından sipariş vermek istiyorum. Toplam: ${
                            cartTotal + kargoBedel
                          }₺`,
                          '_blank'
                        )
                      }
                    >
                      📱 WhatsApp ile Sipariş Ver
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── FARMER PANEL ── */}
          {tab === 'panel' && (
            <div className="fpanel">
              <div className="sh2">
                <h2>Çiftçi Paneliniz</h2>
                <p>
                  Hoş geldin, {user?.name}!{' '}
                  {user?.verified
                    ? '✅ Hesabınız doğrulandı.'
                    : '⏳ Hesabınız onay bekliyor.'}
                </p>
              </div>
              {!user?.verified && (
                <div
                  className="note-box"
                  style={{ borderColor: 'var(--orange)' }}
                >
                  ⏳ Hesabınız admin tarafından inceleniyor. Onaylandıktan sonra
                  ürün ekleyebileceksiniz.
                </div>
              )}
              <div className="pc">
                <h3>📊 Bu Ay Özet</h3>
                <div className="stat-row">
                  <div className="stb">
                    <div className="stn">12</div>
                    <div className="stl">Aktif Ürün</div>
                  </div>
                  <div className="stb">
                    <div className="stn">47</div>
                    <div className="stl">Sipariş</div>
                  </div>
                  <div className="stb">
                    <div className="stn">3.840₺</div>
                    <div className="stl">Kazanç</div>
                  </div>
                </div>
              </div>
              <div className="pc">
                <h3>➕ Yeni Ürün Ekle</h3>
                <div className="fc">
                  <div className="fr">
                    <input
                      className="fi"
                      placeholder="Emoji 🍅"
                      value={newProd.emoji}
                      onChange={(e) =>
                        setNewProd((p) => ({ ...p, emoji: e.target.value }))
                      }
                      style={{ maxWidth: '72px' }}
                    />
                    <input
                      className="fi"
                      placeholder="Ürün adı"
                      value={newProd.name}
                      onChange={(e) =>
                        setNewProd((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="fr">
                    <input
                      className="fi"
                      placeholder="Fiyat (₺)"
                      type="number"
                      value={newProd.price}
                      onChange={(e) =>
                        setNewProd((p) => ({ ...p, price: e.target.value }))
                      }
                    />
                    <input
                      className="fi"
                      placeholder="Birim (kg/adet)"
                      value={newProd.unit}
                      onChange={(e) =>
                        setNewProd((p) => ({ ...p, unit: e.target.value }))
                      }
                    />
                    <input
                      className="fi"
                      placeholder="Stok miktarı"
                      value={newProd.stock}
                      onChange={(e) =>
                        setNewProd((p) => ({ ...p, stock: e.target.value }))
                      }
                    />
                  </div>
                  <div className="fr">
                    <select
                      className="fsel"
                      value={newProd.cat}
                      onChange={(e) =>
                        setNewProd((p) => ({ ...p, cat: e.target.value }))
                      }
                    >
                      <option>Sebze</option>
                      <option>Meyve</option>
                      <option>Diğer</option>
                    </select>
                  </div>
                  <div
                    style={{
                      background: 'var(--gm)',
                      borderRadius: '10px',
                      padding: '.8rem',
                      fontSize: '.8rem',
                      color: 'var(--tm)',
                    }}
                  >
                    📸 Fotoğraf yükleme özelliği yakında eklenecek. Şimdilik
                    emoji kullanabilirsiniz.
                  </div>
                  <button
                    className="subbtn"
                    onClick={() => {
                      if (newProd.name && newProd.price) {
                        showToast(
                          `${newProd.emoji} ${newProd.name} listelendi!`
                        );
                        setNewProd({
                          name: '',
                          price: '',
                          unit: 'kg',
                          emoji: '🌱',
                          cat: 'Sebze',
                          stock: '',
                        });
                      } else showToast('Ürün adı ve fiyat girin!');
                    }}
                  >
                    Ürünü Listele 🌿
                  </button>
                </div>
              </div>
              <div className="pc">
                <h3>📦 Son Siparişler</h3>
                {[
                  {
                    name: 'Domates 5kg',
                    buyer: 'Ayşe H.',
                    st: 'Bekliyor',
                    price: '40₺',
                    stc: 's0',
                    kargo: 'Öz Kurye',
                  },
                  {
                    name: 'Biber 3kg',
                    buyer: 'Can B.',
                    st: 'Onaylandı',
                    price: '36₺',
                    stc: 's1',
                    kargo: 'Yurtiçi',
                  },
                  {
                    name: 'Patlıcan 2kg',
                    buyer: 'Mert Y.',
                    st: 'Teslim edildi',
                    price: '20₺',
                    stc: 's3',
                    kargo: 'Yurtiçi',
                  },
                ].map((o, i) => (
                  <div key={i} className="order-row">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '.88rem' }}>
                        {o.name}
                      </div>
                      <div style={{ fontSize: '.75rem', color: 'var(--tl)' }}>
                        👤 {o.buyer} · 🚚 {o.kargo}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.55rem',
                      }}
                    >
                      <span className={`ostatus ${o.stc}`}>{o.st}</span>
                      <span style={{ fontWeight: 700, color: 'var(--g2)' }}>
                        {o.price}
                      </span>
                      {o.st === 'Bekliyor' && (
                        <button
                          className="cnfbtn"
                          onClick={() =>
                            showToast(
                              '✅ Sipariş onaylandı! Kargo kodu oluşturuldu.'
                            )
                          }
                        >
                          Onayla
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pc">
                <h3>📱 WhatsApp Bildirimleri</h3>
                <p
                  style={{
                    fontSize: '.86rem',
                    color: 'var(--tm)',
                    marginBottom: '.9rem',
                    lineHeight: 1.6,
                  }}
                >
                  Yeni sipariş geldiğinde WhatsApp'tan anında bildirim al.
                  Numaranı ekle, hiçbir siparişi kaçırma!
                </p>
                <div className="fr">
                  <input
                    className="fi"
                    placeholder="WhatsApp numaranız"
                    type="tel"
                  />
                  <button
                    className="subbtn"
                    onClick={() =>
                      showToast('📱 WhatsApp bildirimleri aktif edildi!')
                    }
                  >
                    Aktif Et
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── ADMIN DASHBOARD ── */}
          {tab === 'admin' && (
            <>
              <div className="sh2">
                <h2>Admin Paneli</h2>
                <p>Platform genel durumu</p>
              </div>
              <div className="admin-grid">
                <div className="admin-stat">
                  <div className="n">36</div>
                  <div className="l">Toplam Kullanıcı</div>
                </div>
                <div className="admin-stat">
                  <div className="n">12</div>
                  <div className="l">Aktif Çiftçi</div>
                </div>
                <div className="admin-stat">
                  <div className="n">148</div>
                  <div className="l">Toplam Sipariş</div>
                </div>
                <div className="admin-stat">
                  <div className="n">2</div>
                  <div className="l">Onay Bekleyen</div>
                </div>
                <div className="admin-stat">
                  <div className="n">8.240₺</div>
                  <div className="l">Bu Ay Ciro</div>
                </div>
                <div className="admin-stat">
                  <div className="n">4.8⭐</div>
                  <div className="l">Ort. Memnuniyet</div>
                </div>
              </div>
              {pendingFarmers.filter((f) => f.status === 'pending').length >
                0 && (
                <>
                  <div className="pc">
                    <h3>⏳ Onay Bekleyen Çiftçiler</h3>
                    <div className="farmer-list">
                      {pendingFarmers
                        .filter((f) => f.status === 'pending')
                        .map((f) => (
                          <div key={f.id} className="farmer-row">
                            <div style={{ fontSize: '2rem' }}>{f.emoji}</div>
                            <div className="farmer-row-info">
                              <div className="farmer-row-name">{f.name}</div>
                              <div className="farmer-row-detail">
                                📍 {f.loc} · 📱 {f.phone}
                              </div>
                              <div className="farmer-row-detail">
                                🌿 {f.products}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '.4rem' }}>
                              <button
                                className="appr-btn"
                                onClick={() => approveFarmer(f.id)}
                              >
                                ✓ Onayla
                              </button>
                              <button
                                className="rej-btn"
                                onClick={() => rejectFarmer(f.id)}
                              >
                                ✗ Reddet
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
              <div className="pc">
                <h3>✅ Onaylı Çiftçiler</h3>
                <div className="farmer-list">
                  {Object.values(FARMERS_DB).map((f, i) => (
                    <div key={i} className="farmer-row">
                      <div style={{ fontSize: '2rem' }}>{f.emoji}</div>
                      <div className="farmer-row-info">
                        <div className="farmer-row-name">
                          {f.name}{' '}
                          {f.verified && (
                            <span
                              style={{
                                color: 'var(--gold)',
                                fontSize: '.75rem',
                              }}
                            >
                              ✓ Doğrulandı
                            </span>
                          )}
                        </div>
                        <div className="farmer-row-detail">
                          📍 {f.loc} · ⭐ {f.rating} · {f.sales} satış
                        </div>
                      </div>
                      <span className="approved">Aktif</span>
                    </div>
                  ))}
                  {pendingFarmers
                    .filter((f) => f.status === 'approved')
                    .map((f) => (
                      <div key={f.id} className="farmer-row">
                        <div style={{ fontSize: '2rem' }}>{f.emoji}</div>
                        <div className="farmer-row-info">
                          <div className="farmer-row-name">
                            {f.name}{' '}
                            <span
                              style={{ color: 'var(--g4)', fontSize: '.75rem' }}
                            >
                              ✓ Yeni Onaylandı
                            </span>
                          </div>
                          <div className="farmer-row-detail">
                            📍 {f.loc} · 🌿 {f.products}
                          </div>
                        </div>
                        <span className="approved">Aktif</span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* ── ADMIN FARMERS ── */}
          {tab === 'farmers' && (
            <>
              <div className="sh2">
                <h2>Çiftçi Yönetimi</h2>
                <p>Başvuruları incele, onayla veya reddet</p>
              </div>
              <div className="pc">
                <h3>Tüm Başvurular</h3>
                <div className="farmer-list">
                  {[...Object.values(FARMERS_DB), ...pendingFarmers].map(
                    (f, i) => (
                      <div key={i} className="farmer-row">
                        <div style={{ fontSize: '2rem' }}>{f.emoji}</div>
                        <div className="farmer-row-info">
                          <div className="farmer-row-name">{f.name}</div>
                          <div className="farmer-row-detail">
                            📍 {f.loc} ·{' '}
                            {f.verified || f.status === 'approved'
                              ? '✅ Onaylı'
                              : '⏳ Bekliyor'}
                          </div>
                        </div>
                        {f.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '.4rem' }}>
                            <button
                              className="appr-btn"
                              onClick={() => approveFarmer(f.id)}
                            >
                              ✓ Onayla
                            </button>
                            <button
                              className="rej-btn"
                              onClick={() => rejectFarmer(f.id)}
                            >
                              ✗
                            </button>
                          </div>
                        ) : (
                          <span className="approved">Aktif</span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── ADMIN ORDERS ── */}
          {tab === 'orders-admin' && (
            <>
              <div className="sh2">
                <h2>Tüm Siparişler</h2>
                <p>Platform genelindeki siparişler</p>
              </div>
              <div className="orders-list">
                {orders.map((o) => (
                  <div key={o.id} className="ocard">
                    <div className="otop">
                      <div>
                        <div className="oid">
                          {o.id} · {o.date}
                        </div>
                        <div style={{ fontSize: '.8rem', color: 'var(--tl)' }}>
                          👨‍🌾 {o.farmer} · 📍 {o.addr}
                        </div>
                      </div>
                      <span className={`ostatus ${SC[o.status]}`}>
                        {SL[o.status]}
                      </span>
                    </div>
                    <div className="oitems">
                      {o.items.map((it, i) => (
                        <span key={i} className="otag">
                          {it}
                        </span>
                      ))}
                    </div>
                    <div className="ofoot">
                      <div>
                        <div className="ototal">{o.total}₺</div>
                        <div className="kargo-info">
                          🚚 {o.kargo} ·{' '}
                          <span className="kargo-kod">{o.kod}</span>
                        </div>
                      </div>
                      {o.status < 3 && (
                        <button
                          className="cnfbtn"
                          onClick={() => {
                            setOrders((prev) =>
                              prev.map((ord) =>
                                ord.id === o.id
                                  ? {
                                      ...ord,
                                      status: Math.min(3, ord.status + 1),
                                    }
                                  : ord
                              )
                            );
                            showToast('Durum güncellendi!');
                          }}
                        >
                          Sonraki Adım →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <>
              <div className="sh2">
                <h2>Profilim</h2>
              </div>
              <div className="profile-card">
                <div className="prav">{user?.emoji}</div>
                <div className="prname">{user?.name}</div>
                <div className="prrole">
                  {role === 'buyer'
                    ? 'Alıcı Hesabı'
                    : role === 'farmer'
                    ? 'Çiftçi Hesabı'
                    : 'Admin'}
                </div>
                <div className="info-list">
                  <div className="info-row">
                    <span>📧 E-posta</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="info-row">
                    <span>📱 Telefon</span>
                    <span>{user?.phone}</span>
                  </div>
                  <div className="info-row">
                    <span>📍 Şehir</span>
                    <span>{user?.city}</span>
                  </div>
                  <div className="info-row">
                    <span>👤 Hesap</span>
                    <span>
                      {role === 'buyer'
                        ? 'Alıcı'
                        : role === 'farmer'
                        ? 'Çiftçi'
                        : 'Admin'}
                    </span>
                  </div>
                  {role === 'farmer' && (
                    <div className="info-row">
                      <span>✅ Durum</span>
                      <span
                        style={{
                          color: user?.verified ? 'var(--g3)' : 'var(--orange)',
                        }}
                      >
                        {user?.verified ? 'Doğrulandı' : 'Onay Bekliyor'}
                      </span>
                    </div>
                  )}
                  {role === 'buyer' && (
                    <div className="info-row">
                      <span>📦 Sipariş</span>
                      <span>{orders.length}</span>
                    </div>
                  )}
                </div>
                <button
                  className="logout-btn"
                  onClick={() => {
                    setScreen('splash');
                    setUser(null);
                    setRole(null);
                    setCart([]);
                  }}
                >
                  Çıkış Yap
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
