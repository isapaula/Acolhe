<p align="center">Preview</p>


https://github.com/user-attachments/assets/d12a9712-5978-43df-99ac-364861c0f87a



<br>
<p align="center"><img width="64" height="64" alt="icons864" src="https://github.com/user-attachments/assets/b57d0693-5a56-4531-a807-90565f8a2bb0" /></p>
<h2 align="center">Acolhe - Sistema para universidades com curso de psicologia</h2>
<p align="center">Versão atual: 1.0</p>
<br>

# Por quê?
O objetivo desse sistema é proporcionar à comunidade a oportunidade de se consultar gratuitamente com estudantes do curso de psicologia.  A comunidade realiza o cadastro e solicita um atendimento informando o horário desejado, queixa (ansiedade, depressão, autoconhecimento etc.) e observação. Após, um professor da universidade analisará a solicitação e, se aprovada, os alunos mais adequados poderão assumir o caso e marcar a consulta com esse paciente. Dessa forma, pessoas de baixa renda poderão se consultar gratuitamente e ter um acompanhamento.
<br>

# O que é? 
Sistema de gerenciamento de atendimentos com controle de acesso por perfil (Aluno, Professor, Paciente).
<br>

# Problema
Instituições que realizam atendimentos educacionais ou clínicos precisam organizar solicitações, controle de sessões e permissões por perfil de usuário.
<br>

# Solução
O sistema permite:
- Autenticação com controle de acesso por papel
- Cadastro de usuários
- Criação de solicitações de atendimento
- Marcação de sessões como realizadas ou canceladas
- Proteção de rotas baseada em perfil
<br>

# Arquitetura

Arquitetura MVC simplificada

A V1 foi construída com foco em:

- Separação por Controllers
- Controle de acesso centralizado (BaseController)
- Front Controller para roteamento
- Fluxo funcional completo
- Estrutura preparada para evolução para camada de Service e Repository na V2

# Tecnologias

* PHP
* Composer
* MySQL
* HTML 5
* CSS 3
* Materialize CSS
* JavaScript

# O processo

Primeiramente, estabeleci quem seriam os usuários do sistema e passei a criar as classes models (Paciente, Professor, Aluno e Usuario). Então, segui para o Front controller, criando os arquivos: autoload, index, home e classe Router, para ter todas as rotas centralizadas.

Após, priorizei o fluxo básico da regra de negócio, criando as classes Controllers e telas (Views) conforme a necessidade do fluxo. Por conta disso, a classe Controller do Paciente, assim como suas Views, foi criada. Depois foi criada a classe e tela da Solicitação de Atendimento. Foi durante esse processo que surgiu a necessidade de utilizar session para controlar e restringir o acesso do usuário. Então, criar as classes e telas do Aluno e Professor, pois, após feita a solicitação de atendimento, precisaria de um professor para aprovar e do aluno para marcar a primeira sessão de terapia.  

Durante o processo de desenvolvimento, foi necessário corrigir vários arquivos já criados devido à falta de clareza. Para contornar isso, foi criado um fluxograma com todo o processo da clínica, fechando todas as pontas, também foi estabelecido um checklist com o que a versão 1.0 deveria contemplar. Além disso, também foram estabelecidas todas as colunas fundamentais nas tabelas do banco de dados. 

# O que aprendi

- Utilização de Bibliotecas do PHP com Composer para organizar dependências, mesmo em um projeto de pequeno porte.
- Importância de utilizar checklist e priorização antes da implementação para reduzir retrabalho.
- Uso de fluxogramas e issues para planejamento e acompanhamento das etapas do desenvolvimento.
- Configuração do `.htaccess` para centralizar o roteamento via Front Controller.
- Necessidade de compreender claramente as regras de negócio e o fluxo do sistema antes de iniciar a implementação.


## Melhorias identificadas para a V2

- Refatoração para camada de Service
- Implementação de Repository Pattern
- Ampliação da cobertura de testes automatizados
- Melhor separação entre regras de negócio e camada de apresentação

# 🔄 Roadmap (Próximos Passos)

Versão 2:
- Implementação de camada Service
- Padrão Repository
- Testes automatizados
- Refatoração para melhoria de coesão.

# :test_tube: Automação de testes

<p><strong> Os testes e2e desse projeto estão em outro repositório, por enquanto, e podem ser acessados por meio do link: https://github.com/isapaula/automacaoTestesClinica </strong></p>












