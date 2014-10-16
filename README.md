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

### Configuração básica

Rode o servidor e acesse: [http://localhost:8000/admin](http://localhost:8000/admin)

### Configurando o *Na rede*

A definir.

### Configurando as notícias

A definir.

## Deploy

Em breve.

## API

### Configurações da plataforma

[http://localhost:8000/api/v1/settings](http://localhost:8000/api/v1/settings)