Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$iconsDir = Join-Path $root "icons"
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

# Ring-of-capsules logo, final shape (Aug 2026 revision): the 4 central "crossing" capsules are
# untouched from the original cover-page logo; the two side loops were rebuilt as true circles
# (radius ~17.5-20.5) offset further from center for an infinity-symbol look, with the two
# capsules nearest the crossing tilted slightly to face their own loop's center, and the two
# bottom-most capsules (one per loop) additionally rotated for visual balance. This exact list
# is also embedded as inline SVG in index.html and supplever-cover.html -- keep all three in sync.
# Each entry: translateX, translateY, rotateDegrees.
$capsules = @(
  @(49.57, 36.68, -132.61),
  @(34.43, 19.32, -132.61),
  @(34.43, 36.68, -47.39),
  @(49.57, 19.32, -47.39),

  @(88.5,  28.0,   90),
  @(81.04, 42.34,  145),
  @(63.84, 45.08,  197),
  @(81.04, 13.66,  35),
  @(63.84, 10.92,  -6),

  @(-4.5,  28.0,   90),
  @(2.96,  42.34,  35),
  @(20.16, 45.08,  -17),
  @(2.96,  13.66,  145),
  @(20.16, 10.92,  186)
)

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

function New-SupplerverRingIcon([double]$size, [string]$bgHex, [string]$outPath) {
  $bmp = New-Object System.Drawing.Bitmap ([int]$size), ([int]$size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml($bgHex))

  $minX = ($capsules | ForEach-Object { $_[0] } | Measure-Object -Minimum).Minimum
  $maxX = ($capsules | ForEach-Object { $_[0] } | Measure-Object -Maximum).Maximum
  $minY = ($capsules | ForEach-Object { $_[1] } | Measure-Object -Minimum).Minimum
  $maxY = ($capsules | ForEach-Object { $_[1] } | Measure-Object -Maximum).Maximum
  $spanX = $maxX - $minX + 16
  $spanY = $maxY - $minY + 16
  $boundsCenterX = ($maxX + $minX) / 2.0
  $boundsCenterY = ($maxY + $minY) / 2.0

  $margin = $size * 0.10
  $drawable = $size - 2 * $margin
  $scale = [Math]::Min($drawable / $spanX, $drawable / $spanY)
  $canvasCenterX = $size / 2.0
  $canvasCenterY = $size / 2.0

  $bodyBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#F1E4C7'))
  $capBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#D98F4E'))
  $penColor = [System.Drawing.Color]::FromArgb(56, 24, 39, 32)
  $strokePen = New-Object System.Drawing.Pen -ArgumentList $penColor, ([double](0.6 * $scale))

  foreach ($c in $capsules) {
    $tx = [double]$c[0]; $ty = [double]$c[1]; $angle = [double]$c[2]
    $screenX = $canvasCenterX + ($tx - $boundsCenterX) * $scale
    $screenY = $canvasCenterY + ($ty - $boundsCenterY) * $scale

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

$bg = '#2E6259'
New-SupplerverRingIcon 192.0 $bg (Join-Path $iconsDir "icon-192.png")
New-SupplerverRingIcon 512.0 $bg (Join-Path $iconsDir "icon-512.png")
New-SupplerverRingIcon 180.0 $bg (Join-Path $iconsDir "apple-touch-icon.png")

Write-Host "Ring-logo icons generated in $iconsDir"
