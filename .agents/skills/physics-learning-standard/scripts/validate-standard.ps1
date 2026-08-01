param(
    [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'

$failures = New-Object System.Collections.Generic.List[string]

function Write-Pass {
    param([string]$Message)
    Write-Host "[PASS] $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    $script:failures.Add($Message) | Out-Null
    Write-Host "[FAIL] $Message" -ForegroundColor Red
}

function Get-Text {
    param([string]$RelativePath)
    $path = Join-Path $Root $RelativePath
    return Get-Content -LiteralPath $path -Raw -Encoding UTF8
}

function Require-File {
    param([string]$RelativePath)

    $path = Join-Path $Root $RelativePath

    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        Write-Fail "$RelativePath is missing."
        return
    }

    if ((Get-Item -LiteralPath $path).Length -le 0) {
        Write-Fail "$RelativePath is empty."
        return
    }

    Write-Pass "$RelativePath exists."
}

function Require-Directory {
    param([string]$RelativePath)

    $path = Join-Path $Root $RelativePath

    if (Test-Path -LiteralPath $path -PathType Container) {
        Write-Pass "$RelativePath directory exists."
    }
    else {
        Write-Fail "$RelativePath directory is missing."
    }
}

function Require-Contains {
    param(
        [string]$RelativePath,
        [string]$Pattern,
        [string]$Message
    )

    $text = Get-Text $RelativePath

    if ($text -match $Pattern) {
        Write-Pass $Message
    }
    else {
        Write-Fail $Message
    }
}

function Require-NoMatch {
    param(
        [string]$Pattern,
        [string]$Message
    )

    $matches = Get-ChildItem -LiteralPath $Root -Recurse -File |
        Where-Object { $_.FullName -notmatch '\\.git\\' } |
        ForEach-Object {
            $content = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
            if ($content -match $Pattern) {
                $_.FullName
            }
        }

    if ($matches) {
        Write-Fail "$Message Found in: $($matches -join ', ')"
    }
    else {
        Write-Pass $Message
    }
}

Write-Host "Validating Physics Learning Standard at: $Root"
Write-Host ""

$requiredFiles = @(
    'README.md',
    'VERSION.md',
    'CHANGELOG.md',
    'Principles.md',
    'Architecture.md',
    'Architecture-Enforcement.md',
    'Folder-Structure.md',
    'Repository-Profiles.md',
    'Standard-Compliance-Checklist.md',
    'Physics-Standards.md',
    'Units-and-Notation.md',
    'Simulation-Standards.md',
    'Dynamic-Quiz-System-Rules.md',
    'Validation-Workflow.md',
    'README-Template.md',
    'Coding-Standards.md',
    'Naming-Conventions.md',
    'Canvas-Guidelines.md',
    'UI-Guidelines.md',
    'Formula-Display.md',
    'Accessibility.md',
    'AI-Agent-Rules.md',
    'AGENTS.md',
    'Decision-Records.md',
    'LICENSE',
    'scripts/validate-standard.ps1',
    'adr/README.md',
    'adr/0001-adopt-domain-centric-architecture.md',
    'adr/0002-define-repository-profiles-and-compliance.md',
    'adr/0003-define-architecture-enforcement-rules.md',
    'adr/0004-define-physics-domain-standards.md',
    'adr/0005-define-validation-workflow.md',
    'adr/0006-define-dynamic-quiz-system-rules.md'
)

foreach ($file in $requiredFiles) {
    Require-File $file
}

Require-Directory 'adr'
Require-Directory 'scripts'

$versionText = Get-Text 'VERSION.md'
$versionMatch = [regex]::Match($versionText, 'Current version:\s*`(?<version>[^`]+)`')

if ($versionMatch.Success) {
    $currentVersion = $versionMatch.Groups['version'].Value
    Write-Pass "VERSION.md declares current version $currentVersion."
}
else {
    $currentVersion = $null
    Write-Fail 'VERSION.md does not declare Current version in the expected format.'
}

$templateText = Get-Text 'README-Template.md'
$templateMatch = [regex]::Match($templateText, 'Template version:\s*(?<version>[0-9]+\.[0-9]+\.[0-9]+)')

if ($templateMatch.Success) {
    $templateVersion = $templateMatch.Groups['version'].Value
    Write-Pass "README-Template.md declares template version $templateVersion."
}
else {
    $templateVersion = $null
    Write-Fail 'README-Template.md does not declare Template version in the expected format.'
}

if ($currentVersion -and $templateVersion) {
    if ($currentVersion -eq $templateVersion) {
        Write-Pass 'README template version matches current standard version.'
    }
    else {
        Write-Fail "README template version ($templateVersion) does not match current standard version ($currentVersion)."
    }
}

if ($currentVersion) {
    $escapedVersion = [regex]::Escape($currentVersion)
    Require-Contains 'CHANGELOG.md' "# $escapedVersion - \d{4}-\d{2}-\d{2}" "CHANGELOG.md contains the current version entry."
    Require-Contains 'README.md' "v$escapedVersion" "README.md contains the current version example."
    Require-Contains 'VERSION.md' ('Version `' + $escapedVersion + '`') "VERSION.md contains the current baseline description."
}

$readmeTemplateHeadings = [regex]::Matches($templateText, '(?m)^# [0-9]+\.').Count
if ($readmeTemplateHeadings -eq 10) {
    Write-Pass 'README-Template.md keeps the 10 required numbered sections.'
}
else {
    Write-Fail "README-Template.md has $readmeTemplateHeadings numbered sections; expected 10."
}

$coreDocs = @(
    'Principles.md',
    'Architecture.md',
    'Architecture-Enforcement.md',
    'Folder-Structure.md',
    'Repository-Profiles.md',
    'Standard-Compliance-Checklist.md',
    'Physics-Standards.md',
    'Units-and-Notation.md',
    'Simulation-Standards.md',
    'Dynamic-Quiz-System-Rules.md',
    'Validation-Workflow.md',
    'README-Template.md',
    'Coding-Standards.md',
    'Naming-Conventions.md',
    'Canvas-Guidelines.md',
    'UI-Guidelines.md',
    'Formula-Display.md',
    'Accessibility.md',
    'AI-Agent-Rules.md',
    'Decision-Records.md'
)

foreach ($doc in $coreDocs) {
    Require-Contains 'README.md' ([regex]::Escape($doc)) "README.md references $doc."
}

Require-Contains 'README.md' 'scripts/validate-standard\.ps1' 'README.md references the standard validation script.'
Require-Contains 'AGENTS.md' 'Validation-Workflow\.md' 'AGENTS.md references Validation-Workflow.md.'
Require-Contains 'AGENTS.md' 'Dynamic-Quiz-System-Rules\.md' 'AGENTS.md references Dynamic-Quiz-System-Rules.md.'
Require-Contains 'AGENTS.md' 'scripts/validate-standard\.ps1' 'AGENTS.md references the standard validation script.'
Require-Contains 'AI-Agent-Rules.md' 'Validation-Workflow\.md' 'AI-Agent-Rules.md references Validation-Workflow.md.'
Require-Contains 'AI-Agent-Rules.md' 'Dynamic-Quiz-System-Rules\.md' 'AI-Agent-Rules.md references Dynamic-Quiz-System-Rules.md.'
Require-Contains 'CONTRIBUTING.md' 'Validation-Workflow\.md' 'CONTRIBUTING.md references Validation-Workflow.md.'
Require-Contains 'Standard-Compliance-Checklist.md' 'Validation-Workflow\.md' 'Standard-Compliance-Checklist.md references Validation-Workflow.md.'
Require-Contains 'Standard-Compliance-Checklist.md' 'Dynamic-Quiz-System-Rules\.md' 'Standard-Compliance-Checklist.md references Dynamic-Quiz-System-Rules.md.'
Require-Contains 'README-Template.md' '## Validate' 'README-Template.md includes a validation command section.'
Require-Contains 'README-Template.md' 'Dynamic-Quiz-System-Rules\.md' 'README-Template.md references Dynamic-Quiz-System-Rules.md.'

$adrIndexText = Get-Text 'adr/README.md'
$adrFiles = Get-ChildItem -LiteralPath (Join-Path $Root 'adr') -File |
    Where-Object { $_.Name -match '^[0-9]{4}-.*\.md$' }

foreach ($adr in $adrFiles) {
    if ($adrIndexText -match [regex]::Escape($adr.Name)) {
        Write-Pass "adr/README.md indexes $($adr.Name)."
    }
    else {
        Write-Fail "adr/README.md does not index $($adr.Name)."
    }
}

$markdownFiles = Get-ChildItem -LiteralPath $Root -Recurse -File -Filter '*.md'

foreach ($markdownFile in $markdownFiles) {
    $content = Get-Content -LiteralPath $markdownFile.FullName -Raw -Encoding UTF8
    $fenceCount = [regex]::Matches($content, '```').Count

    if (($fenceCount % 2) -eq 0) {
        Write-Pass "Markdown fences are balanced in $($markdownFile.Name)."
    }
    else {
        Write-Fail "Markdown fences are not balanced in $($markdownFile.FullName)."
    }
}

if (Test-Path -LiteralPath (Join-Path $Root 'LICENSE.md')) {
    Write-Fail 'LICENSE.md exists. Use LICENSE without an extension for the standard repository license.'
}
else {
    Write-Pass 'LICENSE uses the expected extensionless filename.'
}

Require-NoMatch 'docs/(Architecture|AI-Agent-Rules|Decision-Records)' 'No obsolete docs/... references remain.'

Write-Host ""

if ($failures.Count -gt 0) {
    Write-Host "Validation failed with $($failures.Count) issue(s):" -ForegroundColor Red
    foreach ($failure in $failures) {
        Write-Host "- $failure" -ForegroundColor Red
    }
    exit 1
}

Write-Host 'Validation passed. No blocking issues found.' -ForegroundColor Green
exit 0
