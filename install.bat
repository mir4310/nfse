@echo off
cls
echo Visual Informatica - Instalando servico de Integracao SIGEP
echo.
echo.Atualizando pacote npm
call npm install -g npm
echo.
echo.
echo.Instalando node-windows
call npm install -g node-windows
echo.
echo.
echo Instalando dependências do projeto...
call npm install
echo.
echo.
echo.Instalando como servico...
call node uninstall_service.js
call node install_service.js
echo.
echo.Instalacao finalizada!