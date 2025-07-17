#!/bin/bash
# Script para controlar el modo de mantenimiento

ENV_FILE="/app/frontend/.env"

case "$1" in
    "on"|"true"|"activar")
        echo "🔧 Activando modo de mantenimiento..."
        sed -i 's/REACT_APP_MAINTENANCE_MODE=false/REACT_APP_MAINTENANCE_MODE=true/' "$ENV_FILE"
        if ! grep -q "REACT_APP_MAINTENANCE_MODE=true" "$ENV_FILE"; then
            echo "REACT_APP_MAINTENANCE_MODE=true" >> "$ENV_FILE"
        fi
        echo "✅ Modo de mantenimiento ACTIVADO"
        ;;
    "off"|"false"|"desactivar")
        echo "🚀 Desactivando modo de mantenimiento..."
        sed -i 's/REACT_APP_MAINTENANCE_MODE=true/REACT_APP_MAINTENANCE_MODE=false/' "$ENV_FILE"
        echo "✅ Modo de mantenimiento DESACTIVADO"
        ;;
    "status"|"estado")
        if grep -q "REACT_APP_MAINTENANCE_MODE=true" "$ENV_FILE"; then
            echo "🔧 Modo de mantenimiento: ACTIVADO"
        else
            echo "🚀 Modo de mantenimiento: DESACTIVADO"
        fi
        ;;
    *)
        echo "Uso: $0 [on|off|status]"
        echo "  on/activar    - Activar mantenimiento"
        echo "  off/desactivar - Desactivar mantenimiento"
        echo "  status/estado  - Ver estado actual"
        ;;
esac

# Reiniciar frontend si se cambió el estado
if [ "$1" = "on" ] || [ "$1" = "off" ] || [ "$1" = "activar" ] || [ "$1" = "desactivar" ]; then
    echo "🔄 Reiniciando frontend..."
    sudo supervisorctl restart frontend
    echo "✅ Frontend reiniciado"
fi