$files = Get-ChildItem -Path "src" -Recurse | Where-Object { $_.Extension -eq ".tsx" -or $_.Extension -eq ".ts" }
foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    $updated = @()
    foreach ($line in $lines) {
        $updated += $line -replace 'primary-madani-dark', 'brand-blue-dark' -replace 'primary-madani', 'brand-blue' -replace 'secondary-alquds', 'brand-grey'
    }
    Set-Content -Path $file.FullName -Value $updated
}
Write-Host "Done replacing color tokens."
