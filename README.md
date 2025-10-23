# 🖥️ Sophos Terminal Assist

**Real-time command guidance for live terminal sessions | Auto-updates from GitHub**

A Tampermonkey userscript that provides instant access to 124+ DFIR/IR forensics commands directly in Sophos Central. Fully automated updates ensure all your analysts always have the latest commands.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Sophos%20Central-orange)

---

## ✨ Features

- **124+ Forensics Commands** - Windows (47), Linux (25), macOS (52)
- **Auto-Updates** - Script and commands update automatically from this GitHub repo
- **Beautiful UI** - Modern modal interface with search and filters  
- **Quick Copy** - One-click command copying to clipboard
- **Keyboard Shortcuts** - Ctrl+Shift+D to toggle, arrows to navigate
- **Smart Search** - Filter by platform, category, or keyword
- **Auto-Close Option** - Close modal after copy (user preference saved)
- **Zero Maintenance** - Updates roll out automatically to all users

---

## 🚀 Installation

### For Analysts

1. **Install Tampermonkey**
   - Chrome: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - Edge: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **Install the Script** (One-Click)
   
   **Click here to install:** [Sophos Terminal Assist](https://raw.githubusercontent.com/MallikarjunaKanike/terminal-assist/main/Sophos-Terminal-Assist.user.js)
   
   When Tampermonkey prompts you, click **Install**

3. **Start Using**
   - Go to [Sophos Central](https://central.sophos.com/)
   - Look for the purple 🖥️ **Terminal Assist** button (bottom-right)
   - Click it or press **Ctrl+Shift+D**

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+Shift+D** | Toggle Terminal Assist modal |
| **↑ / ↓ Arrows** | Navigate through commands |
| **Enter** | Copy selected command |
| **Escape** | Close detail panel / Close modal |

---

## 📋 Command Categories

### Windows (47 commands)
- User & Session Management
- Active Directory Queries
- Services & Scheduled Tasks
- Registry & Startup
- Event Logs & Security
- Network & Firewall
- Windows Defender
- File System & Permissions

### Linux (25 commands)
- User Account Discovery
- Process Discovery
- Network Connections
- System Logs & Cron Jobs
- File Modifications & Search

### macOS (52 commands)
- System Information
- User Accounts
- Process Discovery
- Launch Agents/Daemons
- Network Connections
- Browser History & Keychains
- Time Machine Backups

---

## 🔄 Auto-Update System

### How It Works

**1. Script Updates (Tampermonkey built-in)**
- Tampermonkey checks GitHub for script updates every 7-14 days
- Updates install automatically in the background
- Used for UI changes, bug fixes, new features

**2. Command Updates (Dynamic loading)**
- Commands load from `commands.json` on GitHub every time you open the tool
- Updates happen instantly - no reinstall needed
- Perfect for adding/editing commands

### Update Frequency
- **Instant**: Command data updates on every tool open
- **Weekly**: Script logic updates as needed
- **Automatic**: Zero user action required

---

## 🛠️ For Administrators

### Repository Structure

```
terminal-assist/
├── Sophos-Terminal-Assist.user.js  # Main userscript
├── commands.json                    # Command database
├── README.md                        # This file
└── LICENSE                          # MIT License
```

### Adding New Commands

1. **Edit `commands.json`** on GitHub
   ```json
   {
     "windows": [
       {
         "title": "Your command name",
         "command": "actual command",
         "desc": "What this does",
         "example": "example usage",
         "output": "expected output",
         "technique": "MITRE ATT&CK technique"
       }
     ]
   }
   ```

2. **Commit Changes**
   ```bash
   git add commands.json
   git commit -m "Added new Windows registry command"
   git push origin main
   ```

3. **Done!** All users get the update instantly on next tool open

### Updating the Script

1. Edit `Sophos-Terminal-Assist.user.js`
2. Bump `@version` number
3. Commit and push
4. Users auto-update within 7-14 days

---

## 📊 Usage Statistics

Track usage by checking browser console:
```javascript
🖥️ Sophos Terminal Assist
✓ 124 commands loaded from GitHub
✨ Ready! Press Ctrl+Shift+D
```

---

## 🔒 Security & Privacy

- ✅ All code is open source and auditable
- ✅ Only runs on `central.sophos.com/*`
- ✅ No external dependencies except GitHub
- ✅ No data collection or telemetry
- ✅ Read-only access to commands
- ✅ MIT Licensed

---

## 🐛 Troubleshooting

**Commands Not Loading?**
- Check browser console (F12) for errors
- Verify GitHub is accessible from your network
- Try refreshing the page (Ctrl+R)

**Script Not Auto-Updating?**
- Tampermonkey → Settings → Check "Update interval"
- Manual update: Dashboard → Select script → "Check for updates"

**Button Not Showing?**
- Verify you're on `central.sophos.com`
- Check if Tampermonkey is enabled
- Try disabling/re-enabling the script

**Need Help?**
- Open an issue: https://github.com/MallikarjunaKanike/terminal-assist/issues
- Check browser console for error messages

---

## 📝 Changelog

### v1.0.0 (2025-10-23)
- ✨ Initial release
- 📦 124 commands (Windows, Linux, macOS)
- 🔄 Auto-update from GitHub
- 🎨 Beautiful modal UI
- ⌨️ Keyboard shortcuts
- 📋 One-click copy
- 💾 Auto-close preference saved

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/new-commands`)
3. Add commands to `commands.json` or improve the script
4. Commit your changes (`git commit -m 'Add PowerShell forensics commands'`)
5. Push to branch (`git push origin feature/new-commands`)
6. Open a Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 👥 Author

**Mallikarjuna Kanike**  
SOC Team  

Repository: https://github.com/MallikarjunaKanike/terminal-assist

---

## 🙏 Acknowledgments

- Built for SOC analysts who need quick command access
- Inspired by modern userscript best practices
- Community feedback welcome!

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/MallikarjunaKanike/terminal-assist/issues)
- **Pull Requests**: Contributions welcome!

---

**Made with 🖥️ for SOC Analysts**

**⭐ Star this repo if you find it useful!**
