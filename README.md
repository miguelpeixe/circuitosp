# Circuito SP de Cultura

Visualização de eventos cadastrados no [Mapas Culturais](https://github.com/hacklabr/mapasculturais), desenvolvido para a plataforma [SP Cultura](http://spcultura.prefeitura.sp.gov.br/) da [Secretaria Municipal de Cultura de São Paulo](http://www.prefeitura.sp.gov.br/cidade/secretarias/cultura/).

Projeto desenvolvido para o Circuito SP de Cultura.

---

## Recursos

 - Visualização de eventos a partir de um projeto
 - Interface adaptada a partir de geolocalização
 - Filtros por data, linguagem, espaço e busca textual
 - [Sistema *Na rede*](#configurando-o-na-rede) indexa participação multimídia nas redes sociais
 - [Notícias conectadas](#configurando-as-not%C3%ADcias) a um blog WordPress, com busca e suporte a imagem destacada

---

## Pré-requisitos

 - npm 1.4.x
 - node 0.10.x
 - mongodb 2.6 ou superior

## Instalação

Clone a aplicação:

```
$ git clone https://github.com/miguelpeixe/circuitosp.git
```

Instale digitando:

```
$ npm install
```

Rode o servidor digitando:

```
$ npm start
```

Agora acesse: [http://localhost:8000](http://localhost:8000)

## Configuração

Rode o servidor e acesse: [http://localhost:8000/admin](http://localhost:8000/admin). Após cadastrar um e-mail e senha de administrador, será possível configurar as API keys do Instagram, Flickr e Twitter, a URL do Wordpress utilizado para publicação de notícias e outras configurações do site. 

## Deploy

Em breve.

## API

### GET **/api/v1/settings**

Retorna:

* hashtag
* siteUrl
* mapasculturais.endpoint
* mapasculturais.projectId
* wordpress.endpoint
* instagram.apiKey
* flickr.apiKey
* instagram.apiKey
* twitter.apiKey


### GET /api/v1/data

Retorna todos os datos de eventos, espaços e ocorrências.

### GET /api/v1/events/:eventId

Retorna informações sobre um evento.

### GET /api/v1/social

Retorna todos mídias postadas no Instagram, Flickr e Youtube.




