# Instruções de Instalação

## Problema: Módulos não encontrados

Se você está recebendo erros como:
```
Cannot find module 'express' or its corresponding type declarations.
```

Isso significa que as dependências não foram instaladas.

## Solução

Execute o seguinte comando no terminal (onde o npm está disponível):

```bash
npm install
```

Isso instalará todas as dependências listadas no `package.json`:
- express
- cors
- axios
- dotenv
- E suas devDependencies (typescript, ts-node, etc.)

## Verificar se funcionou

Após instalar, verifique se os módulos foram instalados:

```bash
ls node_modules/express
ls node_modules/cors
```

Se esses diretórios existirem, as dependências foram instaladas corretamente.

## Executar o servidor

Depois de instalar as dependências:

```bash
npm run dev
```

## Alternativa: Usar npx

Se o npm não estiver no PATH, tente usar o caminho completo ou npx:

```bash
/usr/bin/npm install
```

Ou se você tem node_modules/.bin disponível:

```bash
./node_modules/.bin/ts-node src/server.ts
```

