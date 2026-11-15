@echo off
start "MilkWorld Backend" /D "C:\Users\timur\Desktop\milk-world\backend-node" cmd /k "npm run dev"
start "MilkWorld Frontend" /D "C:\Users\timur\Desktop\milk-world\frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
start "Tuna Tunnel" cmd /k "tuna http 5173 --subdomain=happy-tapir-5836"
