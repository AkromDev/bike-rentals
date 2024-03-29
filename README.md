# Test account
1. Go to https://akromdev-bike-rentals.vercel.app/auth
2. Click login 
3. Login using `admin@bikes.com` and `admin123`

# Bike rentals
## Requirements

Write an application to manage bike rentals:
 
 * The application must be React-based.
 * Include at least 2 user roles: Manager and User.
 * Users must be able to create an account and log in.
 * Each bike will have the following information in the profile: Model, Color, Location, Rating, and a checkbox indicating if the bike is available for rental or not.

Managers can:
 * Create, Read, Edit, and Delete Bikes.
 * Create, Read, Edit, and Delete Users and Managers.
 * See all the users who reserved a bike, and the period of time they did it.
 * See all the bikes reserved by a user and the period of time they did it.

Users can:
 * See a list of all available bikes for some specific dates.
 * Filter by model, color, location, or rate averages.
 * Reserve a bike for a specific period of time.
 * Rate the bikes with a score of 1 to 5.
 * Cancel a reservation.

## How to run locally
To run locally, you will need to create a firebase project and provide credentials in `.env.local` file. You can refer to `.env.local.example` file. 
    
