//#!/data/data/com.termux/files/usr/bin/bash
# Script automático para instalar kirito-Bot-MD en Termux

REPO_URL="https://github.com/Deylin-Eliac/Kirito-Bot-MD"
REPO_NAME="Kirito-Bot-MD"
DEPENDENCIAS=(git nodejs ffmpeg imagemagick yarn)

function titulo() {
  echo -e "\e[35m
██╗░░██╗██╗██████╗░██╗████████╗░█████╗░  ██████╗░░█████╗░████████╗
██║░░██║██║██╔══██╗██║╚══██╔══╝██╔══██╗  ██╔══██╗██╔══██╗╚══██╔══╝
███████║██║██████╔╝██║░░░██║░░░██║░░██║  ██║░░██║███████║░░░██║░░░
██╔══██║██║██╔═══╝░██║░░░██║░░░██║░░██║  ██║░░██║██╔══██║░░░██║░░░
██║░░██║██║██║░░░░░██║░░░██║░░░╚█████╔╝  ██████╔╝██║░░██║░░░██║░░░
╚═╝░░╚═╝╚═╝╚═╝░░░░░╚═╝░░░╚═╝░░░░╚════╝░  ╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░
\e[0m"
}

function instalar_dependencia() {
  local paquete=$1
  echo -e "\033[01;34mInstalando $paquete...\033[0m"
  if command -v $paquete >/dev/null 2>&1; then
    echo -e "\033[01;32m$paquete ya está instalado.\033[0m"
  else
    if pkg install $paquete -y >/dev/null 2>&1; then
      echo -e "\033[01;32m$paquete instalado correctamente.\033[0m"
    else
      echo -e "\033[0;31mError al instalar $paquete. Instala manualmente.\033[0m"
      exit 1
    fi
  fi
}

function clonar_repo() {
  echo -e "\033[01;34mClonando repositorio...\033[0m"
  git clone $REPO_URL || {
    echo -e "\033[0;31mError al clonar el repositorio.\033[0m"
    exit 1
  }
  cd $REPO_NAME || {
    echo -e "\033[0;31mNo se pudo acceder al directorio $REPO_NAME.\033[0m"
    exit 1
  }
}

function instalar_bot() {
  echo -e "\033[01;34mInstalando dependencias del bot (Yarn y NPM)...\033[0m"
  yarn install || {
    echo -e "\033[0;31mError con yarn install.\033[0m"
    exit 1
  }
  npm install || {
    echo -e "\033[0;31mError con npm install.\033[0m"
    exit 1
  }
}

function iniciar_bot() {
  echo -e "\033[01;35mIniciando kirito-Bot-MD...\033[0m"
  npm start
}

# Ejecución
clear
titulo
echo -e "\033[01;33mInstalando dependencias necesarias...\033[0m"
for paquete in "${DEPENDENCIAS[@]}"; do
  instalar_dependencia $paquete
done

clonar_repo
instalar_bot
iniciar_bot