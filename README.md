# Things I learned 
1. <SQLiteProvider> has to be at the top layout level to provide access to all the Screens.
 Otherwise during navigation.back() between pages with individual SQLiteProvider the DB would be closed. 