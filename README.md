# Front-End - BackChatHT

Este é o front-end do projeto **BackChatHT**, desenvolvido em **React + Vite**, com foco em interações com múltiplos chatbots personalizados via API.

---

## Tecnologias Utilizadas

- React (useState, useEffect, useRef)
- Vite (build tool)
- CSS Modules
- React Markdown
- Toastify (notificações)
- Fetch API (para chamadas REST)
- Variáveis de ambiente com Vite

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js (v18+ recomendado)
- Backend rodando localmente (`http://localhost:5184` ou conforme configurado)

### Passos

1. **Clone o repositório**

```bash
git clone https://github.com/Williamp783/Desafio-Front.git
cd seu-front-end
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o ambiente**

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_API_BASE=http://localhost:5184/api
```

Altere a URL conforme necessário para bater no seu backend.

4. **Execute o front-end**

```bash
npm run dev
```

Acesse o app no navegador: (http://localhost:5173)

---

## Funcionalidades

- Criar bots com nome e personalidade
- Listar bots existentes
- Conversar com o bot e ver respostas em tempo real
- Histórico de mensagens por bot
- Interface responsiva e interativa

---

Feito por um Dev Jr em evolução.
