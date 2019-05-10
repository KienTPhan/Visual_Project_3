#### Mini-Challenge 1: Crowdsourcing for Situational Awareness

### Tasks and Questions:

## 1: Emergency responders will base their initial response on the earthquake shake map. Use visual analytics to determine how their response should change based on damage reports from citizens on the ground. How would you prioritize neighborhoods for response? Which parts of the city are hardest hit? Limit your response to 1000 words and 10 images.
In this visualization, the user will see 6 line graphs, each representing a different section area in town that was affected by the earthquake. The first line graph will plot the building damage of peoples' report through out the time period. The second line graph represents the shake intensity that people felt during that time period. The same design was implemented for all categories in town which were Sewer and Water, Roads and Bridges, Power, and the Medical area. In Figure 1, it dispays a small portion of the visualization, this design is repeated for all categories. In order for emercency responders to prioritize neighborhoods, they will use the line graphs of each damage area with the assistance of the map graph. Each row represent a certain area of the town. With these two visualizations, the user will be able to identify easily which areas need assistance first. The darker shade red on the map directs users to the most damaged areas in each location while also showing the average trend of people sending in information of damaged reports on the line graph. A user can hover over the map graph to look at the details of the location. It will display the location name, ID, and the damage value it recieved from people's reporting. If no data was in that certain area it will display "no data".

As you look over the maps, the user will notice that Location 3 is always a darker color which means that it is constantly in a damage state. You can see this through Firgures 2-7. The location on the north side of the town is location 3. This means that the responder will likely go to this location for aiding the citizens there. The line graph will assist the user about reports of damages for specific locations. If location 3 is selected, the user will notice that the trend in the line graph section "Shake Intensity" shows that it does not its score was much higher than the rest of the locations in town. 

Figure 1.
![Screen Shot 2019-05-10 at 3 06 12 PM](https://user-images.githubusercontent.com/32583946/57553896-81d21300-7335-11e9-8e03-1e7fd5b8cf77.png)

Figure 2
![Screen Shot 2019-05-10 at 3 06 30 PM](https://user-images.githubusercontent.com/32583946/57553884-7979d800-7335-11e9-9fa3-f6b04ea2996f.png)

Figure 3
![Screen Shot 2019-05-10 at 3 06 30 PM](https://user-images.githubusercontent.com/32583946/57553884-7979d800-7335-11e9-9fa3-f6b04ea2996f.png)

Figure 4
![Screen Shot 2019-05-10 at 3 06 39 PM](https://user-images.githubusercontent.com/32583946/57553881-75e65100-7335-11e9-81d1-8416c0e71c96.png)

Figure 5
![Screen Shot 2019-05-10 at 3 06 52 PM](https://user-images.githubusercontent.com/32583946/57553869-71ba3380-7335-11e9-8416-118bf5b0e58d.png)

Figure 6
![Screen Shot 2019-05-10 at 3 06 59 PM](https://user-images.githubusercontent.com/32583946/57553863-6e26ac80-7335-11e9-8212-35a99a327e73.png)

Figure 7
![Screen Shot 2019-05-10 at 3 07 10 PM](https://user-images.githubusercontent.com/32583946/57553849-68c96200-7335-11e9-9831-51488b466824.png)





## 2: Use visual analytics to show uncertainty in the data. Compare the reliability of neighborhood reports. Which neighborhoods are providing reliable reports? Provide a rationale for your response. Limit your response to 1000 words and 10 images.
Our visualization answers this question by providing a stack bar graph to show the damage score people report for locations. On the x asix, the user will see that all the locations are displayed in numerical order, making it easy to find a location. On the y axis, it displays the number of responses collected. The stack rectangles represent the damage score 0-10 (10 being the most damaged) in a color scale and the height of the those rectangles show the amount of people who chose that specific damage score. This compares the reliability of reports because the user will be able to see on the stack chart the various reports people submit. The majority damage score will most likely be the accuract damage score of the area. Unlike other smaller damage score reports since they will likely be the incorrect or the outlier in the data. In addition, users may hover over the the specific rectangles on the visualization for more details of that rectangle. Such details consist of the damage score and the number of responses for that damage score. Users may use the date slider to look more in depth a time period and the stack bar will represent each area in town on the stack bar graph.

For example, if the user selects time period 04/06 19:14 To 04/08 20:18 in section "Building", the user notices that location 8 has a big rectangle that is a damage score of 5. Since this appears to be the largest number of inputs, the user can conclude that this damage score is most likely accuracte for this time period on that specific location. The same can be said for location 9 as 6 being the damage score of that time period. 



![Screen Shot 2019-05-10 at 3 31 21 PM](https://user-images.githubusercontent.com/32583946/57555052-c4e1b580-7338-11e9-867f-4b6766c8736c.png)

In the image below it can show where data is uncertain. For example, on location one for time period 04/06 00:00 To 04/07 00:18 in "Building" section the user will see a very small number of people reported a damage score in that location. In addition, when the user hovers over each rectangle in stack bar location 1 the user will see that each damage score has minimal reports and there are many various answers. This concludes that this time period for location 1 is uncertain. 
![Screen Shot 2019-05-10 at 3 39 25 PM](https://user-images.githubusercontent.com/32583946/57555466-ef803e00-7339-11e9-906f-c3fa83643051.png)


## 3: How do conditions change over time? How does uncertainty in change over time? Describe the key changes you see. Limit your response to 500 words and 8 images.

The condition of the earth quake as reported by the user of the app will be shown via a line graphs. There will be 6 line graphs, one representing each reported damage areas. For example, the first line graph will show all the reported data for damage for buildings. For each of the line it will show the conditions of each neighborhood overtime. 

<img width="963" alt="Screen Shot 2019-05-10 at 3 06 22 PM" src="https://user-images.githubusercontent.com/35431945/57553839-60712700-7335-11e9-880e-ce4e1452e3f9.png">


To allow people to see uncertainty in change over time, our group created a stacked bar graph to show people exactly how many people reported for each location as well as how many people voted for each damage level. For example, if you use the slider and select the date range from 04/07 23:46 To 04/09 00:02 then you can see that there is a significantly more people reporting damages for location 8 or neighborhood 8.

<img width="1631" alt="Screen Shot 2019-05-10 at 3 10 42 PM" src="https://user-images.githubusercontent.com/35431945/57554238-86e39200-7336-11e9-8ab2-f8907eefbec7.png">


 We also allow people to hover over the stack to view how many people voted for each damage to allow them to see more details and see if the data is uncertain or not themselves. Looking at location 8 again, you can see that there is much more people reporting that buildings damage is about 5 to 6 out of 10 so that is probably the most accurate reports. 

<img width="1637" alt="Screen Shot 2019-05-10 at 3 11 20 PM" src="https://user-images.githubusercontent.com/35431945/57554277-a67aba80-7336-11e9-85af-6ac80fae7acb.png">

<img width="1618" alt="Screen Shot 2019-05-10 at 3 12 49 PM" src="https://user-images.githubusercontent.com/35431945/57554279-a7135100-7336-11e9-82cf-1213f1c1fd61.png">

By doing this, we observed that the uncertainty for the reports are very high when we look at buildings damage over the range of three days.


## Contributers:
All team members put their fair share of work into the project. Miranda worked on the stack bar graph and the front end work in the project while Kien worked on the map and the line graph. Both team members assisted each other when a challenge posed, and offered to help each other throughout the project. 
