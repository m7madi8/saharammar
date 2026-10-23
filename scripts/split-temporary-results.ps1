# One-off crop of verified Wikimedia composites into before/after pairs.
Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot '..\public\images\results\temporary'
$srcDir = Join-Path $outDir 'source'
New-Item -ItemType Directory -Force -Path $outDir, $srcDir | Out-Null

function Save-JpegCrop {
  param(
    [string]$SourcePath,
    [string]$DestPath,
    [int]$X,
    [int]$Y,
    [int]$Width,
    [int]$Height
  )
  $img = [System.Drawing.Image]::FromFile($SourcePath)
  $rect = New-Object System.Drawing.Rectangle($X, $Y, $Width, $Height)
  $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90L)
  $bmp.Save($DestPath, $enc, $encParams)
  $g.Dispose()
  $bmp.Dispose()
  $img.Dispose()
}

# Gingivitis: stacked (before top, after bottom) — DRosenbach, CC BY-SA 3.0
$g = Join-Path $srcDir 'gingivitis-composite.jpg'
Save-JpegCrop $g (Join-Path $outDir 'case-gingivitis-before.jpg') 0 0 495 320
Save-JpegCrop $g (Join-Path $outDir 'case-gingivitis-after.jpg') 0 319 495 320

# Feldspathic crowns: stacked (before top, after bottom) — AmirAttallah, CC BY-SA 4.0
$f = Join-Path $srcDir 'feldspathic-crowns-composite.jpg'
Save-JpegCrop $f (Join-Path $outDir 'case-feldspathic-before.jpg') 0 0 1280 640
Save-JpegCrop $f (Join-Path $outDir 'case-feldspathic-after.jpg') 0 640 1280 640

# Open bite orthodontics: side-by-side — Jeffrey Dorfman, CC BY-SA 3.0
$o = Join-Path $srcDir 'open-bite-composite.jpg'
Save-JpegCrop $o (Join-Path $outDir 'case-open-bite-before.jpg') 0 0 300 211
Save-JpegCrop $o (Join-Path $outDir 'case-open-bite-after.jpg') 300 0 300 211

# Braces / retainers: side-by-side — Jeffrey Dorfman, CC BY-SA 3.0
$b = Join-Path $srcDir 'orthodontic-braces-composite.jpg'
Save-JpegCrop $b (Join-Path $outDir 'case-orthodontic-before.jpg') 0 0 300 207
Save-JpegCrop $b (Join-Path $outDir 'case-orthodontic-after.jpg') 300 0 300 207

Write-Host 'Crops written to' $outDir
