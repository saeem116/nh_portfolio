$b = [System.IO.File]::ReadAllBytes("E:\NhPortfolio\public\qr-placeholder.png")
$i = 8
while ($i -lt $b.Length) {
    $len = [BitConverter]::ToUInt32($b, $i)
    $type = [System.Text.Encoding]::ASCII.GetString($b, $i + 4, 4)
    Write-Host ("{0} len={1} at {2}" -f $type $len $i)
    $i += 12 + $len
}