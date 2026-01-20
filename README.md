📘 UNIPA — Automatização da Avaliação de CPA

Repositorio do projeto de TCC para automatização da avaliação de CPA da Univiçosa — um sistema web para gestão, aplicação e análise da avaliação de curso (CPA).

📌 Descrição

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) com o objetivo de criar uma plataforma web que automatiza o processo de aplicação e análise da avaliação de Cursos e Docentes (CPA) em uma instituição de ensino superior.
Ele permite que usuários coletem respostas, gerenciem questionários e obtenham relatórios automatizados, melhorando a eficiência e confiabilidade do processo de avaliação.

🧠 Tecnologias Utilizadas

O projeto é construído com as seguintes tecnologias:

Tecnologia	Finalidade
Node.js	Plataforma de execução backend
Express	Framework web para rotas e APIs
Handlebars	Templating engine para views
JavaScript	Lógica de frontend e backend
CSS	Estilização das páginas
SQL ou ORM	Gerenciamento de dados (via Sequelize ou similar)
Vercel Deploy	Deploy do front-end (link presente no repo)

(Ajuste esta tabela conforme as libs/tecnologias específicas se você quiser mais precisão.)

⚙️ Pré-requisitos

Antes de começar, verifique se tem instalado em sua máquina:

⭐ Node.js (versão >=14.x)

📦 npm ou yarn

💾 Banco de dados compatível (ex: PostgreSQL, MySQL — dependendo da configuração)

🔧 Editor de código (VS Code recomendado)

🚀 Como rodar localmente

Clone o repositório

git clone https://github.com/vinicius01cs/UNIPA.git
cd UNIPA


Instale dependências

npm install


Configure variáveis de ambiente

Crie um arquivo .env com base no modelo.env

Adicione variáveis como:

PORT=3000
DB_HOST=...
DB_USER=...
DB_PASS=...
DB_NAME=...


Inicie o servidor

npm start


Acesse no navegador

http://localhost:3000

📂 Estrutura de Pastas
├─ config/         # Configurações gerais
├─ controllers/    # Lógica de controle de rotas
├─ db/             # Conexão com banco de dados
├─ models/         # Modelos (ORM)
├─ public/         # Arquivos estáticos (CSS, JS, imagens)
├─ routes/         # Definição das rotas
├─ views/          # Templates Handlebars
├─ .gitignore
├─ index.js        # Ponto de entrada da aplicação
├─ package.json

📊 Funcionalidades

✔️ Login de usuários
✔️ Painel de administração
✔️ Gerenciamento de questionários
✔️ Visualização de resultados e relatórios
✔️ Layout responsivo com Handlebars

(Adicione aqui as funcionalidades específicas do seu projeto.)

🔗 Deploy

Uma versão está hospedada em:

🌐 https://unipa.vercel.app/

🤝 Contribuição

Se quiser contribuir com melhorias:

Fork este repositório

Crie uma branch: feature/nova-funcionalidade

Faça commit com mensagens claras

Envie um Pull Request

📝 Licença

Este projeto está sob a licença MIT — consulte o arquivo LICENSE no repositório para mais detalhes.

👤 Autor

Vinicius Campos
📍 Desenvolvedor e autor do projeto TCC — UNIPA
