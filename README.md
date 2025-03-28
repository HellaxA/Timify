# Things I learned 
1. SQLiteProvider has to be at the top layout level to provide access to all the Screens.
 Otherwise during navigation.back() between pages with individual SQLiteProvider the DB would be closed. 
2. useFocusEffect() executes when you navigate to the screen, or come back to the screen. It DOESN'T run on re-render. Use with useCallback() because, if the anon function you pass to the useFocusEffect() is created on every re-render, it triggers useFocusEffect again, causing an infinite loop.
3. useCallback() is used in conjunction with useFocusEffect(). If we just pass our anon function to useFocusEffect(), on each re-render the function 
reference will change. If we useCallback() the function is memoizated. It DOESN'T affect the function execution, only memoization. 
4. If we use useState.setItems() without useFocusEffect(), it triggers the re-render, executes Main, executes setItems -> setItems calls re-render -> infinite loop.
5. useEffect() runs on every re-render after the component is mounted. If you pass [] as a 2nd arg, it runs only on 1 render.
6. By using Stack.Screen in the components I can dynamically change the headers by adding functionality like handleDelete() in editItem.tsx.
    - However, headerRight accepts onPressIn, not onPress. 
7. useFocusEffect() is executed after useEffect() during React Navigation Lifecycle.