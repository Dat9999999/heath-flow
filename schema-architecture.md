Heathflow architect: 

<img width="703" height="451" alt="Screenshot 2025-11-21 at 10 20 06" src="https://github.com/user-attachments/assets/e3a27916-e058-4493-8f41-c3322f344186" />


Explain: 
This application have 3-tier: 
<ul>
  <li>
     Presentation Tier – The user interface, consisting of Thymeleaf templates and REST API consumers
  </li>
   <li>
    Application Tier – The Spring Boot backend that contains the controllers, services, and business logic
  </li>
   <li>
     Data Tier – The databases: MySQL for structured data and MongoDB for flexible, document-based data
  </li>
</ul>


Flow of data controll: 
1 User interacts with Interface layer (dashboard/ API consumer)
2 All request will be handled by controller
3 Bussiness logic will be applied at service layer 
4 Repositories abstract the database access logic and expose a simple, declarative interface for fetching and persisting data.
5 Each repository interfaces directly with the underlying database engine
6 Once data is retrieved from the database, it is mapped into Java model classes that the application can work with. This process is known as model binding.
7 Finally, the bound models are used in the response layer
