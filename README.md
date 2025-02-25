# Things I learned 
1. <SQLiteProvider> has to be at the top layout level to provide access to all the Screens.
 Otherwise during navigation.back() between pages with individual SQLiteProvider the DB would be closed. 
2. useFocusEffect() executes when you navigate to the screen, or come back to the screen. It DOESN'T run on re-render.
3. useCallback() is used in conjunction with useFocusEffect(). If we just pass our anon function to useFocusEffect(), on each re-render the function 
reference will change. If we useCallback() the function is memoizated. It DOESN'T affect the function execution, only memoization.
4. If we use useState.setItems() without useEffect() or useFocusEffect(), it triggers the re-render, executes Main, executes setItems -> setItems calls re-render -> infinite loop.