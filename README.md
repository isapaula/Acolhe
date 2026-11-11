<br>

<p align="center">
  <img width="64" height="64" alt="Acolhe" src="https://github.com/user-attachments/assets/b57d0693-5a56-4531-a807-90565f8a2bb0" />
</p>

<h2 align="center">Acolhe — Sistema para Clínica-Escola de Psicologia</h2>

<p align="center">Versão 1.0</p>

<p align="center">
  Sistema de gerenciamento de atendimentos para clínicas-escola de psicologia, com controle de acesso por perfil, fluxo de triagem, atribuição de casos e agendamento de sessões.
</p>

---

# Sobre o projeto

O **Acolhe** é um sistema desenvolvido para apoiar o gerenciamento de atendimentos realizados por uma clínica-escola de psicologia.

A proposta é organizar o fluxo entre pacientes, alunos e professores da instituição, permitindo que uma solicitação de atendimento passe por diferentes etapas até chegar ao acompanhamento do paciente.

O sistema foi desenvolvido com foco em:

- organização do fluxo de atendimento;
- controle de acesso por perfil;
- proteção das operações de acordo com as permissões do usuário;
- persistência e integridade dos dados;
- agendamento de sessões;
- testes automatizados do fluxo principal.

---

# Problema

Clínicas-escola precisam administrar diferentes tipos de usuários e garantir que cada etapa do atendimento seja realizada pelo perfil responsável.

Sem um fluxo estruturado, podem surgir problemas como:

- solicitações sem acompanhamento;
- acesso indevido a informações;
- dificuldade para controlar quais alunos estão responsáveis por cada paciente;
- conflitos de horários;
- falta de rastreabilidade do atendimento;
- dificuldade para validar se o sistema continua funcionando após alterações.

O Acolhe foi desenvolvido para centralizar esse processo em uma única aplicação.

---

# Solução

O sistema organiza o atendimento em um fluxo dividido entre os diferentes perfis.

### Paciente

O paciente pode:

- realizar seu cadastro;
- acessar o sistema;
- solicitar atendimento;
- informar especialidade, horário desejado e observações;
- acompanhar suas solicitações;
- visualizar suas sessões;
- consultar seu histórico de atendimentos.

### Professor

O professor é responsável pela etapa de triagem.

Pode:

- visualizar solicitações aguardando triagem;
- analisar uma solicitação;
- aprovar ou recusar o atendimento;
- acompanhar os casos encaminhados para os alunos.

### Aluno

O aluno pode:

- visualizar casos disponíveis após aprovação do professor;
- assumir uma solicitação;
- visualizar seus casos;
- agendar sessões com seus pacientes;
- acompanhar suas próximas sessões;
- registrar o andamento dos atendimentos.

---

# Fluxo principal

```text
Paciente
   │
   ▼
Solicitação de atendimento
   │
   ▼
Professor realiza a triagem
   │
   ├── Recusada ──► Solicitação encerrada
   │
   └── Aprovada
          │
          ▼
     Caso disponível
          │
          ▼
     Aluno assume o caso
          │
          ▼
     Aluno agenda sessão
          │
          ▼
     Atendimento
          │
          ▼
     Histórico / acompanhamento
```

Esse fluxo foi utilizado como referência durante o desenvolvimento e também como base para os testes automatizados.

---

# Arquitetura

O backend utiliza uma arquitetura MVC simplificada, organizada em:

```text
public/
   └── index.php

App/
├── Controller/
├── Database/
├── Enums/
├── Models/
├── Router/
└── Service/
```

### Principais responsabilidades

**Controller**

Responsável por receber as requisições, coordenar o fluxo da aplicação e retornar as respostas.

**Service**

Concentra operações relacionadas à persistência e aos casos de uso específicos, reduzindo a responsabilidade direta dos Controllers.

**Model**

Representa as principais entidades utilizadas pelo domínio da aplicação.

**Enum**

Centraliza valores relacionados a papéis, status e outras classificações utilizadas pelo sistema.

**Router**

Centraliza o direcionamento das requisições para os Controllers correspondentes.

**BaseController**

Centraliza a verificação de autenticação e autorização dos Controllers que precisam de proteção por perfil.

---

# Controle de acesso

O sistema utiliza controle de acesso baseado no papel do usuário.

Os principais perfis são:

| Perfil | Responsabilidade |
|---|---|
| Paciente | Solicitar e acompanhar atendimentos |
| Aluno | Assumir casos e realizar o acompanhamento |
| Professor | Realizar a triagem e encaminhar casos |

As rotas protegidas verificam a autenticação do usuário e, quando necessário, seu papel antes de permitir a execução da operação.

---

# Tecnologias

### Backend

- PHP 8.2+
- PDO
- Composer
- MySQL 8
- Arquitetura MVC

### Frontend

- React
- JavaScript / TypeScript
- HTML5
- CSS3

### Ambiente

- Docker
- Docker Compose
- Linux
- Git / GitHub

### Testes e qualidade

- Playwright
- Testes E2E
- GitHub Actions
- CI

---

# Banco de dados

