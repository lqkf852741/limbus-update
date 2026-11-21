@echo off
setlocal EnableExtensions
chcp 936 > nul 2>&1
cd /d "%~dp0"
title 边狱公司私服

if not exist "Launcher.exe" goto nolauncher
if not exist "modsync.ps1" goto nomodsync

echo.
echo   ============================================
echo      边狱公司私服
echo   ============================================
echo.

rem ---------- 1. 同步人格对战内容 ----------
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0modsync.ps1"
echo.

rem ---------- 2. 桌面图标（每次都写一遍，纠正指向）----------
rem 不能做成「不存在才建」：旧的快捷方式可能指向 Launcher.exe，
rem 那样 mods 同步就永远不跑。这里总是覆盖，保证指向本文件。
powershell -NoProfile -ExecutionPolicy Bypass -Command "$root = (Get-Location).Path; $name = -join ([int[]](0x8FB9, 0x72F1, 0x516C, 0x53F8, 0x79C1, 0x670D) | ForEach-Object { [char]$_ }); $lnk = Join-Path ([Environment]::GetFolderPath('Desktop')) ($name + '.lnk'); $w = New-Object -ComObject WScript.Shell; $s = $w.CreateShortcut($lnk); $s.TargetPath = (Join-Path $root '启动私服.cmd'); $s.WorkingDirectory = $root; $ico = Join-Path $root 'arena.ico'; if (Test-Path $ico) {{ $s.IconLocation = $ico }}; $s.Description = $name; $s.Save(); if (Test-Path $lnk) {{ Write-Host 'SHORTCUT_OK' }} else {{ Write-Host 'SHORTCUT_FAIL' }}" >nul 2>&1

rem ---------- 3. 打开启动器 ----------
echo   正在打开启动器……
start "" "Launcher.exe"
timeout /t 3 /nobreak >nul
exit /b 0

:nolauncher
echo.
echo   [错误] 没找到 Launcher.exe
echo   请把本文件和 Launcher.exe 放在同一个文件夹（私服根目录）。
echo.
pause
exit /b 1

:nomodsync
echo.
echo   [错误] 缺少 modsync.ps1
echo   请重新解压完整的安装包。
echo.
pause
exit /b 1
