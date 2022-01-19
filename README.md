# DATA732-Mass-Shooting

The goal of this project is to use __D3js__ to visualize some data about mass shootings in the USA.  
We wanted to highlight who were the victims of mass shootings, and provide some stats about the shooter in shooting where target were random people.  

We decided to show :
- A map of the USA divided by states, with their color corresponding to the number of vitcims in the state.
- A bar chart showing the categories of people killed during mass shootings.
- Three pie charts showing if, only for the random shootings, the killer had mental health issues, the cause of the shooting and the race of the shooter.

In the beggining, the bar chart and the pie charts show data about all of the USA, and are actuallized with data of specific states when clicking on them with the mouse on the map. 
To show the global data again, just click on the "Global Data" button.
At any moment, you can click on the pie charts to show the number corresponding to the chart slice.

## How to Use :

**If you just want to visualise it, it is currently hosted on an aws server, our visualisation is available here: http://forrayg.xyz/mass_shooting_us**



First, clone the repo in a folder using :
```sh
git clone https://github.com/AntoineCOCHARD/DATA732-Mass-Shooting
```
Then go in the folder and use :
```sh
npm install
```
Run the following commands to launch the server :
```sh
node app.js
```
Finally, go to localhost:3000/mass_shooting_us and enjoy.
