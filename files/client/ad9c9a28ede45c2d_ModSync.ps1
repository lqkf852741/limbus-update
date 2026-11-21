# 人格对战 mod 同步器
# 由 启动私服.cmd 调用。失败不阻塞游戏启动。

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$Base = 'https://raw.githubusercontent.com/lqkf852741/limbus-update/main'
$Root = $PSScriptRoot
$ModsDir = Join-Path $Root 'BepInEx\plugins\Lethe\mods'
$OffDir  = Join-Path $Root 'BepInEx\plugins\Lethe\mods-off'

Write-Host '  检查人格对战内容……'

try {
    $manifest = Invoke-RestMethod -Uri "$Base/mods.json" -TimeoutSec 20 -UseBasicParsing
} catch {
    Write-Host '  [跳过] 连不上更新服务器，直接用本地内容'
    exit 0
}

$downloaded = 0
$skipped = 0
$failed = 0

foreach ($m in $manifest.mods) {
    $name = $m.name
    $dest = Join-Path $Root ($m.dest -replace '/', '\')

    # 用户手动关掉的 mod 不强行启用
    if (Test-Path (Join-Path $OffDir $name)) {
        Write-Host ("  [停用] {0}" -f $name)
        continue
    }

    if (-not (Test-Path $dest)) {
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
    }

    $need = 0
    foreach ($f in $m.files) {
        $lp = Join-Path $dest ($f.path -replace '/', '\')
        $ok = $false
        if (Test-Path $lp) {
            try {
                $h = (Get-FileHash -LiteralPath $lp -Algorithm SHA256).Hash.ToLower()
                if ($h -eq $f.sha256.ToLower()) { $ok = $true }
            } catch { $ok = $false }
        }
        if ($ok) { $skipped++; continue }

        $parent = Split-Path -Parent $lp
        if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
        try {
            Invoke-WebRequest -Uri ("{0}/{1}" -f $Base, $f.file) -OutFile $lp -TimeoutSec 60 -UseBasicParsing
            $downloaded++
            $need++
        } catch {
            $failed++
            Write-Host ("  [失败] {0}/{1}" -f $name, $f.path)
        }
    }

    if ($need -gt 0) {
        Write-Host ("  [更新] {0}  {1} 个文件" -f $name, $need)
    } else {
        Write-Host ("  [最新] {0}" -f $name)
    }
}

# 清单里要求删除的（作者移除的 mod）
foreach ($d in ($manifest.delete | Where-Object { $_ })) {
    $p = Join-Path $Root ($d -replace '/', '\')
    if (Test-Path $p) {
        Remove-Item -LiteralPath $p -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host ("  [清理] {0}" -f $d)
    }
}

Write-Host ("  完成：新增/更新 {0}，已是最新 {1}，失败 {2}" -f $downloaded, $skipped, $failed)
exit 0
