# mlh-fellowship

## Overview 
This is part of a whole startup credit system I have done. The codes showed below I think maybe representative and they are the function part of the system(since the whole system may seems too big, too bulky and redundant ), which is used for manager to manage the records: search data from the database and through different click events to act, search and check the record. 

  This repository contains three parts:
- **html**
   - `m-check.html:`
      - the check page, where mangers can check the record that been selected from m-search.html in the search procedure.
   - `m-footer.html:`
      - render the footer section of the pages.
   - `m-main.html:` 
      - the home page of manager, where they can choose to search the records.
   - `m-search.html:`
      - the search page, where managers can search all the loan records and choose which one to check.
   - `m-sidebarmenu.html:`
      - render the sidebar section of the pages. 
- **js**
   - `m-check.js:`
     - the connection between the front-end and the back-end.
     - dynamically render the table.
     - call the corresponding function depending on the button-click.
   - `m-main.js:`
     - init the page.
   - `m-search.js:`
     - get data from stored session info.
     - get the data from database and render them in table.
     - (the same like **m-check.js** function)
- **java**
   - `ManagerServlet.java:`
     - call different function to response to different request through the parameter *"method"*.
     - since the project is MVC pattern that in each function it invoke the logic layer and create object to implement the business.
     - it contains the data type handling which is transfered between front-end and back-end.
     

> Thank you so much!
      


