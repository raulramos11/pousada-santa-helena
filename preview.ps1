# Preview local sem prender a sessão do shell.
#   .\preview.ps1            -> sobe em 8082 desacoplado e confirma HTTP 200
#   .\preview.ps1 -Port 8090
#   .\preview.ps1 -Stop      -> encerra o servidor dessa porta
#
# Por que Win32_Process.Create: o processo é criado pelo serviço WMI, não como filho
# deste shell, então não herda os handles de stdout/stderr. Start-Process/Start-Job
# herdam esses handles e a ferramenta que chamou o shell fica esperando para sempre.
param([int]$Port = 8082, [switch]$Stop)
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$log = Join-Path $here 'psh-serve.log'

function Get-Listener { Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue }

if ($Stop) {
    $l = Get-Listener
    if (-not $l) { Write-Output "Nada escutando na porta $Port."; exit 0 }
    $l | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
    Write-Output "Servidor da porta $Port encerrado."
    exit 0
}

if (Get-Listener) { Write-Output "Já há algo escutando na porta $Port (use -Stop para encerrar)." }
else {
    $node = (Get-Command node).Source
    $cmd = "cmd.exe /c `"`"$node`" `"$here\serve.mjs`" $Port > `"$log`" 2>&1`""
    $r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $cmd; CurrentDirectory = $here }
    if ($r.ReturnValue -ne 0) { throw "Win32_Process.Create falhou (código $($r.ReturnValue))." }
    for ($i = 0; $i -lt 20 -and -not (Get-Listener); $i++) { Start-Sleep -Milliseconds 250 }
}

try {
    $resp = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -UseBasicParsing -TimeoutSec 5
    Write-Output "OK: http://127.0.0.1:$Port/ respondeu HTTP $($resp.StatusCode)."
} catch {
    Write-Output "Servidor não respondeu na porta $Port. Log:"
    if (Test-Path $log) { Get-Content $log }
    exit 1
}
