Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$iconsDir = Join-Path $root "icons"
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

function Get-RoundedRectPath($x, $y, $width, $height, $radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $radius * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $width - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $width - $d, $y + $height - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $height - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-SupplerverIcon($size, $outPath) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  # background: brand teal, full bleed (safe for maskable use too)
  $bg = [System.Drawing.ColorTranslator]::FromHtml('#1F4A43')
  $g.Clear($bg)

  $capsuleW = $size * 0.60
  $capsuleH = $size * 0.28
  $radius = $capsuleH / 2

  $state = $g.Save()
  $g.TranslateTransform($size / 2, $size / 2)
  $g.RotateTransform(-45)
  $g.TranslateTransform(-$capsuleW / 2, -$capsuleH / 2)

  $path = Get-RoundedRectPath 0 0 $capsuleW $capsuleH $radius

  $bodyBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#F1E4C7'))
  $g.FillPath($bodyBrush, $path)

  $g.SetClip((New-Object System.Drawing.RectangleF(0, 0, ($capsuleW / 2), $capsuleH)))
  $capBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#D98F4E'))
  $g.FillPath($capBrush, $path)
  $g.ResetClip()

  $g.Restore($state)

  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

New-SupplerverIcon 192 (Join-Path $iconsDir "icon-192.png")
New-SupplerverIcon 512 (Join-Path $iconsDir "icon-512.png")
New-SupplerverIcon 180 (Join-Path $iconsDir "apple-touch-icon.png")

Write-Host "Icons generated in $iconsDir"
