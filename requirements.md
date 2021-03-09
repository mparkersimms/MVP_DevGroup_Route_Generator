
# What is the vision of this product?
- To help the user compose a desirable itinerary of locations along their route to achieve the most enjoyable experience. To allow users to curtail these selections and have them to share with others or to revisit themselves.

# What pain point does this project solve?
- Most current applications bombared users with too many suggestions. In addition many location presented to users are not aligned with the users interests. Many services providing route instructions do so with little consideration for the potential 

# Why should we care about your product?
- Much of the modern world mentality is focused on effecientcy in travel. Our team seeks to bring back the adventure of the road. We seek to provide our users with better curated option in addition to top notch navigation instructions.

# Scope

## IN
  - Generate driving directions between point A and desired destinations
  - Display the route on a map graphic
  - recommend certain stops along the way based upon users preferences
  - remove presented options if not desired
  - save route itinerary

## OUT
  - Will not allow users to submit their own locations
  - No traffic data will be presented to the user

# MVP
- Displays route information on a map
- Recommends location to visit at destination
- Select one of two interest catagories to affect 'recommended locations' list within a set distance of route

## Stretch
  - Select multiple interest catagories and receive composite results
  - Recalculate route based on selected locations from recommended list
  - Allow user to remove undesired locations
  - Allow user to save trip itinerary
  
# Functional Requirments
- user sets start location and destination
- user selects from dropdown one or more interests
- user is presented with directions and a map graphic with proposed route

# Data Flow
- User starts in the home page.  They will have two location inputs, a starting point and an ending address.  They will be able to select from a category of interests dropdown menu.  
- Once the inputs are selected, the app will communicate with the Google Maps API.
- The API will return a route that will be populated in the results page.  
- The results page will also include results within a given range of that route. (I.e. a 50 mile radius)
- The user can then select any number of those and recalculate the route.  
- The user is given the option to save the route data to the database for use at a later time.

## Non-functional Requirements;

### **Scalability**

  Scalability will be added to our application in the following ways.  Our app will be designed to populate locations that correspond with a selected category from the home page.  That category will come from a dropdown menu.  Which allows us to limit how many categories the user can select at a given time.  The Google Maps API is completely open ended and will allow a keyword to be used as a search query.  We are intentionally limiting the options in order to scale the app to the appropriate size.  

### **Testability**

  Our app will be designed to be tested at multiple levels to ensure operational status.  Starting with the user's ability to add a location, we are going to make sure the input fields only accept appropriate inputs. The Google Maps API will need to be tested to make sure it renders an appropriately sized viewport.  Data that is collected during one search query will be saved to the database and re-populated in a recent-searches page.  The information must stay intact during the data transfer between the server, database, and the client.  
