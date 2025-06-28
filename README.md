<a id="readme-top"></a>

[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/NullUser3/tarea-todo">
    <img src="frontend/src/images/to-do-listpink.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Tarea</h3>

  <p align="center">
    A to-do-list app for managing and organizing tasks
    <br />
    <a href="https://github.com/NullUser3/tarea-todo"><strong>Explore the docs »</strong></a>
    <br />
    <br />
<!--     <a href="">View Demo</a> -->
    &middot;
    <a href="https://github.com/NullUser3/tarea-todo/issues/new?template=bug_report.md">Report Bug</a>
    &middot;
    <a href="https://github.com/NullUser3/tarea-todo/issues/new?template=feature_request.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Tarea is a personalized to-do list web app built with React, Spring Boot, Tailwind CSS, and MySQL, using JWT authentication for secure sign-up and login.

Key Features:

🔐 User Authentication – Secure sign-up and login using JSON Web Tokens (JWT)

🗂 Custom Lists – Create and manage your own categorized task lists

📅 Smart Views – View tasks due Today, in the Next 7 Days, or by specific lists

🌙 Dark Mode – Toggle between light and dark themes for a comfortable experience

This project demonstrates my full-stack development skills, from backend authentication to UI design.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

[![React.js][React.js]][React-url]
[![Spring Boot][Spring Boot]][Spring-url]
[![Tailwind CSS][Tailwind CSS]][Tailwind-url]
[![MySQL][MySQL]][MySQL-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This guide will help you run the project locally for development and testing purposes.

### Prerequisites

Node.js (v14 or higher)

npm or yarn

Java JDK (17 or higher)

Maven (comes with Spring Boot starter project)

MySQL (running locally)

Git

### Installation

To run this project locally, follow the steps below:

1. Clone the Repository
   
   ```sh
   git clone https://github.com/NullUser3/tarea-todo
   cd tarea-todo
   ``` 
   <br />
3. Set Up the Database
Open MySQL and create a new database (e.g., tarea_db).

- Import the provided SQL schema located at:
https://github.com/NullUser3/tarea-todo/blob/master/database_schema.sql

4. Backend Setup (Spring Boot)
   
   ```sh
   cd backend
   # Make sure to configure your MySQL credentials in src/main/resources/application.properties
   ./mvnw spring-boot:run
   ```
   
6. Frontend Setup (React – Create React App)
   
   ```sh
   cd frontend
   npm install
   npm start
   ```
   
8. Access the App
Once both servers are running:

- Frontend: http://localhost:3000

- Backend (default): http://localhost:8080

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

🔐 Sign Up or Log In

Access your personalized to-do list by creating an account or logging in securely using JWT authentication.

![Login Page](https://github.com/NullUser3/tarea-todo/blob/master/screenshots/screencapture-localhost-3000-login-2025-06-28-03_12_24.png)

🗂️ Create Custom Lists

Easily organize tasks by creating your own lists (e.g., Work, Personal, Shopping).

![Add List](https://github.com/NullUser3/tarea-todo/blob/master/screenshots/screencapture-localhost-3000-lists-deefa728-72d8-43b1-8753-2725076547a0-2025-06-28-04_00_58.png)

🕒 Add Tasks with Detailed Options

When adding a task, you can set:

Recurrence (e.g., daily, weekly)

Due Date & Time

Reminders

![Task Options](https://github.com/NullUser3/tarea-todo/blob/master/screenshots/screencapture-localhost-3000-lists-deefa728-72d8-43b1-8753-2725076547a0-2025-06-28-04_01_24.png)

📆 View Tasks by Timeframe

Quickly view:

Tasks for Today

Tasks for the Next 7 Days

Tasks under a specific List
<br>

🌙 Toggle Dark Mode

Switch between light and dark themes for a more comfortable UI.

![Dark Mode](https://github.com/NullUser3/tarea-todo/blob/master/screenshots/screencapture-localhost-3000-lists-deefa728-72d8-43b1-8753-2725076547a0-2025-06-28-04_01_40.png)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See the [`LICENSE.txt`](https://github.com/NullUser3/tarea-todo/blob/master/LICENSE) file for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Ahmed Mohamed - ahmed.dev37@gmail.com

Project Link: [https://github.com/NullUser3/tarea-todo](https://github.com/NullUser3/tarea-todo)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Img Shields](https://shields.io)
* [Font Awesome](https://fontawesome.com)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[stars-shield]: https://img.shields.io/github/stars/NullUser3/tarea-todo?style=for-the-badge
[stars-url]: https://github.com/NullUser3/tarea-todo/stargazers
[issues-shield]: https://img.shields.io/github/issues/NullUser3/tarea-todo?style=for-the-badge
[issues-url]: https://github.com/NullUser3/tarea-todo/issues
[license-shield]: https://img.shields.io/github/license/NullUser3/tarea-todo?style=for-the-badge
[license-url]: https://github.com/NullUser3/tarea-todo/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/ahmed-moham3d/
[product-screenshot]: https://github.com/NullUser3/tarea-todo/blob/master/screenshots/screencapture-localhost-3000-lists-deefa728-72d8-43b1-8753-2725076547a0-2025-06-28-03_59_53.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[Spring Boot]: https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white
[Spring-url]: https://spring.io/projects/spring-boot

[Tailwind CSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/

[MySQL]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/
