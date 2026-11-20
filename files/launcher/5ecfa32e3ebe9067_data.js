/* ==========================================================================
   data.js  数据层

   负责和 C# 宿主通信：请求模组列表、切换启用状态、读配置、拉起程序。
   宿主那边处理完会用 PostWebMessageAsJson 回一条 JSON。

   放在 main.js 之后加载，独立工作，不碰 main.js 的转场逻辑。
   ========================================================================== */
(() => {
  'use strict';

  const host = window.chrome && window.chrome.webview;
  const $ = (id) => document.getElementById(id);

  function call(cmd, extra) {
    if (!host) {
      // 在普通浏览器里打开调试时的兜底，避免一片空白
      console.warn('[data] 没有 WebView2 宿主，命令被忽略：', cmd);
      return;
    }
    host.postMessage(JSON.stringify(Object.assign({ cmd }, extra || {})));
  }

  /* ==========================================================
     模组列表
     ========================================================== */

  function renderMods(list, note) {
    const box = $('mods-list');
    const summary = $('mods-summary');
    const empty = $('mods-empty');
    const pathHint = $('mods-path');
    if (!box) return;

    if (!list || !list.length) {
      box.innerHTML = '';
      if (empty) empty.hidden = false;
      if (pathHint) {
        pathHint.hidden = false;
        pathHint.textContent = lastCfg && lastCfg.modsDir ? lastCfg.modsDir : '（路径未知）';
      }
      if (summary) summary.textContent = '没有模组';
      refreshMenuHint(0, 0);
      return;
    }

    if (empty) empty.hidden = true;
    if (pathHint) pathHint.hidden = true;

    const onCount = list.filter((m) => m.enabled).length;
    if (summary) summary.textContent = `${list.length} 项 · ${onCount} 个启用`;

    box.innerHTML = list.map((m, i) => {
      const idx = String(i + 1).padStart(2, '0');
      const state = m.enabled ? '启用' : '禁用';
      const cls = m.enabled ? 'on' : 'off';
      return `<div class="mod-row">
        <span class="mod-idx">${idx}</span>
        <span class="mod-name" title="${escapeAttr(m.id)}">${escapeHtml(m.id)}</span>
        <span class="mod-info">${m.files} 文件 · ${m.mb} MB</span>
        <span class="mod-sw ${cls}" data-id="${escapeAttr(m.id)}" title="点击${m.enabled ? '禁用' : '启用'}"></span>
        <span class="mod-state ${cls}">${state}</span>
      </div>`;
    }).join('');

    box.querySelectorAll('.mod-sw').forEach((el) => {
      el.addEventListener('click', () => {
        el.style.pointerEvents = 'none';
        el.style.opacity = '.5';
        call('mods.toggle', { id: el.dataset.id });
      });
    });

    refreshMenuHint(list.length, onCount);
    if (note) setLog(note);
  }

  function refreshMenuHint(total, onCount) {
    const el = $('m-mods');
    if (!el) return;
    el.textContent = total ? `${total} 项 · ${onCount} 启用` : '没有模组';
  }

  /* ==========================================================
     配置
     ========================================================== */

  let lastCfg = null;

  function renderCfg(cfg) {
    lastCfg = cfg;

    const set = (id, v) => { const el = $(id); if (el) el.textContent = v || '—'; };

    set('cfg-version', cfg.version);
    set('cfg-root', cfg.gameRoot);
    set('cfg-mods', cfg.modsDir);
    set('cfg-update', cfg.updateSource);
    set('cfg-log', cfg.logDir);

    // 游戏本体和人格对战：有就给完整路径，没有就写"未找到"
    set('cfg-game', cfg.gameExe || '未找到 LimbusCompany.exe');
    set('cfg-arena', cfg.arenaExe || '未找到 ArenaApp\\ArenaApp.exe');

    // 开始页的环境信息
    set('s-game', cfg.gameExe ? short(cfg.gameExe) : '未找到');
    set('s-launch', cfg.launchExe ? short(cfg.launchExe) : '未找到 launch.exe');
    set('s-mods', cfg.modsDir ? short(cfg.modsDir) : '—');

    // 对战页
    set('arena-path', cfg.arenaExe ? short(cfg.arenaExe) : '未找到');
    const st = $('arena-state');
    if (st) {
      if (cfg.arenaExe) {
        st.textContent = '已就绪';
        st.className = 's-v on';
      } else {
        st.textContent = '缺失';
        st.className = 's-v dim';
      }
    }

    const ver = $('m-ver');
    if (ver) ver.textContent = 'v' + cfg.version;

    refreshMenuHint(
      $('mods-list') && $('mods-list').children.length ? -1 : 0,
      -1
    );
  }

  /** 路径太长时只留最后两段，避免撑破布局 */
  function short(p) {
    if (!p) return '—';
    const parts = p.replace(/\\/g, '/').split('/').filter(Boolean);
    if (parts.length <= 3) return p;
    return '…/' + parts.slice(-2).join('/');
  }

  /* ==========================================================
     工具
     ========================================================== */

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function escapeAttr(s) { return escapeHtml(s); }

  function setLog(text) {
    const el = $('log');
    if (el) el.textContent = text;
  }

  /* ==========================================================
     接收宿主的回复
     ========================================================== */

  if (host) {
    host.addEventListener('message', (e) => {
      const msg = e.data;
      if (!msg || typeof msg !== 'object') return;

      switch (msg.type) {
        case 'mods':   renderMods(msg.list, msg.note); break;
        case 'cfg':    renderCfg(msg); break;
        case 'note':   setLog(msg.message); break;
        case 'update': onUpdate(msg); break;
        case 'error':
          setLog('错误：' + msg.message);
          console.error('[data]', msg.message);
          // 让开关恢复可点
          document.querySelectorAll('.mod-sw').forEach((el) => {
            el.style.pointerEvents = '';
            el.style.opacity = '';
          });
          break;
      }
    });
  }

  /* ==========================================================
     更新状态

     宿主会推这些状态过来：
       checking     正在检查
       available    有新版本（宿主会自动开始下载）
       downloading  下载中，带百分比
       done         完成
       failed       失败
       idle         没事
     ========================================================== */

  const upd = { state: 'idle', pct: -1, text: '' };

  function onUpdate(msg) {
    upd.state = msg.state || 'idle';
    upd.pct = typeof msg.pct === 'number' ? msg.pct : -1;
    upd.text = msg.text || '';

    if (upd.text) setLog(upd.text);
    renderLaunchButtons();

    // 完成并且需要重启：提示一下
    if (upd.state === 'done' && msg.restart) {
      setLog('更新完成，请重启启动器');
    }
  }

  /** 两个大按钮跟着更新状态变。 */
  function renderLaunchButtons() {
    const btn = $('act-launch');
    const abtn = $('arena-launch');

    const setBtn = (el, baseText) => {
      if (!el) return;
      el.classList.remove('busy', 'pending');
      switch (upd.state) {
        case 'checking':
          el.textContent = '检查更新…';
          el.classList.add('busy');
          el.dataset.locked = '1';
          break;
        case 'available':
          el.textContent = '待更新';
          el.classList.add('pending');
          el.dataset.locked = '1';
          break;
        case 'downloading':
          el.textContent = upd.pct >= 0 ? `下载中 ${upd.pct}%` : '下载中…';
          el.classList.add('busy');
          el.dataset.locked = '1';
          break;
        case 'done':
          el.textContent = baseText;
          delete el.dataset.locked;
          break;
        case 'failed':
          el.textContent = baseText;
          delete el.dataset.locked;
          break;
        default:
          el.textContent = baseText;
          delete el.dataset.locked;
      }
    };

    setBtn(btn, '启动游戏');
    setBtn(abtn, '打开人格对战');
  }

  /* ==========================================================
     按钮绑定
     ========================================================== */

  const bind = (id, fn) => {
    const el = $(id);
    if (el) el.addEventListener('click', fn);
  };

  bind('mods-refresh', () => { setLog('重新扫描中…'); call('mods.rescan'); });
  bind('mods-open', () => call('mods.open'));

  // 更新期间按钮锁住，点了也不启动（不然会边更新边跑，文件对不上）
  const locked = (el) => el && el.dataset && el.dataset.locked === '1';

  bind('act-launch', () => {
    const el = $('act-launch');
    if (locked(el)) { setLog('正在更新，稍等'); return; }
    setLog('正在启动游戏…');
    call('launch.game');
  });

  bind('arena-launch', () => {
    const el = $('arena-launch');
    if (locked(el)) { setLog('正在更新，稍等'); return; }
    setLog('正在打开人格对战…');
    call('launch.arena');
  });

  bind('cfg-check', () => { setLog('正在检查更新…'); call('update.check'); });
  bind('cfg-openlog', () => call('open.logs'));

  /* ==========================================================
     启动：先拉配置，再拉模组
     ========================================================== */

  call('cfg.get');
  call('mods.list');
  call('update.check');

  // 窗口按钮
  const bMin = $('btn-min');
  const bClose = $('btn-close');
  if (bMin) bMin.addEventListener('click', () => call('minimize'));
  if (bClose) bClose.addEventListener('click', () => call('close'));

  // 等主菜单动画结束再补一次，确保数据到了
  setTimeout(() => { call('cfg.get'); call('mods.list'); }, 1200);
})();
