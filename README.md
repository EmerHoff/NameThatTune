# 🎵 Music Quiz - Deezer

Um jogo de quiz musical interativo onde você ouve previews de músicas e tenta adivinhar qual é a música correta. O projeto usa apenas HTML, CSS e JavaScript puro, sem necessidade de servidor Node.js.

## ✨ Características

- 🎮 **Jogo de Quiz Musical**: Escute previews de 5 músicas aleatórias e adivinhe qual é a correta
- 🎨 **Interface Moderna**: Design elegante e responsivo
- 🎵 **Player Personalizado**: Controle de volume, barra de progresso e visualização de tempo
- 🎯 **Feedback Visual**: Indicadores visuais para respostas corretas e incorretas
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 🚀 **Sem Servidor**: Funciona diretamente no navegador, sem necessidade de backend

## 🏗️ Estrutura do Projeto

```
public/
├── index.html              # Página principal
├── styles/
│   └── main.css            # Estilos principais
└── js/
    ├── main.js             # Entry point
    ├── services/
    │   └── deezer.service.js    # Serviço de API do Deezer
    ├── components/
    │   ├── Player.js            # Componente do player de música
    │   ├── AnswerOptions.js     # Componente das opções de resposta
    │   ├── ScoreBoard.js        # Componente do placar
    │   └── Modal.js             # Componente do modal de resultados
    ├── utils/
    │   └── audio.util.js        # Utilitários de áudio
    └── game/
        ├── game.state.js        # Gerenciamento de estado do jogo
        └── game.controller.js   # Controlador do jogo
```

## 🚀 Como Usar

### Simples: Abra diretamente no navegador!

1. Abra o arquivo `public/index.html` diretamente no seu navegador
2. O jogo carrega automaticamente

**Como funciona**: O projeto usa proxies CORS públicos para fazer requisições à API do Deezer, então funciona sem necessidade de servidor local!

**Nota**: Se alguma requisição falhar, o sistema tenta automaticamente outros proxies. É normal haver um pequeno delay na primeira carga.

## 🎮 Como Jogar

1. O jogo carrega automaticamente 5 músicas aleatórias de artistas diferentes
2. Para cada música:
   - Clique no botão play para ouvir o preview
   - Ajuste o volume se necessário
   - Escolha a música correta entre as 4 opções
3. Após selecionar uma resposta:
   - Você verá feedback visual (verde para correto, vermelho para incorreto)
   - Se acertar, a capa do álbum será exibida
   - O jogo avança automaticamente para a próxima música
4. Ao final das 5 músicas, você verá seu resultado final

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização e animações
- **JavaScript ES6+**: Lógica do jogo e interações
- **Deezer API**: Busca de músicas e previews
- **Módulos ES6**: Organização modular do código

## 📝 Arquitetura

O projeto está organizado em uma arquitetura modular:

- **Services**: Comunicação com APIs externas
- **Components**: Componentes visuais reutilizáveis
- **Utils**: Funções utilitárias
- **Game**: Lógica específica do jogo (estado e controlador)

Cada componente é responsável por uma funcionalidade específica, facilitando manutenção e extensão.

## 🔧 Desenvolvimento

### Adicionar novos componentes

1. Crie o arquivo em `public/js/components/`
2. Exporte a classe usando `export default`
3. Importe no arquivo que vai usar: `import ComponentName from './components/ComponentName.js'`

### Modificar o serviço de API

Edite `public/js/services/deezer.service.js` para alterar como as músicas são buscadas.

### Personalizar estilos

Edite `public/styles/main.css` para alterar a aparência do jogo.

## 🌐 API Utilizada

Este projeto usa a [API pública do Deezer](https://developers.deezer.com/api), que não requer autenticação para buscas básicas. A API fornece:

- Busca de músicas
- Previews de áudio (30 segundos)
- Capas de álbuns
- Informações de artistas

## 📄 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 🔧 Como Funciona

O projeto usa **proxies CORS públicos** para contornar as restrições de segurança do navegador. Quando você abre o arquivo diretamente (`file://`), o navegador normalmente bloqueia requisições para APIs externas. Para resolver isso, o código usa serviços de proxy CORS que fazem as requisições em seu nome.

O sistema tenta automaticamente múltiplos proxies se algum falhar, garantindo maior confiabilidade.

## 🐛 Problemas Conhecidos

- Se todos os proxies estiverem indisponíveis, você pode ver erros de conexão. Nesse caso, tente novamente mais tarde.
- Algumas músicas podem não ter preview disponível na API do Deezer.
- A primeira carga pode ser um pouco mais lenta devido ao uso de proxies.

## 🤝 Contribuindo

Sinta-se à vontade para abrir issues ou pull requests com melhorias!
