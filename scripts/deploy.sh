#!/bin/bash

# Скрипт для автоматического переключения .env файлов при деплое
# Использование: ./scripts/deploy.sh [dev|staging|ic]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверяем аргумент
if [ $# -eq 0 ]; then
    error "Укажите сеть для деплоя: dev, staging или ic"
    echo "Использование: $0 [dev|staging|ic]"
    exit 1
fi

NETWORK=$1

# Проверяем существование .env файла для указанной сети
ENV_FILE=".env.$NETWORK"
if [ ! -f "$ENV_FILE" ]; then
    error "Файл $ENV_FILE не найден!"
    exit 1
fi

log "Деплой в сеть: $NETWORK"
log "Используется файл: $ENV_FILE"

# Сохраняем текущий .env файл если он существует
if [ -f ".env" ]; then
    log "Сохраняю текущий .env файл как .env.backup"
    cp .env .env.backup
fi

# Копируем нужный .env файл
log "Копирую $ENV_FILE в .env"
cp "$ENV_FILE" .env

# Собираем проект
log "Собираю проект..."
npm run build

# Деплоим
log "Деплою в сеть $NETWORK..."
export DFX_WARNING=-mainnet_plaintext_identity
echo 'yes' | dfx deploy frontend --network "$NETWORK" --mode reinstall

# Восстанавливаем .env файл
if [ -f ".env.backup" ]; then
    log "Восстанавливаю исходный .env файл"
    mv .env.backup .env
else
    log "Удаляю временный .env файл"
    rm .env
fi

log "Деплой завершен успешно!"
