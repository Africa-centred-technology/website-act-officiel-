# Lit le fichier .env et charge chaque variable dans l'environnement du processus
Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*([^#=]+)\s*=\s*(.*)\s*$") {
        $name  = $matches[1]
        $value = $matches[2]
        # ⚡ Utilisation de ${} pour la variable dynamique
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# Définit une variable pour le modèle Qwen
[Environment]::SetEnvironmentVariable("NVIDIA_NIM_MODEL", "qwen/qwen3.5-397b-a17b", "Process")

Write-Host "✅ Variables NVIDIA NIM chargées et modèle Qwen prêt à être utilisé"