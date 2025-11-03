# Changelog - MAKI IA

## [Correções] - 2025-01-XX

### Corrigido
- ✅ Dockerfile: Script de inicialização criado antes de mudar para usuário não-root
- ✅ Dockerfile: Verificações de arquivos durante build
- ✅ Dockerfile: Permissões garantidas para templates e static
- ✅ app.py: Melhorias no endpoint de debug com mais informações
- ✅ app.py: Logging melhorado para diagnóstico
- ✅ docker-compose.yml: Configurações otimizadas
- ✅ deploy.sh: Verificações adicionais e diagnóstico
- ✅ Novo script: diagnostico.sh para troubleshooting

### Adicionado
- 📝 Script `diagnostico.sh` para diagnóstico completo
- 📝 Arquivo `SOLUCAO_PROBLEMA.md` com guia de troubleshooting
- 📝 Arquivo `DEPLOY_RAPIDO.md` com guia rápido de deploy
- 📝 Arquivo `TESTE_AGENT.md` com instruções de teste

### Melhorias
- 🔧 Dockerfile agora verifica arquivos em múltiplas etapas
- 🔧 Script de inicialização mostra status dos arquivos
- 🔧 Endpoint `/api/debug/files` com informações detalhadas
- 🔧 Deploy.sh com verificações automáticas

### Notas Importantes
- ⚠️ Certifique-se de usar HTTP (não HTTPS) para acessar: `http://45.70.136.66`
- ⚠️ Execute `./diagnostico.sh` se houver problemas
- ⚠️ Reconstrua a imagem com `docker-compose build --no-cache` após mudanças

