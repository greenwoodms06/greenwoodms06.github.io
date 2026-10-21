param()
$ErrorActionPreference = 'Stop'
$packageRoot = $PSScriptRoot
$sceneData = Get-Content -LiteralPath (Join-Path $packageRoot 'scenes.json') -Raw | ConvertFrom-Json
function Format-SubtitleTime([double]$seconds) {
    $stamp = [TimeSpan]::FromMilliseconds([math]::Round($seconds * 1000))
    return ('{0:00}:{1:00}:{2:00},{3:000}' -f [math]::Floor($stamp.TotalHours), $stamp.Minutes, $stamp.Seconds, $stamp.Milliseconds)
}
function Wrap-Caption([string]$caption) {
    if ($caption.Length -le 42) { return $caption }
    $words = @($caption -split '\s+')
    $bestLines = $null
    $bestDifference = [int]::MaxValue
    for ($splitIndex = 1; $splitIndex -lt $words.Count; $splitIndex++) {
        $firstLine = $words[0..($splitIndex - 1)] -join ' '
        $secondLine = $words[$splitIndex..($words.Count - 1)] -join ' '
        $difference = [math]::Abs($firstLine.Length - $secondLine.Length)
        if (($firstLine.Length -le 42) -and ($secondLine.Length -le 42) -and ($difference -lt $bestDifference)) {
            $bestLines = $firstLine + "`n" + $secondLine
            $bestDifference = $difference
        }
    }
    if ($null -eq $bestLines) { throw ('Caption exceeds two lines: ' + $caption) }
    return $bestLines
}
$blocks = [System.Collections.Generic.List[string]]::new()
$transcript = [System.Collections.Generic.List[string]]::new()
$cueIndex = 1
$cursor = 0.0
foreach ($scene in $sceneData.scenes) {
    if ($scene.start -ne $cursor) { throw ('Noncontiguous scene ' + $scene.id) }
    $captionTranscript = ($scene.captions.text -join ' ')
    if ($captionTranscript -cne $scene.narration) { throw ('Transcript mismatch in scene ' + $scene.id) }
    foreach ($cue in $scene.captions) {
        if (($cue.start -ne $cursor) -or ($cue.end -le $cue.start) -or ($cue.end -gt $scene.end)) { throw ('Invalid caption timing in scene ' + $scene.id) }
        $captionLines = Wrap-Caption $cue.text
        $blocks.Add(($cueIndex.ToString() + "`n" + (Format-SubtitleTime $cue.start) + ' --> ' + (Format-SubtitleTime $cue.end) + "`n" + $captionLines))
        $cueIndex++
        $cursor = $cue.end
    }
    if ($cursor -ne $scene.end) { throw ('Caption does not end with scene ' + $scene.id) }
    $transcript.Add($scene.narration)
}
if ($cursor -ne $sceneData.duration_seconds) { throw 'Duration mismatch' }
Set-Content -LiteralPath (Join-Path $packageRoot 'captions.srt') -Value (($blocks -join "`n`n") + "`n") -Encoding utf8
Set-Content -LiteralPath (Join-Path $packageRoot 'narration.txt') -Value ($transcript -join "`n`n") -Encoding utf8
$voiceWords = (($transcript -join ' ') -split '\s+').Count
Write-Output ('Scenes: ' + $sceneData.scenes.Count + '; duration: ' + $cursor + ' seconds; cues: ' + ($cueIndex - 1) + '; narration: ' + $voiceWords + ' words.')
