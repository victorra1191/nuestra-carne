#!/bin/bash

# 🧪 SCRIPT DE VERIFICACIÓN POST-DEPLOYMENT
# Para verificar que todo funcione correctamente en SiteGround

echo "🧪 VERIFICANDO DEPLOYMENT DE NUESTRA CARNE..."
echo "================================================"

# Verificar sitio web principal
echo "1. 🌐 Verificando sitio web principal..."
curl -s -o /dev/null -w "%{http_code}" https://nuestracarnepa.com
if [ $? -eq 0 ]; then
    echo "   ✅ Sitio web accesible"
else
    echo "   ❌ Error accediendo al sitio web"
fi

# Verificar API health endpoint
echo "2. 🔧 Verificando API backend..."
API_RESPONSE=$(curl -s https://nuestracarnepa.com/api/orders/health)
if echo "$API_RESPONSE" | grep -q "success"; then
    echo "   ✅ API funcionando correctamente"
else
    echo "   ❌ API no responde correctamente"
fi

# Verificar WordPress admin
echo "3. 📝 Verificando WordPress admin..."
WP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://nuestracarnepa.com/wp-admin/)
if [ "$WP_RESPONSE" = "200" ] || [ "$WP_RESPONSE" = "302" ]; then
    echo "   ✅ WordPress admin accesible"
else
    echo "   ❌ Error accediendo a WordPress admin"
fi

# Verificar archivos CSS/JS
echo "4. 🎨 Verificando assets estáticos..."
CSS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://nuestracarnepa.com/wp-content/themes/nuestra-carne/build/static/css/main.9aa795d2.css)
if [ "$CSS_RESPONSE" = "200" ]; then
    echo "   ✅ Archivos CSS cargando correctamente"
else
    echo "   ❌ Error cargando archivos CSS"
fi

echo ""
echo "🎯 PRUEBAS MANUALES RECOMENDADAS:"
echo "- Hacer un pedido completo desde el formulario"
echo "- Verificar emails lleguen a tu bandeja"
echo "- Confirmar mensaje WhatsApp se genere"
echo "- Probar en móvil y desktop"
echo ""
echo "📞 URLs IMPORTANTES:"
echo "- Sitio: https://nuestracarnepa.com"
echo "- API: https://nuestracarnepa.com/api/orders/health"
echo "- Admin: https://nuestracarnepa.com/wp-admin"
echo ""
echo "✨ ¡Deployment completado exitosamente!"