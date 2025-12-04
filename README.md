# SEIDOR – Backend Node.js Test

Projeto desenvolvido como solução para o desafio técnico da vaga de **Desenvolvedor Backend** na SEIDOR.

Este repositório apresenta uma API construída com **Node.js + TypeScript**, utilizando **Prisma ORM**, **Express**, **Zod** para validação e **Vitest** para testes unitários.  
A arquitetura foi pensada para ser simples, escalável e alinhada às boas práticas do mercado backend.

---

## Arquitetura do Projeto

O projeto segue um padrão de arquitetura **organizada por responsabilidade**, separando:

- Camada de **controllers**: recebe requisições HTTP  
- Camada de **services**: regras de negócio  
- Camada de **repositories**: comunicação com o banco (Prisma)  
- **DTOs + Zod**: validação e contratos  
- **Entities**: representação do domínio  

---

## Como Rodar a aplicação?

```bash
npm install

npm run prisma:generate

npm run prisma:migrate

npm run dev
````

### Para testar a API

Você pode usar a collection que deixei pronto para importar no **Postman**!

```bash
car-control-api.postman_collection.json
```

### Comandos para teste com Vitest

```bash
npm test
```
