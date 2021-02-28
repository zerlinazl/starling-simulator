Simulates flocking behavior in starlings. Built off of Ben Eater's simulator: https://github.com/beneater/boids read for more info.

See FINAL_IMG.jpg for a screenshot from the simulator.

Differences from Ben Eater's original simulation:

- birds are now bird shaped.
- I added a size factor to each bird to simulate flying in a 3D environment.
- In file bird-shape.js, 4000 birds will fly into a bird shape.
- In file rectangle.js, the birds are free to fly anywhere within the screen.

To run: use index.html. Change the .js file it uses depending on which one you'd like to run.
Change parameters within the code files to try out different bird flock sizes. Can change number of birds, average size of birds, minimum distance apart, how far each bird can see etc.