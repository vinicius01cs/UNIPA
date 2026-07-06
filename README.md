# Unipa 🎓 - Sistema de Automatização da CPA (Comissão Própria de Avaliação)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Framework: Express](https://img.shields.io/badge/Framework-Express_v4-blue.svg)](https://expressjs.com/)
[![ORM: Sequelize](https://img.shields.io/badge/ORM-Sequelize_v6-lightblue.svg)](https://sequelize.org/)
[![Database: MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)](https://www.mysql.com/)
[![AI: OpenAI](https://img.shields.io/badge/AI-OpenAI_GPT--3.5-purple.svg)](https://openai.com/)
[![Realtime: Socket.io](https://img.shields.io/badge/Realtime-Socket.io-black.svg)](https://socket.io/)

O **Unipa** é uma plataforma web robusta e moderna desenvolvida para automatizar e otimizar o ciclo de avaliação institucional da **CPA (Comissão Própria de Avaliação)** em instituições de ensino superior. 

O sistema simplifica a distribuição de questionários avaliativos para estudantes, consolida as notas de disciplinas e cursos, envia notificações automáticas e utiliza inteligência artificial (OpenAI GPT) para gerar insights pedagógicos profundos e planos de ação. Além disso, fornece canais de comunicação em tempo real para que professores e coordenadores colaborem diretamente sobre as melhorias necessárias.

---

## 📌 Funcionalidades Principais

### 👥 Controle de Acesso e Multi-perfis (RBAC)
O sistema conta com 4 níveis de permissão controlados por sessões seguras e tokens JWT armazenados em cookies:
1. **Administrador (Nível 1)**: Gerencia usuários, cursos, disciplinas, questionários globais e realiza importações de planilhas de alunos e turmas.
2. **Professor (Nível 2)**: Visualiza os relatórios de avaliação de suas respectivas disciplinas, acessa sugestões pedagógicas e se comunica com os coordenadores.
3. **Coordenador (Nível 3)**: Gerencia o curso de sua responsabilidade, visualiza relatórios consolidados de disciplinas e cursos, consulta a IA para sugestões e interage via chat com professores.
4. **Aluno (Nível 4)**: Responde aos questionários ativos sobre as disciplinas em que está matriculado e sobre o curso em geral, de forma simples e intuitiva.

### 📊 Importação Inteligente de Dados (CSV / Excel)
* Importação automatizada de dados institucionais a partir de planilhas de matrículas e grades curriculares via arquivos CSV/Excel (`exceljs` + `jszip`).
* Mapeamento automático de disciplinas, alunos e cursos.
* Envio automático de alertas de notificação por e-mail para gestores e envolvidos no processo de avaliação após a importação.

### 📝 Gestão Dinâmica de Questionários
* Criação de pesquisas personalizadas com perguntas de escala Likert (avaliação de 0 a 5).
* Controle de vigência (Ativar/Inativar questionários para preenchimento).
* Separação estrutural de questionários:
  * **Questionário de Disciplina**: Avalia o desempenho do professor e o conteúdo da matéria.
  * **Questionário de Curso**: Avalia a infraestrutura, coordenação e o curso como um todo.

### 🧠 Análise de Resultados com IA (OpenAI Integration)
* Integração nativa com a API da **OpenAI (GPT-3.5-Turbo)**.
* Consolidação automática das médias de todas as respostas recebidas.
* Geração instantânea de análises pedagógicas personalizadas: a IA lê as notas médias e as taxas de participação dos alunos e gera sugestões práticas sobre como engajar estudantes e melhorar a qualidade do ensino de acordo com as notas mais baixas identificadas.

### 💬 Chat em Tempo Real
* Canal de chat direto e em tempo real integrado via **Socket.io**.
* Permite que Coordenadores e Professores de um mesmo curso conversem de forma reservada para alinhar estratégias pedagógicas, discutir os relatórios da CPA e implementar melhorias.
* Acesso estritamente restrito e validado por middleware de autorização.

### ✉️ Notificação Automatizada
* Disparo automatizado de e-mails via **Nodemailer (SMTP)** para lembrar os alunos de responder aos questionários da CPA pendentes ou notificar os professores sobre novos relatórios disponíveis.

---

## 🛠️ Tecnologias Utilizadas

### Backend & Banco de Dados
* **Runtime**: [Node.js](https://nodejs.org/) (v18 ou superior)
* **Framework Web**: [Express.js](https://expressjs.com/)
* **Engine de Template**: [Express-Handlebars](https://github.com/express-handlebars/express-handlebars)
* **Banco de Dados**: [MySQL](https://www.mysql.com/)
* **ORM (Mapeador Objeto-Relacional)**: [Sequelize](https://sequelize.org/)
* **Autenticação**: [Passport.js](http://www.passportjs.org/) (Local Strategy) & [JSON Web Token (JWT)](https://jwt.io/)

### Frontend & Estilização
* **UI Framework**: [Bootstrap 5.3](https://getbootstrap.com/)
* **Iconografia**: [FontAwesome 5](https://fontawesome.com/)
* **Scripting**: HTML5, CSS3 Customizado, JavaScript Vanilla e jQuery (para interações e Socket.io client).

### Integrações & Utilitários
* **Inteligência Artificial**: [OpenAI Node SDK](https://github.com/openai/openai-node)
* **Comunicação Real-time**: [Socket.io](https://socket.io/)
* **Processamento de Planilhas**: `exceljs` e `jszip`
* **Upload de Arquivos**: `multer`
* **Envio de E-mail**: `nodemailer`
* **Criptografia**: `bcrypt` (para senhas seguras usando salt pbkdf2)

---

## 📂 Estrutura de Pastas do Projeto

```text
Unipa/
├── config/                 # Configurações de autenticação (Passport.js)
├── controllers/            # Controladores da lógica de negócios da aplicação
├── db/                     # Conectividade e inicialização do banco de dados (Sequelize)
├── models/                 # Modelos de dados e tabelas do banco (MySQL)
├── public/                 # Arquivos estáticos (imagens, arquivos CSS customizados, JS do cliente)
│   ├── css/
│   └── js/
├── routes/                 # Definições de rotas HTTP separadas por módulos
│   ├── api/                # Endpoints de API (como envio de e-mails)
│   └── middleware/         # Middlewares de autenticação e controle de níveis de acesso
├── views/                  # Telas da aplicação renderizadas no servidor (Handlebars)
│   ├── aluno/
│   ├── auth/
│   ├── chat/
│   ├── curso/
│   ├── disciplina/
│   ├── home/
│   ├── layouts/            # Layout principal (main.handlebars) com navbar dinâmica
│   ├── planilha/
│   ├── questionario/
│   ├── relatorio/
│   └── usuario/
├── index.js                # Arquivo de entrada principal do servidor Express e Socket.io
├── modelo.env              # Modelo com variáveis de ambiente necessárias para o projeto
├── package.json            # Manifesto e dependências do Node.js
└── README.md               # Documentação do projeto (este arquivo)
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (v18.x ou superior recomendado)
* [MySQL](https://dev.mysql.com/downloads/installer/) rodando localmente ou em servidor remoto.

---

### 2. Clonar o Repositório e Instalar as Dependências
Abra o seu terminal e execute os seguintes comandos:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/unipa.git

# Acesse a pasta do projeto
cd unipa

# Instale as dependências necessárias
npm install
```

---

### 3. Configurar as Variáveis de Ambiente
Na raiz do projeto, crie um arquivo chamado `.env` baseando-se no arquivo `modelo.env` fornecido:

```bash
cp modelo.env .env
```

Abra o arquivo `.env` e preencha as credenciais necessárias:

```ini
# CREDENCIAIS DE ACESSO AO BANCO DE DADOS
DATABASE_HOST = localhost
DATABASE = unipa_db
DATABASE_USER = seu_usuario_mysql
DATABASE_PASSWORD = sua_senha_mysql

# CREDENCIAIS ENVIO DE EMAIL (SMTP)
EMAIL_ADDRESS = seu_email@exemplo.com
EMAIL_PASSWORD = sua_senha_app_email
HOST_SMTP = smtp.exemplo.com
PORT_SMTP = 587

# ROTA API E VARIÁVEIS DO SISTEMA
API_BASE_URL = http://localhost:3000/
JWT_SECRET = sua_chave_secreta_jwt_super_segura
NODE_ENV = development

# OPENAI API KEY (Para as análises com IA de CPA)
OPENAI_API_KEY = sk-proj-...
```

> **Nota**: Crie previamente o banco de dados especificado na variável `DATABASE` (ex: `unipa_db`) no seu servidor MySQL. O Sequelize se encarregará de criar as tabelas automaticamente ao iniciar a aplicação pela primeira vez.

---

### 4. Inicialização e Primeiro Acesso

Inicie o servidor de desenvolvimento utilizando o comando:

```bash
npm start
```

Isso iniciará o servidor usando o `nodemon`, escutando na porta **3000** (`http://localhost:3000`).

#### 🔑 Credenciais do Primeiro Acesso (Admin Padrão)
Ao iniciar pela primeira vez, o sistema detecta a ausência de usuários no banco de dados e cria automaticamente uma conta de **Administrador Geral** para possibilitar o login inicial e configuração da plataforma. Utilize as seguintes credenciais:

* **E-mail**: `admin@unipa.com`
* **Senha**: `123`

---

## 📈 Fluxo de Avaliação da CPA no Sistema

1. **Upload da Grade**: O **Administrador** faz o upload de uma planilha CSV relacionando alunos, cursos e disciplinas.
2. **Disponibilização de Pesquisa**: O **Administrador** cria um questionário de avaliação e o ativa como disponível para preenchimento.
3. **Notificação**: E-mails de notificação automática são disparados aos alunos comunicando que a avaliação está aberta.
4. **Respostas**: Os **Alunos** entram na plataforma e respondem de forma objetiva aos questionários atribuídos a eles.
5. **Fechamento**: Uma vez encerrado o prazo, o questionário é desativado.
6. **Relatório**: Os **Coordenadores** e **Professores** têm acesso aos relatórios consolidados com as médias de cada pergunta.
7. **Análise com IA**: O **Coordenador** clica no botão para enviar os dados consolidados do relatório de CPA à Inteligência Artificial (OpenAI), obtendo um feedback detalhado com ações sugeridas baseadas nos dados reais.
8. **Alinhamento e Ação**: Através do **Chat Integrado**, o **Coordenador** e o **Professor** conversam para estruturar as mudanças propostas pela IA e pelas notas.

---

## 📄 Licença

Este projeto está licenciado sob a Licença **MIT** - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

*Desenvolvido para modernizar e democratizar o processo de autoavaliação institucional.* 🎓✨