O sistema utiliza MySQL para persistência dos dados.

Entre as principais entidades estão:

- `usuario`
- `usuario_papel`
- `paciente`
- `aluno`
- `professor`
- `solicitacoes_atendimento`
- `sessao`
- `acompanhamentos`

O relacionamento entre essas entidades permite representar o fluxo de usuários, solicitações, responsáveis e sessões de atendimento.

---

# Testes automatizados

O projeto possui uma suíte de testes E2E desenvolvida com **Playwright**.

Os testes validam principalmente fluxos críticos da aplicação, incluindo:

- cadastro de usuários;
- autenticação;
- aprovação de solicitações;
- recusa de solicitações;
- atribuição de casos aos alunos;
- agendamento de sessões;
- consulta de próximas sessões;
- integração entre frontend e backend.

A suíte é executada localmente e também integrada ao **GitHub Actions**, permitindo verificar automaticamente se as alterações mantêm o fluxo principal funcionando.

**Os testes E2E estão mantidos em um repositório separado.**

---

# Integração contínua

O projeto possui workflows de CI para validar a aplicação e sua suíte de testes automatizados.

O pipeline é responsável por preparar o ambiente, executar as dependências necessárias e validar os testes antes de considerar a alteração aprovada.

Essa estrutura foi utilizada não apenas como ferramenta de execução dos testes, mas também como parte da estratégia de qualidade do projeto.

---

# Processo de desenvolvimento

O desenvolvimento começou pela definição dos principais usuários e do fluxo da clínica.

Inicialmente foram estruturadas as entidades do domínio e o banco de dados. Em seguida, foi criado o roteamento centralizado e os Controllers necessários para implementar o fluxo principal.

Durante o desenvolvimento, algumas decisões iniciais precisaram ser revistas. Para reduzir esse retrabalho, o fluxo da clínica foi representado por um fluxograma e foi criado um checklist para definir o que deveria fazer parte da versão 1.0.

A partir disso, o desenvolvimento passou a seguir o fluxo de negócio:

```text
Modelagem
   ↓
Banco de dados
   ↓
Autenticação
   ↓
Solicitação de atendimento
   ↓
Triagem
   ↓
Atribuição do caso
   ↓
Agendamento
   ↓
Histórico / acompanhamento
   ↓
Automação dos fluxos críticos
   ↓
CI
```

---

# O que aprendi

Durante o desenvolvimento do Acolhe, alguns dos principais aprendizados foram:

- utilização do Composer para gerenciamento de dependências PHP;
- utilização de PDO e prepared statements para acesso ao banco;
- organização de uma aplicação utilizando MVC;
- criação de um Front Controller e roteamento centralizado;
- implementação de autenticação e autorização baseada em perfil;
- utilização de sessões para controle de autenticação;
- separação de responsabilidades entre Controllers, Services e Models;
- utilização de Docker para padronização do ambiente;
- criação de testes E2E com Playwright;
- integração dos testes com GitHub Actions;
- importância de compreender o fluxo de negócio antes de implementar as funcionalidades;
- utilização de fluxogramas, checklist e issues para reduzir retrabalho;
- identificação e correção de problemas de integração entre frontend, backend, banco de dados e testes automatizados.

---

# Status do projeto

**Versão 1.0 — Concluída**

O fluxo principal da aplicação foi implementado, testado e integrado ao pipeline de CI.

A versão atual contempla:

- autenticação;
- controle de acesso por perfil;
- cadastro de usuários;
- solicitações de atendimento;
- triagem pelo professor;
- atribuição de casos aos alunos;
- agendamento de sessões;
- consulta de sessões;
- histórico de atendimentos;
- testes E2E;
- integração contínua.

O projeto é considerado concluído em sua versão atual.

---

# Possíveis evoluções

Embora a versão 1.0 esteja concluída, algumas evoluções poderiam ser realizadas futuramente, caso o projeto volte a ser desenvolvido:

- ampliação da cobertura dos testes automatizados;
- criação de testes de API;
- melhoria da observabilidade da aplicação;
- evolução da arquitetura para separar ainda mais regras de negócio e infraestrutura;
- melhorias de UX e acessibilidade;
- implementação de novas funcionalidades administrativas;
- criação de métricas e dashboards para acompanhamento dos atendimentos.

Essas possibilidades não fazem parte do escopo atual da versão 1.0.

---

# Automação de testes

Os testes E2E do projeto estão disponíveis em um repositório separado:

**Automação de testes:**  
https://github.com/isapaula/automacaoTestesAcolhe

---

# Considerações finais

O Acolhe foi desenvolvido como um projeto de estudo e portfólio com o objetivo de praticar não apenas desenvolvimento de software, mas também **qualidade, automação de testes, integração contínua e organização de um fluxo de negócio realista**.

A aplicação representa um ciclo completo: desde o cadastro e solicitação de atendimento até a triagem, atribuição do caso, agendamento e acompanhamento das sessões.

A versão 1.0 encerra esse ciclo e serve como base para demonstrar as práticas utilizadas durante o desenvolvimento.
