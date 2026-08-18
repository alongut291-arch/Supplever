Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$iconsDir = Join-Path $root "icons"
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

# Exact transforms copied from the ring-of-capsules logo in supplever-cover.html / index.html.
# Each entry: translateX, translateY, rotateDegrees (viewBox is 0 0 84 56).
$capsules = @(
  @(76,   28,    90),
  @(72.63,43.64, 120.6),
  @(63.2, 47.5, -161.49),
  @(49.57,36.68,-132.61),
  @(34.43,19.32,-132.61),
  @(20.8, 8.5,  -161.49),
  @(11.37,12.36, 120.6),
  @(8,    28,    90),
  @(11.37,43.64, 59.4),
  @(20.8, 47.5, -18.51),
  @(34.43,36.68,-47.39),
  @(49.57,19.32,-47.39),
  @(63.2, 8.5,  -18.51),
  @(72.63,12.36, 59.4)
)

$viewCenterX = 42
$viewCenterY = 28

# NOTE: parameters MUST be explicitly typed [double]. Without it, PowerShell's
# command-mode argument parser binds a literal like -7 as the STRING "-7"
# (not the number -7), which silently turns "+"/"-" arithmetic below into
# string concatenation and produces wildly wrong coordinates.
function Get-RoundedPillPath([double]$x, [double]$y, [double]$width, [double]$height, [double]$radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $radius * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $width - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $width - $d, $y + $height - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $height - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-SupplerverRingIcon([double]$size, [string]$outPath) {
  $bmp = New-Object System.Drawing.Bitmap ([int]$size), ([int]$size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $bg = [System.Drawing.ColorTranslator]::FromHtml('#1F4A43')
  $g.Clear($bg)

  $margin = $size * 0.16
  $drawable = $size - 2 * $margin
  $scale = $drawable / 84.0
  $canvasCenterX = $size / 2.0
  $canvasCenterY = $size / 2.0

  $bodyBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#F1E4C7'))
  $capBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#D98F4E'))
  $penColor = [System.Drawing.Color]::FromArgb(56, 24, 39, 32)
  $strokePen = New-Object System.Drawing.Pen -ArgumentList $penColor, ([double](0.6 * $scale))

  foreach ($c in $capsules) {
    $tx = [double]$c[0]; $ty = [double]$c[1]; $angle = [double]$c[2]
    $screenX = $canvasCenterX + ($tx - $viewCenterX) * $scale
    $screenY = $canvasCenterY + ($ty - $viewCenterY) * $scale

    $state = $g.Save()
    $g.TranslateTransform([double]$screenX, [double]$screenY)
    $g.RotateTransform([double]$angle)
    $g.ScaleTransform([double]$scale, [double]$scale)

    $pillPath = Get-RoundedPillPath -7.0 -3.5 14.0 7.0 3.5
    $g.FillPath($bodyBrush, $pillPath)
    $g.DrawPath($strokePen, $pillPath)

    $clipRect = New-Object System.Drawing.RectangleF -ArgumentList ([single]-7.5), ([single]-4.0), ([single]7.5), ([single]8.0)
    $g.SetClip($clipRect)
    $g.FillPath($capBrush, $pillPath)
    $g.ResetClip()

    $g.Restore($state)
  }

  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

New-SupplerverRingIcon 192.0 (Join-Path $iconsDir "icon-192.png")
New-SupplerverRingIcon 512.0 (Join-Path $iconsDir "icon-512.png")
New-SupplerverRingIcon 180.0 (Join-Path $iconsDir "apple-touch-icon.png")

Write-Host "Ring-logo icons generated in $iconsDir"
