# 🚀 Guia de Configuração Rápida

## Para Usar sem Servidor (Recomendado)

### Opção 1: Python
```bash
cd public
python3 -m http.server 8000
```
Acesse: http://localhost:8000

### Opção 2: Node.js
```bash
npm install -g http-server
cd public
http-server -p 8000
```
Acesse: http://localhost:8000

### Opção 3: PHP
```bash
cd public
php -S localhost:8000
```
Acesse: http://localhost:8000

## Estrutura Criada

```
public/
├── index.html                    # Página principal
├── styles/
│   └── main.css                  # Estilos
└── js/
    ├── main.js                   # Entry point
    ├── services/
    │   └── deezer.service.js     # API do Deezer
    ├── components/
    │   ├── Player.js             # Player de música
    │   ├── AnswerOptions.js      # Opções de resposta
    │   ├── ScoreBoard.js         # Placar
    │   └── Modal.js              # Modal de resultados
    ├── utils/
    │   └── audio.util.js         # Utilitários de áudio
    └── game/
        ├── game.state.js         # Estado do jogo
        └── game.controller.js    # Controlador do jogo
```

## Funcionalidades

✅ HTML/JS puro - sem necessidade de Node.js ou servidor  
✅ Arquitetura modular - código organizado em componentes  
✅ API do Deezer - busca músicas diretamente do navegador  
✅ Player completo - controle de volume, progresso, play/pause  
✅ Feedback visual - indicações de acerto/erro  
✅ Responsivo - funciona em desktop e mobile  

## Notas Importantes

- Alguns navegadores podem bloquear CORS ao abrir `index.html` diretamente
- Use um servidor HTTP simples (veja opções acima) para evitar problemas
- O projeto usa módulos ES6, então precisa ser servido via HTTP (não file://)

