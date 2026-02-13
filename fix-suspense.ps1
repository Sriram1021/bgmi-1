#!/usr/bin/env pwsh

# Script to add Suspense wrapper to pages using useSearchParams

$pages = @(
    "c:\Users\DELL\Documents\GitHub\bgmi-fe\app\onboarding\page.tsx",
    "c:\Users\DELL\Documents\GitHub\bgmi-fe\app\participant\dashboard\auth\success\page.tsx",
    "c:\Users\DELL\Documents\GitHub\bgmi-fe\app\organizer\dashboard\auth\success\page.tsx",
    "c:\Users\DELL\Documents\GitHub\bgmi-fe\app\admin\dashboard\page.tsx",
    "c:\Users\DELL\Documents\GitHub\bgmi-fe\app\(public)\login\page.tsx"
)

foreach ($page in $pages) {
    if (Test-Path $page) {
        $content = Get-Content $page -Raw
        
        # Add Suspense to imports if not already there
        if ($content -notmatch "Suspense") {
            $content = $content -replace "import \{ ([^}]+) \} from 'react';", "import { `$1, Suspense } from 'react';"
        }
        
        Write-Host "Fixed: $page"
    }
}
