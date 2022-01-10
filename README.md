<!---
# TITLE
## SUB TITLE
> highlighted title
_italics_
**bold**
`highlighted code or varible names`
[links](www.google.com)
- bullet points
--->
<div id="top"></div>

# My First Server Project

Hosted: "https://myncgames.herokuapp.com"

API: "https://myncgames.herokuapp.com/api"

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
      <li>
      <a href="#setup">Setup</a>
    </li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About the Project

This project is a backend api that will give your several endpoints in which a user can access and interact with a data based filled with multiple game reviews of different categories submitted by various users, and these reviews can be commented and voted upon.

### Built With

- [React.js](https://reactjs.org/)
- [Node.js v14.18.1](https://nodejs.org/)
- [Postgres v2.5.2](https://www.postgresql.org/)

## Getting Started

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/dro00/my_nc_games.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. create .env.development file in root folder
   ```js
   PGDATABASE={database here}
   ```
4. create .env.test file in root folder
   ```js
   PGDATABASE={test database here}
   ```
   <p align="right">(<a href="#top">back to top</a>)</p>

### Setup

- to set up the database for the first time run the command line below.

```sh
npm setup-dbs
```

- to seed the database run the code below

```sh
npm seed
```

- to test run the code below

```sh
npm test
```

- to ...

```sh
npm start
```

- to ...

```sh
npm seed:prod
```

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Andrew Clayton - andrew.clayton@live.co.uk

Project Link: [https://github.com/dro00/my_nc_games.git](https://github.com/dro00/my_nc_games.git)

<p align="right">(<a href="#top">back to top</a>)</p>
