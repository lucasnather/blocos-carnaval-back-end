# Back-End Blocos de carnaval

# Descrição

<p>O Back-end Blocos de carnaval foi criado em cima de um exercício da Rocketseat do boracodar dev, esta API visa o aprendizado da persistência de dados na Amazon S3, login com o google e reforçar o aprendizado em express.</p>

# Tecnologias 

<div style="display: flex; gap: 30px;">
    <img alt="NodeJs" src="./assets/node-js.png" style="width:50px;">
    <img alt="Express" src="./assets/express.png" style="width:50px;">
    <img alt="Typescript" src="./assets/typescript.png" style="width:50px;">
    <img alt="Postgresql" src="./assets/postgre.png" style="width:50px;">
    <img alt="Docker" src="./assets/docker.png" style="width:50px;">
</div>

## Para clonar o repositório siga o passo a passo


```bash

$ git clone https://github.com/lucasnather/blocos-carnaval-back-end.git

$ cd blocos-carnaval-back-end

$ npm install

```

## Antes de rodar a aplicação verifique o arquivo .env.example, crie o arquivo .env e coloque seus dados.

## Rodando a aplicação

```bash


# subindo o banco de dados postgres
# o "-d" é para o container subir em modo detach
$ docker-compose up -d

# ver se o container está em execução
$ docker ps

# rodar o banco de dados prisma
$ npx prisma migrate dev

# desenvolvimento
$ npm run dev

# modo watch
$ npm run dev:watch

```

# Api Endpoints

1. Criar Bloco de Carnaval

<ul>
    <li>Metódo: POST</li>
    <li>Content-type: multipart/form-data</li>
    <li>URL: http://localhost:8080/api/blocos</li>
    <li>Description: Cria um bloquinho de carnaval</li>
    <li>Response status: 201 CREATED</li>
    <li>Request Body:</li>

```bash

    {
        "title": "Bloco do Javinha",
        "description": "Venha ficar doido de tanto café",
        "city": "Manaus",
        "uf": "Am",
        "image": "qualquer-imagem.png",
    }

```
<ul>
    <li>Response Payload<li>
</ul>

```bash
    {
        "id": "um uuid será gerado aqui",
        "title": "Bloco do Javinha",
        "description": "Venha ficar doido de tanto café",
        "city": "Manaus",
        "uf": "Am",
        "createdAt": "2024-06-17T20:53:14.619Z",
        "updatedAt": null,
        "FotosBloco": [
            {
                "id": "um uuid será gerado aqui",
                "image": "aqui será gerado um hash aletório para gerar o nome da imagem ( por boas práticas)"
            }
        ]
    }
```

</ul>


2. Buscar todos os Blocos

<ul>
    <li>Metódo: GET</li>
    <li>URL: http://localhost:8080/api/blocos</li>
    <li>Description: lista todos os blocos cadastrados </li>
    <li>Response status: 200 OK</li>
    <li>Response Payload: </li>
</ul>

```bash

    [
        {
            "id": "um uuid será gerado aqui",
            "title": "Bloco do Javinha",
            "description": "Venha ficar doido de tanto café",
            "city": "Manaus",
            "uf": "Am",
            "createdAt": "2024-06-17T20:53:14.619Z",
            "updatedAt": null,
            "FotosBloco": [
                {
                    "image": "aqui será gerado um hash aletório para gerar o nome da imagem ( por boas práticas)",
                    "url": "aqui vem a url gerada na aplicação com link da foto da Amazon s3"
                }
            ]
        }
    ]

```
3. Deletar Bloco por Id
<ul>
    <li>Metódo: DELETE</li>
    <li>URL: http://localhost:8080/api/blocos/{uuid}</li>
    <li>Description: deletar bloco por id </li>
    <li>Response status: 203</li>
    <li>Request Param: </li>
    <li>Response Payload: </li>

```bash

    {
        "message": "Delete successfully"
    }

```
</ul>


### Entidades

[X] Blocos
    id
    title
    description
    city
    uf
    createdAt
    updatedAt

[X] Foto_bloco
    id
    blocos_id
    image

### Casos de Uso

[X] O Usuário deve pesquisar pelo título e pela cidade
[X] Listar todos os blocos limitados por 9
[X] O Usuário no futuro poderá publicar seus próprios blocos
[x] O Usuário pode se cadastrar na aplicação
[X] O Usuário pode se autenticar na aplicação


# Meus Objetivos com esta aplicação

<p>Desejo com esta aplicação melhorar meus conhecimentos com NodeJS + Express + Typescript</p>

<p>Conhercer novas formas de persistir dados, neste caso estou aprendendo e lendo as documentações para aprender uma boa maneira de usar a Amazon S3</p>

<p>Testar e implementar novas estratégias de autenticação com o gogole, para facilitar o login de usuários na aplicação</p>
