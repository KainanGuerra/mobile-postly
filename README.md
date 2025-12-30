# Mobile Postly 📱

Uma aplicação móvel moderna construída com React Native e Expo para gerenciamento de postagens e interação de usuários, desenvolvida como parte de um projeto da FIAP.

## 🚀 Visão Geral

O **Mobile Postly** é uma plataforma de rede social simplificada, projetada para facilitar a comunicação e o compartilhamento de ideias em um ambiente acadêmico ou corporativo. O projeto nasceu da necessidade de uma interface ágil e intuitiva para o gerenciamento de postagens, onde a hierarquia de usuários desempenha um papel fundamental na governança do conteúdo.

## 🎯 Objetivo
Prover uma experiência mobile fluida (Native-like) que permita aos usuários interagir com conteúdos em tempo real, garantindo que a segurança e o controle de acesso sejam mantidos de forma rigorosa através de diferentes níveis de privilégios (Alunos e Professores).



 🌐 **Acesse aqui:** [mobile-postly.vercel.app](https://mobile-postly.vercel.app/)

## 🧩 Metodologia e Desenvolvimento

O desenvolvimento deste projeto foi pautado em práticas modernas de engenharia de software:

- **Desenvolvimento Ágil:** Iterações focadas em entrega de valor, com separação clara de funcionalidades por módulos.
- **Mobile First:** Priorização da experiência em dispositivos móveis, utilizando o Expo para garantir paridade entre Android e iOS.
- **Clean Code:** Código escrito com foco na legibilidade e facilidade de manutenção, seguindo padrões de nomenclatura e responsabilidade única.

## 🏗 Arquitetura e Decisões de Design

A arquitetura do Postly foi desenhada para ser escalável e de fácil manutenção, utilizando o padrão de **Separation of Concerns (Separação de Preocupações)**:

1.  **Camada de Navegação (Expo Router):** Utiliza navegação baseada em arquivos, o que reduz o boilerplate e organiza as rotas de forma lógica e hierárquica (Auth vs. App).
2.  **Camada de Estado Global (Context API):** Gerenciamento centralizado de autenticação e dados do usuário logado, garantindo consistência em toda a aplicação sem a complexidade excessiva de bibliotecas maiores como Redux.
3.  **Camada de Serviços (Service Layer):** Centralização de todas as chamadas de API em `lib/api.ts`, isolando a lógica de comunicação HTTP dos componentes de interface.
4.  **Componentização Atômica:** Interface construída sobre componentes pequenos e reutilizáveis (Input, Button), facilitando atualizações visuais globais.

## ✨ Boas Práticas Implementadas

- **Tipagem Estrita (TypeScript):** Uso extensivo de interfaces e tipos para evitar erros em tempo de execução e melhorar o intellisense.
- **Segurança de Dados:** Uso de `Expo SecureStore` para persistência de tokens sensíveis, utilizando criptografia nativa do sistema operacional (Keychain no iOS e Keystore no Android).
- **Tratamento de Erros:** Implementação de feedbacks visuais (Toasts) e tratamentos de exceção em todas as chamadas assíncronas para garantir que o usuário nunca fique sem resposta.
- **Tematização Dinâmica:** Suporte nativo a Dark Mode e Light Mode através de um sistema de constantes centralizado.
- **Otimização de Performance:** Uso de componentes nativos do React Native (FlatList) para renderização eficiente de listas longas (Feed de posts e lista de usuários).

## 🛠 Tecnologias (Tech Stack)

- **Framework:** [Expo](https://expo.dev/) (SDK 52) com [React Native](https://reactnative.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Navegação:** [Expo Router](https://docs.expo.dev/router/introduction/) (Navegação baseada em arquivos com Stack e Tabs)
- **Ícones:** [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Autenticação:** Provedor de autenticação customizado usando Context API
- **Armazenamento:** `expo-secure-store` (Armazenamento criptografado para nativo) & `@react-native-async-storage/async-storage` (fallback para Web)
- **Feedback:** `react-native-toast-message`
- **Estilização:** Sistema de tema dinâmico com suporte aos modos Claro/Escuro (configurado em `constants/theme.ts`)

## 🏗 Arquitetura & Estrutura do Projeto

O projeto segue uma estrutura modular focada na separação de responsabilidades:

```text
├── app/                  # Diretório do Expo Router (Telas e navegação)
│   ├── (auth)/           # Fluxos de autenticação (Login/Cadastro)
│   ├── (home)/           # Abas principais protegidas (Feed/Perfil/Usuários)
│   ├── _layout.tsx       # Layout raiz, lógica de proteção e config de navegação
│   └── ...               # Telas independentes (Criar/Editar Post/Usuário, Alterar Senha)
├── assets/               # Ativos estáticos (imagens, logos, SVGs)
├── components/           # Componentes reutilizáveis
│   └── ui/               # Componentes de UI atômicos (Botão, Input)
├── constants/            # Temas, cores e constantes globais
├── contexts/             # Contextos React (Estado global como AuthContext)
├── hooks/                # Hooks customizados (Temas, esquemas de cores)
├── lib/                  # Configurações de biblioteca e serviços de API
│   ├── api.ts            # Métodos centralizados de serviço de API (Baseado em Fetch)
│   └── config.ts         # Configurações globais (URLs base)
└── scripts/              # Scripts de manutenção do projeto
```

## 🔐 Autenticação & Autorização

O aplicativo implementa um fluxo de autenticação robusto gerenciado pelo `AuthContext.tsx` e aplicado no nível de layout em `app/_layout.tsx`.

### Funções & Permissões (Roles):
- **ALUNO (STUDENT):**
    - Visualizar o feed.
    - Criar, editar e excluir suas próprias postagens.
    - Gerenciar seu próprio perfil.
- **PROFESSOR:**
    - Todas as permissões de Aluno.
    - Acesso à aba de gerenciamento de **Usuários**.
    - Criar, editar e remover outros usuários.
    - Alterar senhas de usuários.

### Segurança:
- Autenticação baseada em JWT.
- Tokens de autenticação são armazenados usando `SecureStore` em dispositivos móveis para criptografia em nível de hardware.
- Proteção de rotas impede o acesso não autorizado a telas protegidas.

## 🌐 Documentação Técnica da API

A aplicação se comunica com uma API RESTful hospedada em:
`https://fiap-code-project.onrender.com/fiap/v1`

### Principais Endpoints & Serviços (`lib/api.ts`):

| Módulo | Propósito | Método | Endpoint |
| :--- | :--- | :--- | :--- |
| **Auth** | Login de Usuário | POST | `/auth/sign-in` |
| **Auth** | Cadastro de Usuário | POST | `/auth/sign-up` |
| **Posts** | Listar Posts (Paginado/Busca) | GET | `/posts` |
| **Posts** | Criar Post | POST | `/posts` |
| **Posts** | Atualizar Post | PATCH | `/posts/:id` |
| **Posts** | Excluir Post (Soft delete) | PATCH | `/posts/:id/remove` |
| **Users** | Listar Usuários (Filtrável) | GET | `/auth` |
| **Users** | Atualizar Usuário | PATCH | `/auth/:id` |
| **Users** | Excluir Usuário (Soft delete) | PATCH | `/auth/:id/remove` |

## 🎨 Design UI/UX

- **Cor Primária:** `#8a2be2` (BlueViolet)
- **Tipografia:** Pilha de fontes nativas do sistema para desempenho e visual ideal.
- **Componentes:** Construídos do zero para garantir uma experiência leve e consistente em todas as plataformas.

## 🚀 Começando (Getting Started)

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Aplicativo [Expo Go](https://expo.dev/go) no seu dispositivo móvel

### Instalação
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

### Executando o App
- **Iniciar Servidor de Desenvolvimento:**
  ```bash
  npx expo start
  ```
- **Executar no Emulador Android:**
  ```bash
  npx expo run:android
  ```
- **Executar no Simulador iOS:**
  ```bash
  npx expo run:ios
  ```
- **Executar na Web:**
  ```bash
  npx expo start --web
  ```

## 📝 Scripts

- `npm start`: Inicia o servidor de desenvolvimento do Expo.
- `npm run android`: Executa o app em um dispositivo/emulador Android.
- `npm run ios`: Executa o app em um dispositivo/simulador iOS.
- `npm run web`: Abre o app em um navegador web.
- `npm run lint`: Executa o ESLint para verificar problemas de qualidade de código.