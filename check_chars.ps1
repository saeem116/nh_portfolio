$bytes = [System.IO.File]::ReadAllBytes("E:\NhPortfolio\src\components\Hero.tsx")
$lines = [System.Text.Encoding]::UTF8.GetString($bytes) -split "`r?`n"
Write-Host ("Total lines: {0}" -f $lines.Length)
for ($i = 0; $i -lt [Math]::Min($lines.Length, 120); $i++) {
    $line = $lines[$i]
    $len = $line.Length
    $hasSpecial = $false
    for ($j = 0; $j -lt $len; $j++) {
        $code = [int]$line[$j]
        if ($code -gt 127 -or $code -eq 0) {
            $hasSpecial = $true
        }
    }
    $marker = if ($hasSpecial) { " <<<" } else { "" }
    Write-Host ("{0,4} ({1,3}): {2}{3}" -f $i, $len, $line, $marker)
}