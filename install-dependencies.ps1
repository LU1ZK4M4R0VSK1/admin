# Script de instalação de dependências - Analytics Project
# Este script instala todas as dependências necessárias para o projeto

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Analytics Project - Setup Script     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Função para verificar se um comando existe
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Verificar Node.js
Write-Host "[1/5] Verificando Node.js..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "✗ Node.js não encontrado! Por favor, instale o Node.js." -ForegroundColor Red
    Write-Host "  Download: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar .NET SDK
Write-Host "[2/5] Verificando .NET SDK..." -ForegroundColor Yellow
if (Test-Command "dotnet") {
    $dotnetVersion = dotnet --version
    Write-Host "✓ .NET SDK encontrado: $dotnetVersion" -ForegroundColor Green
}
else {
    Write-Host "✗ .NET SDK não encontrado! Por favor, instale o .NET 8.0 SDK." -ForegroundColor Red
    Write-Host "  Download: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalando Dependências do Backend   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Instalar dependências do Backend
Write-Host "[3/5] Restaurando pacotes NuGet do backend..." -ForegroundColor Yellow
Set-Location -Path "backend"

try {
    dotnet restore
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Pacotes NuGet restaurados com sucesso!" -ForegroundColor Green
    }
    else {
        Write-Host "✗ Erro ao restaurar pacotes NuGet" -ForegroundColor Red
        Set-Location -Path ".."
        exit 1
    }
}
catch {
    Write-Host "✗ Erro ao restaurar pacotes: $_" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

# Verificar e aplicar migrações do banco de dados
Write-Host "[4/5] Aplicando migrações do banco de dados..." -ForegroundColor Yellow
try {
    dotnet ef database update
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Banco de dados atualizado com sucesso!" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Aviso: Não foi possível aplicar migrações automaticamente" -ForegroundColor Yellow
        Write-Host "  Execute manualmente: cd backend && dotnet ef database update" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠ Aviso: Erro ao aplicar migrações: $_" -ForegroundColor Yellow
    Write-Host "  Execute manualmente: cd backend && dotnet ef database update" -ForegroundColor Yellow
}

Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalando Dependências do Frontend  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Instalar dependências do Frontend
Write-Host "[5/5] Instalando pacotes npm do frontend..." -ForegroundColor Yellow
Set-Location -Path "frontend"

# Verificar se tsconfig.node.json existe, se não, criar
if (-not (Test-Path "tsconfig.node.json")) {
    Write-Host "⚠ Criando tsconfig.node.json..." -ForegroundColor Yellow
    $tsconfigNodeContent = @"
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
"@
    $tsconfigNodeContent | Out-File -FilePath "tsconfig.node.json" -Encoding UTF8
    Write-Host "✓ tsconfig.node.json criado!" -ForegroundColor Green
}

try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Pacotes npm instalados com sucesso!" -ForegroundColor Green
    }
    else {
        Write-Host "✗ Erro ao instalar pacotes npm" -ForegroundColor Red
        Set-Location -Path ".."
        exit 1
    }
}
catch {
    Write-Host "✗ Erro ao instalar pacotes: $_" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Instalação Concluída com Sucesso!    " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o projeto:" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend && dotnet run" -ForegroundColor White
Write-Host "  Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Acesse o frontend em: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend API em: http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
