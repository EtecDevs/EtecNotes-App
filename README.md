# EtecNotes 📱

## Introdução

EtecNotes é um aplicativo desenvolvido por uma equipe de alunos da ETEC de Peruíbe como parte de seu Trabalho de Conclusão de Curso (TCC). O app tem como objetivo facilitar a comunicação e a organização acadêmica, reunindo em um só lugar ferramentas como agenda escolar, notas, eventos, calendário e até um jornal digital voltado à comunidade escolar.

O projeto busca aproximar alunos, professores e a instituição, tornando a rotina educacional mais prática, interativa e acessível através de uma interface moderna e intuitiva, desenvolvida com React Native.

## Estrutura do Projeto 📁

```
EtecNotes-App/
├── src/
│   ├── context/
│   │   ├── AuthContext.js        # Contexto de autenticação
│   │   └── ThemeContext.js       # Contexto de tema (claro/escuro)
│   │
│   └── screens/
│       ├── HomeScreen.js         # Tela inicial (Jornal/Patch Notes/Eventos)
│       ├── CalendarScreen.js     # Calendário de eventos
│       ├── ChatScreen.js         # Chat com IATEC (bot)
│       ├── LoginScreen.js        # Tela de login
│       ├── NotesScreen.js        # Notas rápidas
│       ├── ProfileScreen.js      # Perfil do usuário
│       ├── ScheduleScreen.js     # Grade horária
│       └── WellnessScreen.js     # Recursos de bem-estar
│
├── App.js                        # Componente principal e navegação
├── babel.config.js              # Configuração do Babel
├── package.json                 # Dependências e scripts
└── README.md                    # Documentação do projeto
```

### Principais Funcionalidades 🚀

- **Home**: Jornal escolar, patch notes e eventos
- **Calendário**: Gerenciamento de eventos e compromissos
- **Chat**: Assistente virtual IATEC para suporte
- **Notas**: Sistema de anotações rápidas
- **Grade Horária**: Visualização dos horários de aula
- **Perfil**: Informações do usuário e configurações
- **Bem-estar**: Recursos para relaxamento e foco

### Tecnologias Utilizadas 💻

- React Native
- Expo
- React Navigation
- AsyncStorage
- Context API
- Ionicons

---

Desenvolvido com 💜 por alunos da ETEC Peruíbe © 2025
