// ==UserScript==
// @name         Sophos Terminal Assist
// @namespace    https://github.com/MallikarjunaKanike/terminal-assist
// @version      1.0.0
// @description  Real-time command guide for live terminal sessions | Auto-updates from GitHub
// @author       Mallikarjuna Kanike - SOC Team
// @match        https://central.sophos.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sophos.com
// @updateURL    https://raw.githubusercontent.com/MallikarjunaKanike/terminal-assist/main/Sophos-Terminal-Assist.user.js
// @downloadURL  https://raw.githubusercontent.com/MallikarjunaKanike/terminal-assist/main/Sophos-Terminal-Assist.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================
    // SOPHOS TERMINAL ASSIST v1.0
    // Auto-updates from GitHub | Real-time command guidance
    // Repository: https://github.com/MallikarjunaKanike/terminal-assist
    // ========================================================

    const GITHUB_REPO = 'MallikarjunaKanike/terminal-assist';
    const GITHUB_BRANCH = 'main';
    const COMMANDS_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/commands.json`;
    
    let commandLibrary = [];
    let autoCloseEnabled = (typeof GM_getValue !== 'undefined') ? GM_getValue('autoClose', false) : false;
    let selectedCommandIndex = -1;
    let filteredCommands = [];

    console.log('%c🖥️ Sophos Terminal Assist', 'font-size: 16px; font-weight: bold; color: #667eea');
    console.log('%c⚙️ Loading commands from GitHub...', 'color: #666');

    // ========== FETCH COMMANDS FROM GITHUB ==========
    async function loadCommandsFromGitHub() {
        try {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: COMMANDS_URL + '?t=' + Date.now(),
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data);
                            } catch (e) {
                                reject(e);
                            }
                        },
                        onerror: reject
                    });
                });
            } else {
                const response = await fetch(COMMANDS_URL + '?t=' + Date.now(), {
                    cache: 'no-store'
                });
                return await response.json();
            }
        } catch (error) {
            console.error('❌ Failed to load commands from GitHub:', error);
            throw error;
        }
    }

    function convertToUnifiedFormat(data) {
        const library = [];
        
        ['windows', 'linux', 'mac'].forEach(platform => {
            if (data[platform]) {
                data[platform].forEach(cmd => {
                    library.push({
                        name: cmd.title,
                        category: platform.charAt(0).toUpperCase() + platform.slice(1) + ' - ' + cmd.technique,
                        platform: platform === 'mac' ? 'macOS' : platform.charAt(0).toUpperCase() + platform.slice(1),
                        description: cmd.desc,
                        command: cmd.command,
                        example: cmd.example,
                        output: cmd.output,
                        technique: cmd.technique
                    });
                });
            }
        });
        
        return library;
    }

    // ========== CREATE UI ==========
    function createUI() {
        const floatingButton = document.createElement('div');
        floatingButton.innerHTML = '🖥️<br>Terminal<br>Assist';
        floatingButton.style.cssText = `position:fixed;bottom:20px;right:100px;width:80px;height:80px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:50%;cursor:pointer;font-size:10px;font-weight:bold;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10000;box-shadow:0 4px 20px rgba(102,126,234,0.4);transition:all 0.3s ease;line-height:1.3;text-align:center`;

        floatingButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(-5deg)';
            this.style.boxShadow = '0 6px 25px rgba(102,126,234,0.6)';
        });

        floatingButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '0 4px 20px rgba(102,126,234,0.4)';
        });

        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10001;display:none;align-items:center;justify-content:center;backdrop-filter:blur(5px)`;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `background:white;padding:0;border-radius:16px;max-width:1000px;width:95%;max-height:90%;display:flex;flex-direction:column;box-shadow:0 10px 40px rgba(0,0,0,0.5);overflow:hidden`;

        modalContent.innerHTML = `
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:25px;display:flex;justify-content:space-between;align-items:center">
                <div><h2 style="margin:0;font-size:24px">🖥️ Sophos Terminal Assist</h2><p style="margin:5px 0 0 0;opacity:0.9;font-size:13px">Real-time command guidance • Auto-updates from GitHub • <span id="commandTotal">Loading...</span></p></div>
                <button id="closeModal" style="background:rgba(255,255,255,0.2);color:white;border:2px solid white;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:16px">✕</button>
            </div>
            <div style="padding:20px;background:#f8f9fa">
                <div style="display:flex;gap:10px;margin-bottom:15px">
                    <input type="text" id="searchCommand" placeholder="🔍 Search commands..." style="flex:1;padding:12px 20px;border:2px solid #ddd;border-radius:8px;font-size:14px">
                    <select id="platformFilter" style="padding:12px 20px;border:2px solid #ddd;border-radius:8px;font-size:14px;background:white;cursor:pointer;min-width:150px"><option value="">All Platforms</option></select>
                    <select id="categoryFilter" style="padding:12px 20px;border:2px solid #ddd;border-radius:8px;font-size:14px;background:white;cursor:pointer;min-width:200px"><option value="">All Categories</option></select>
                </div>
                <div style="display:flex;gap:15px;align-items:center;color:#666;font-size:13px">
                    <span id="commandCount" style="font-weight:bold"></span><span>|</span>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" id="autoCloseCheckbox" style="cursor:pointer"><span>Auto-close after copy</span></label>
                    <span>|</span><span>⬆️⬇️ navigate | Enter to copy | Ctrl+Shift+D</span>
                </div>
            </div>
            <div id="commandList" style="flex:1;overflow-y:auto;padding:10px 20px;background:white"></div>
            <div id="commandDetail" style="padding:20px;border-top:2px solid #eee;background:#f8f9fa;display:none;position:relative">
                <button id="closeDetail" style="position:absolute;top:15px;right:15px;background:rgba(102,126,234,0.1);color:#667eea;border:2px solid #667eea;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:14px;transition:all 0.2s">✕ Close</button>
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:15px;padding-right:90px">
                    <div style="flex:1">
                        <h3 id="detailName" style="margin:0 0 5px 0;color:#667eea"></h3>
                        <p id="detailDescription" style="margin:0;color:#666;font-size:13px"></p>
                        <div id="detailMeta" style="margin-top:10px;display:flex;gap:15px;font-size:12px"></div>
                    </div>
                    <button id="copyCommandBtn" style="background:#667eea;color:white;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:bold">📋 Copy</button>
                </div>
                <div style="background:white;border:2px solid #ddd;border-radius:8px;padding:15px;margin-bottom:10px">
                    <strong style="color:#667eea">Command:</strong>
                    <pre id="commandText" style="margin:10px 0 0 0;font-family:'Courier New',monospace;font-size:13px;white-space:pre-wrap;background:#f8f9fa;padding:10px;border-radius:4px"></pre>
                </div>
                <div style="background:white;border:2px solid #ddd;border-radius:8px;padding:15px">
                    <strong style="color:#667eea">Example Output:</strong>
                    <pre id="outputText" style="margin:10px 0 0 0;font-family:'Courier New',monospace;font-size:12px;color:#666;white-space:pre-wrap;background:#f8f9fa;padding:10px;border-radius:4px"></pre>
                </div>
                <div id="copyStatus" style="margin-top:10px;text-align:center;font-weight:bold;display:none"></div>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(floatingButton);
        document.body.appendChild(modal);

        return { floatingButton, modal };
    }

    // ========== RENDER & INTERACTION ==========
    function renderCommandList() {
        const searchTerm = document.getElementById('searchCommand').value.toLowerCase();
        const platformTerm = document.getElementById('platformFilter').value;
        const categoryTerm = document.getElementById('categoryFilter').value;

        filteredCommands = commandLibrary.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm) || c.description.toLowerCase().includes(searchTerm) || c.command.toLowerCase().includes(searchTerm);
            const matchesPlatform = !platformTerm || c.platform === platformTerm;
            const matchesCategory = !categoryTerm || c.category === categoryTerm;
            return matchesSearch && matchesPlatform && matchesCategory;
        });

        document.getElementById('commandCount').textContent = filteredCommands.length + ' commands';
        const commandList = document.getElementById('commandList');
        commandList.innerHTML = '';
        
        filteredCommands.forEach((c, index) => {
            const item = document.createElement('div');
            item.className = 'command-item';
            item.style.cssText = `padding:15px 20px;margin-bottom:8px;border:2px solid #eee;border-radius:10px;cursor:pointer;transition:all 0.2s;background:white`;
            item.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div style="flex:1"><div style="font-weight:bold;color:#333;font-size:15px;margin-bottom:5px">${c.name}</div><div style="color:#666;font-size:12px;margin-bottom:5px">${c.description.substring(0,100)}${c.description.length > 100 ? '...' : ''}</div><div style="display:flex;gap:8px"><span style="background:#667eea;color:white;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:bold">${c.platform}</span><span style="background:#e0e7ff;color:#667eea;padding:2px 8px;border-radius:12px;font-size:10px">${c.technique}</span></div></div></div>`;
            
            item.addEventListener('mouseenter', function() {
                if(selectedCommandIndex !== index) {
                    this.style.background = '#f8f9fa';
                    this.style.borderColor = '#667eea';
                }
            });
            item.addEventListener('mouseleave', function() {
                if(selectedCommandIndex !== index) {
                    this.style.background = 'white';
                    this.style.borderColor = '#eee';
                }
            });
            item.addEventListener('click', () => selectCommand(index));
            commandList.appendChild(item);
        });
    }

    function selectCommand(index) {
        selectedCommandIndex = index;
        const cmd = filteredCommands[index];
        
        document.querySelectorAll('.command-item').forEach((item, i) => {
            if(i === index) {
                item.style.background = 'linear-gradient(135deg,#f0f4ff,#e0e7ff)';
                item.style.borderColor = '#667eea';
                item.style.borderWidth = '3px';
            } else {
                item.style.background = 'white';
                item.style.borderColor = '#eee';
                item.style.borderWidth = '2px';
            }
        });
        
        document.getElementById('commandDetail').style.display = 'block';
        document.getElementById('detailName').textContent = cmd.name;
        document.getElementById('detailDescription').textContent = cmd.description;
        document.getElementById('commandText').textContent = cmd.command;
        document.getElementById('outputText').textContent = cmd.output;
        document.getElementById('detailMeta').innerHTML = `<span><strong style="color:#667eea">Platform:</strong> ${cmd.platform}</span><span><strong style="color:#667eea">Technique:</strong> ${cmd.technique}</span>`;
        
        document.querySelectorAll('.command-item')[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function setupEventListeners(modal) {
        const autoCloseCheckbox = document.getElementById('autoCloseCheckbox');
        autoCloseCheckbox.checked = autoCloseEnabled;
        autoCloseCheckbox.addEventListener('change', function() {
            autoCloseEnabled = this.checked;
            if(typeof GM_setValue !== 'undefined') GM_setValue('autoClose', autoCloseEnabled);
        });

        document.getElementById('closeDetail').addEventListener('click', function() {
            document.getElementById('commandDetail').style.display = 'none';
            selectedCommandIndex = -1;
            document.querySelectorAll('.command-item').forEach(item => {
                item.style.background = 'white';
                item.style.borderColor = '#eee';
                item.style.borderWidth = '2px';
            });
        });

        document.getElementById('closeDetail').addEventListener('mouseenter', function() {
            this.style.background = '#667eea';
            this.style.color = 'white';
        });
        document.getElementById('closeDetail').addEventListener('mouseleave', function() {
            this.style.background = 'rgba(102,126,234,0.1)';
            this.style.color = '#667eea';
        });

        document.getElementById('copyCommandBtn').addEventListener('click', async function() {
            const text = document.getElementById('commandText').textContent;
            const status = document.getElementById('copyStatus');
            const btn = this;
            
            try {
                await navigator.clipboard.writeText(text);
                status.style.display = 'block';
                status.style.color = '#28a745';
                status.textContent = '✅ Copied!';
                btn.textContent = '✅ Copied!';
                btn.style.background = '#28a745';
                
                if(autoCloseEnabled) {
                    setTimeout(() => {
                        modal.style.display = 'none';
                        btn.textContent = '📋 Copy';
                        btn.style.background = '#667eea';
                        status.style.display = 'none';
                    }, 1500);
                } else {
                    setTimeout(() => {
                        btn.textContent = '📋 Copy';
                        btn.style.background = '#667eea';
                        status.style.display = 'none';
                    }, 2000);
                }
            } catch (err) {
                status.style.display = 'block';
                status.style.color = '#dc3545';
                status.textContent = '❌ Copy failed';
            }
        });

        document.querySelector('.floatingButton').addEventListener('click', () => {
            modal.style.display = 'flex';
            renderCommandList();
            document.getElementById('searchCommand').focus();
        });

        document.getElementById('closeModal').addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });
        document.getElementById('searchCommand').addEventListener('input', renderCommandList);
        document.getElementById('platformFilter').addEventListener('change', renderCommandList);
        document.getElementById('categoryFilter').addEventListener('change', renderCommandList);

        document.addEventListener('keydown', function(e) {
            if(e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
                if(modal.style.display === 'flex') {
                    renderCommandList();
                    document.getElementById('searchCommand').focus();
                }
            }
            if(e.key === 'Escape' && modal.style.display === 'flex') {
                if(document.getElementById('commandDetail').style.display === 'block') {
                    document.getElementById('closeDetail').click();
                } else {
                    modal.style.display = 'none';
                }
            }
            if(modal.style.display === 'flex' && filteredCommands.length > 0) {
                if(e.key === 'ArrowDown') {
                    e.preventDefault();
                    const newIdx = Math.min(selectedCommandIndex + 1, filteredCommands.length - 1);
                    if(newIdx >= 0) selectCommand(newIdx);
                }
                if(e.key === 'ArrowUp') {
                    e.preventDefault();
                    const newIdx = Math.max(selectedCommandIndex - 1, 0);
                    if(newIdx >= 0) selectCommand(newIdx);
                }
                if(e.key === 'Enter' && selectedCommandIndex >= 0) {
                    e.preventDefault();
                    document.getElementById('copyCommandBtn').click();
                }
            }
        });

        document.getElementById('searchCommand').addEventListener('focus', function() { this.style.borderColor = '#667eea'; });
        document.getElementById('searchCommand').addEventListener('blur', function() { this.style.borderColor = '#ddd'; });
    }

    // ========== INITIALIZE ==========
    async function init() {
        try {
            const data = await loadCommandsFromGitHub();
            commandLibrary = convertToUnifiedFormat(data);
            
            console.log('%c✓ ' + commandLibrary.length + ' commands loaded from GitHub', 'color: #28a745; font-weight: bold');
            
            const { floatingButton, modal } = createUI();
            floatingButton.classList.add('floatingButton');
            
            document.getElementById('commandTotal').textContent = commandLibrary.length + ' commands ready';
            
            const platforms = [...new Set(commandLibrary.map(c => c.platform))].sort();
            const categories = [...new Set(commandLibrary.map(c => c.category))].sort();
            
            platforms.forEach(plat => {
                const opt = document.createElement('option');
                opt.value = plat;
                opt.textContent = plat;
                document.getElementById('platformFilter').appendChild(opt);
            });

            categories.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                document.getElementById('categoryFilter').appendChild(opt);
            });
            
            setupEventListeners(modal);
            
            console.log('%c✨ Ready! Press Ctrl+Shift+D', 'color: #667eea; font-weight: bold');
            
        } catch (error) {
            console.error('%c❌ Failed to initialize Terminal Assist', 'color: #dc3545; font-weight: bold', error);
            alert('Failed to load Terminal Assist commands from GitHub. Please check your connection and try refreshing.');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
