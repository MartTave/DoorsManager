# Door Manager <!-- omit in toc -->

This project is called Door Manager is was done by :

- Bessard Guillaume
- Caporrizi Marco
- Pencherek Noah
- Tavernier Martin

## Table of content <!-- omit in toc -->
 
- [Folder configuration](#folder-configuration)
- [Installation](#installation)
  - [Install the database](#install-the-database)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Launching the server](#launching-the-server)

## Folder configuration

The folders are organized in this way :

- backend
    - server.ts : Backend web server
- DB
    - DBInteraction.ts : File responsible for interacting with the database (doing all the requests)
- doc : Folder containing all the documentation for the project
- frontend
    - aventus.conf.avt : Configuration for the Aventus framework
    - src : Folder containing all the source file
        - components : Folder containing all the web components
        - libs : Folder containing the front end libraries
        - state : Folder containing all the files for the states to work
        - static : Folder containing all the static files
    - dist : Folder containing all the compiled file
- prisma : Folder containing all the files for the prisma configuration
    - schema.prisma : File containing the database configuration

## Installation

To install the project, you need to do several steps

### Install the database

In order for the project to work, you first need to install a postgres database.

By default, it will look for a databse named **Doors** in local on the port: **5432** 

All this can be changed in the [schema.prisma](./prisma/schema.prisma) file

### Backend

This project works with **nodejs** for the backend. So you need to have this installed in order for the project to work.

Then you can install the dependencies with : `npm install i`

### Frontend

This project use a not so well known technologies for the frontend. So all the compiled file are included in the git for more ease-of-use

If you want to read/modify the source code of the web interface. We highly suggest you to install [Aventus](./aventus/aventus-1.1.1.vsix). We included the compiled version of the Aventus framework in this project to make installation more painless.

## Launching the server

To launch the server, you first need to run the database server. You can then run `npm run start` to start the webserver.

By default, the webserver will start on the port **3000**, but you can change this in the [server](./backend/server.ts) file
