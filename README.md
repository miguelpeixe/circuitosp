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

## API

### GET **/api/v1/settings**

Retorna:

* *siteUrl*: url do site;
* *hashtag*: termo buscado nas redes sociais;
* *footerImgPath*: caminho para a imagem de rodapé;
* *mapasCulturais.endpoint*: url para api do Mapas Culturais;
* *mapasCulturais.projectId*: id dos projetos buscados no mapas culturais;
* *google.analyticsId*: id para Google Analytics;
* *facebook.pageId*: id da página de Facebook do Circuito SP;
* *twitter.username*: usuário do Circuito SP do Twitter
* *twitter.apiKey*: api key para buscas no Twitter;
* *flickr.apiKey*: api key para buscas no Flickr;
* *instagram.apiKey*: api key para buscas no Instagram;
* *wordpress.endpoint*: url da api da instância wordpress para notícias;


### GET /api/v1/data

Retorna todos os datos de eventos, espaços e ocorrências.

### GET /api/v1/events/:eventId

Retorna informações sobre um evento.

### GET /api/v1/social

Retorna todos mídias postadas no Instagram, Flickr e Youtube.
