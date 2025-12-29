# 📌 Mobile Postly - FIAP

Aplicativo móvel desenvolvido em **React Native** com **Expo** para o projeto Tech Challenge da FIAP.
Este repositório contém o código-fonte do aplicativo mobile (Android, iOS e Web), integrando com a API para permitir que professores e alunos compartilhem conteúdos e interajam em tempo real.

## 📄 Documentação

Para informações adicionais, credenciais de autenticação e regras de negócio, consulte a documentação interna:

🔗 [**Google Docs (Fiap Tech Challenge)**](https://docs.google.com/document/d/1z1TGVuseEpAEH6ZGFzFmyrys5lmMWnv5)

## 🚀 Tecnologias

-   [Expo](https://expo.dev/) -- Plataforma para desenvolvimento React Native
-   [React Native](https://reactnative.dev/) -- Framework para apps nativos
-   [Expo Router](https://docs.expo.dev/router/introduction/) -- Roteamento baseado em arquivos
-   [TypeScript](https://www.typescriptlang.org/) -- Tipagem estática
-   [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native) -- Ícones
-   [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) -- Armazenamento local
-   [React Native Toast Message](https://github.com/calintamas/react-native-toast-message) -- Notificações Toast

## ✨ Funcionalidades

-   **Autenticação**: Login e Cadastro de usuários (Alunos e Professores).
-   **Feed de Postagens**: Visualização de posts com paginação e atualização automática ("pull to refresh").
-   **Criação e Edição**: Professores podem criar, editar e excluir suas postagens.
-   **Perfil**: Visualização de dados do usuário e logout.
-   **Interface Adaptável**: Suporte a temas claro/escuro e responsividade para Web e Mobile.

## 📦 Instalação e uso

Clone o repositório:

```bash
git clone https://github.com/kainanguerra/mobile-postly.git
cd mobile-postly
```

Instale as dependências:

```bash
npm install
```

Rodar a aplicação:

```bash
# Iniciar o projeto (menu interativo para Android, iOS ou Web)
npm start

# Ou rodar especificamente para uma plataforma:
npm run android
npm run ios
npm run web
```

## ⚙️ Scripts disponíveis

-   `npm start` → inicia o servidor de desenvolvimento do Expo
-   `npm run android` → roda no emulador Android ou dispositivo conectado
-   `npm run ios` → roda no simulador iOS (macOS necessário)
-   `npm run web` → roda a versão web no navegador
-   `npm run lint` → roda o linter para verificar erros de código
-   `npm run reset-project` → reseta o cache do projeto (útil se houver problemas de build)

## 📂 Estrutura de pastas

```bash
mobile-postly/
├── app/             # Rotas e telas do aplicativo (Expo Router)
│   ├── (auth)/      # Rotas de autenticação (Login, Signup)
│   ├── (home)/      # Rotas principais (Feed, Profile)
│   ├── _layout.tsx  # Layout raiz e configurações de navegação
│   └── ...
├── assets/          # Imagens, fontes e ícones
├── components/      # Componentes reutilizáveis (UI)
│   └── ui/          # Componentes básicos (Button, Input)
├── constants/       # Constantes globais (Cores, Fontes)
├── lib/             # Funções utilitárias e serviços de API
├── hooks/           # Custom Hooks
├── package.json
└── README.md
```

## 🤝 Contribuição

1.  Faça um Fork deste repositório
2.  Crie sua feature branch: `git checkout -b minha-feature`
3.  Commit suas alterações: `git commit -m 'feat: Minha nova feature'`
4.  Push para a branch: `git push origin minha-feature`
5.  Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
Sinta-se livre para usar e modificar.