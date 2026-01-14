#!/bin/bash

# Script to convert TSX files to JSX by removing TypeScript syntax

# List of all TSX files to convert
files=(
  "src/components/ui/accordion.tsx"
  "src/components/ui/alert-dialog.tsx"
  "src/components/ui/alert.tsx"
  "src/components/ui/aspect-ratio.tsx"
  "src/components/ui/avatar.tsx"
  "src/components/ui/badge.tsx"
  "src/components/ui/breadcrumb.tsx"
  "src/components/ui/button.tsx"
  "src/components/ui/calendar.tsx"
  "src/components/ui/card.tsx"
  "src/components/ui/carousel.tsx"
  "src/components/ui/chart.tsx"
  "src/components/ui/checkbox.tsx"
  "src/components/ui/collapsible.tsx"
  "src/components/ui/command.tsx"
  "src/components/ui/context-menu.tsx"
  "src/components/ui/dialog.tsx"
  "src/components/ui/drawer.tsx"
  "src/components/ui/dropdown-menu.tsx"
  "src/components/ui/form.tsx"
  "src/components/ui/hover-card.tsx"
  "src/components/ui/input-otp.tsx"
  "src/components/ui/input.tsx"
  "src/components/ui/label.tsx"
  "src/components/ui/menubar.tsx"
  "src/components/ui/navigation-menu.tsx"
  "src/components/ui/pagination.tsx"
  "src/components/ui/popover.tsx"
  "src/components/ui/progress.tsx"
  "src/components/ui/radio-group.tsx"
  "src/components/ui/resizable.tsx"
  "src/components/ui/scroll-area.tsx"
  "src/components/ui/select.tsx"
  "src/components/ui/separator.tsx"
  "src/components/ui/sheet.tsx"
  "src/components/ui/sidebar.tsx"
  "src/components/ui/skeleton.tsx"
  "src/components/ui/slider.tsx"
  "src/components/ui/sonner.tsx"
  "src/components/ui/switch.tsx"
  "src/components/ui/table.tsx"
  "src/components/ui/tabs.tsx"
  "src/components/ui/textarea.tsx"
  "src/components/ui/toast.tsx"
  "src/components/ui/toaster.tsx"
  "src/components/ui/toggle-group.tsx"
  "src/components/ui/toggle.tsx"
  "src/components/ui/tooltip.tsx"
  "src/components/NavLink.tsx"
  "src/hooks/use-mobile.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Get the new filename with .jsx extension
    newfile="${file%.tsx}.jsx"
    
    # Copy the file with new extension
    cp "$file" "$newfile"
    
    # Remove old tsx file
    rm "$file"
    
    echo "Converted: $file -> $newfile"
  else
    echo "File not found: $file"
  fi
done

echo "Done! Files renamed. Now you need to manually edit to remove TypeScript syntax."
