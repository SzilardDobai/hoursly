# hoursly
## recording hours website

### basic website functions:
  #### users:\
    - admin
    - basic user
  
  
  #### admin:
    - can add/remove/modify users
    - can add/remove/modify projects
    - can add/remove users to projects
    - can see untracked hours for all users
    - can see tracked hours for all users
    
  #### basic user:
    - can see his own info (basic data, active projects)
    - can see untracked hours
    - can see tracked hours
    
  #### creating new users: 
    - the admin can add a user by suplying basic user data (first name, last name, email etc), the user receives an email with login data (automatically generated password, which must be changed after first login).

  #### tracking hours: 
    - each user must log in his/her hours for each active project each week of the year.    
    - at the beginning of the week, a new batch of untracked hours records is generated for every user of every active project    
    - user receives a reminder each friday to log hours
    
    
    
### technologies:
  - front-end: ReactJS
  - back-end: NodeJS with Express  
  - database: MySQL
