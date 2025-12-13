# Advent of code 2025

This advent of code is only 12 days, this should ofcourse not make it easier, but instead might make it ramp up in speed much faster.

Anyway, this year im doing the boring and more picky VIM path, no auto correct, suggestion, linting, nothing.
But as a fun twist, i am after solver a question seeing how co-pilot can make my solution much easier.

## Overview
As this was the first Advent of Code solved, i wanted to mark down what parts i had issues with and help on.

 - Day 1: No help, about 2 hours
 - Day 2: No help, about 3 hours
 - Day 3: No help, on and off for about 9 days.
 - Day 4: No help, about 2 hours
 - Day 5: No help, about 1 hour, math really came in handy this AoC
 - Day 6: No help, about 3 hours, again Math!
 - Day 7: google help, about 4 hours
 - Day 8: No help, about 3 hours
 - Day 9: part 1 no help, part 2 however i asked co-pilot to explain and teach me about the way of checking efficiently, about 6 hours
 - Day 10: part 1 no help, part 2 some discussion with Co-pilot and learning about Gaussian elimination, about 5 hours
 - Day 11: part 1 no help, part 2 major back and forth on how todo this with co-pilot, learned about DAGS (Direct acyclic graph), about 4 hours
 - Day 12: part 1 half help half not, apparently you can cheap this solution fully, but i didn't. Co-pilot teaches new things.

In summary, this years AoC Was deffo shorter, but it still game me a run for my time (not money), and was a fun way this year to measure my growths as a developer.
I've figured out that even when you are stuck on something, trying new things should not be scary, but more a positive way of learning new things.

I've done AoC now for about 4 years, and everytime i am annoying as some puzzles and happy i solve stuff and angry that i can't read, but always in the end i am satsified on where i end.
This time around i managed to complete the whole calendar, i am happy and will now know more for next time.

I've also taken the time to write all of the code in VIM where i had no help with linting or otherstuff, i am just very picky so i manually do the linting part 
## Notes from the days.

### Day 1

Not the hardest, but quite annoying trying to figure out the best way to write in VIM, have the basics already but copy and paste code is not my strong side in the editor.

But as a plus, todays puzzle wasn't the hardest but got me quite going in the math department.

Part 1 thoughts:
 - Annoying to keep track of the 0-99 dial
 - Took a while to land the thinking of how it should loop back around.

Part 2 thoughts:
  - Who wants to know everytime you **click** zero?
  - My god the part 1 solution cannot handle the complexity of just checking if we pass through the number 0....
  - I've resorted to just using a simple for loop, cannot be bothered trying to through around flags todo stuff.

### Day 2

Getting into the habit of using VIM and running node on the side, fun start.


Part 1 thoughts:
  - Okay, simple palindrome effect but not backwards, just splitting the strings in half and checking if they are the same.
  - Got to refresh my reduce mind.

Part 2 thoughts:
  - I need to learn how to read instructions, i got most of it done by checking it with some splitting logic.
  - WHO GAVE THE GNOME THE PEN TO WRITE INSTRUCTIONS?
  - THe most annoying part currently is that VIM gives no marking for wrongfully written code.

### Day 3 

While i do like some sliding window logic, this one is just a bit sadistic.


Part 1 thoughts:
 - Wow, todays puzzle aint that hard, sliding window it seems like, no biggie
 - Logic not to shabby

Part 2 thoughts:
 - So how big can batteries get!? 12!?!
 - Sliding window? More like satans butthole of windows, not sure how todo the logic nicely, maybe i can parse it better.
 - For some reason i read it as 8 batteries, so what i didn was that i did a bfs, this.... was not smart, too much data never was gonna complete.
 - Instead of doing a weird search, i thought i could do a dp for a bit.
 - But instead i did a smart solutation that goes instantly.
 - I take the most right twelve batteries, then go from the most left battery to if i can find a bigger number to the right.
 - If i can, i move the left pointer to that new battery, and then check again.

### Day 4

As a person who cannot legally drive a fork lift, i will try my best todo this without too much of an effort.
It looks like we can just do a simple check around each point in the matrix.

Part 1 Thoughts:
 - As the puzzle says we can remove a paperroll if it does not have more than 3 adjecent rolls around it, i just did a quick function to check this.

Part 2 thoughts:
 - Now it wants us to repeat the process until we cannot more any more, simple.
 - I added a look back to check if states are the same, if they are we break.


### Day 5

Fresh ingredients! how nice to let us check for this.

Part 1 thoughts:
 - I've going todo a simple math check, that is for a number, check each of our ranges, if they are under or over the boundry, then it is note fresh.
 - Then ill just add them together.

Part 2 thoughts:
 - Wow talk about needing many valid fresh ingredients....
 - Instead of having a for loop todo this (won't be possible the numbers are massive) im going to make a 'merge' function that merges ranges together if they overlapp.
 - That seems to work, but i missed the part about Math.max it when joining ranges.

### Day 6

Math homework and an odd looking on that is, lines are weirdly out of possition.

Instead of taking it normally and reading it normally we read the from up to down and then make the operations.

Part 1 thoughts:
 - Didn't check the part about having todo it vertical...
 - Made that logic, now im using eval (idk cheating?) and join(operation) to calculate the massive numbers quick and easy.

Part 2 thoughts:
 - Now i have to read it **right to left**, that is ONE line at a time.
 - Headache as apparently the SPACES had a meaning.... well had to rewrite my parse function to get the content
 - Using the same logic, eval saves the game.

### Day 7

A christmas tree that light will fall down from the top, quite nice graphicly got to say.

Part 1 thoughts:
 - It looks simple enough todo a breadth first search
 - Ahh cannot forget the simple has visited map.

Part 2 thoughts:
 - I thought i could just add up another variable with a split twice every split, but noooo
 - I've implemented a depth first search instead, not used to it so i don't know how to check the same "checked" spots logic.
 - I might try and check differently according to a pascal triangle, it looks like that might be the best, or atleast the pattern that is.

### Day 8

Circuits, while i don't normally enjoy huge "joins" im giving it my all.

Part 1 thoughts:
 - Honestly, me reading and fully understanding an issue might be the hardest part.
 - I've managed todo the test good, and while that works...the real data does not.
 - Ahh, so after a bit of help, to fully understand the question, it does imply that you can join circuits that interconnect.

Part 2 thoughts:
 - So it wants us to continue until we have a big loop, that's easy
 - WELL, it was easy doing this, BUT yet again, reading is hard.
 - It says "Continue connecting the closest unconnected pairs of junction boxes together until they're all in the same circuit"
 - While it does say continue till everything is connected, it also says **they are all**, which yet again, is me missing info.
 - Had to add a check that makes sure all points have been used up.

### Day 9

Okay, looks like a nice easy puzzle placement almost, just look for the biggest squares!

Part 1 thoughts:
 - Managed to create a very simple base * height algorithm that works.
 - First try baby!!!

Part 2 thoughts:
 - Ahhh crap, this is a lot harder now.
 - Unsure how todo this not gonna lie.....
 - Im thinking i can find the outer bondry, and somehow go from there? Ahhhhhh
 - While i do think i could probably have done this in maybe a few days, what i did was that i took a little help to get more used to calculating these kinds of issue.
 - It's solved... but at what cost.
### Day 10

Light switches with instructions and power joltage, talk about a light studio (dunst dunst dunst)

Part 1 thoughts:
 - As i have to solve it, in the least steps, it feels like i should do a depth search, or maybe a breadth first?
 - doing a bfs search had its issues, but with some figling with the already checked points, it've completed it.
 - Took 20 seconds to run, oh damn.

Part 2 thoughts:
 - Oke, so now they want to include the jolts, each button increases jolt counter...
 - I guess i can throw away the lightswitches, as the jolt is the truth now.
 - I cannot complete this with my current knowledge, i have a feeling math is needed.

I've succumed to co-pilot for part 2, not fully but partly to help do the linear solution!

### Day 11

Oh no, i've got a feeling that an elephant stuck in a volcano issue is coming up...

Part 1 Thoughts:
 - Oke simple, breadth first search with a check that we cannot go back to already explored paths.
 - Nice quick and easy 1-1 look up if we've been somewhere and the new paths.

Part 2 thoughts:
 - This looks like just a modified part 1... trying it but i am quite sure ill bite my own tail on this one.
 - I was right... Ahhh, after some googling, when you have a path that has no loops and need to check possible paths, you can use something called DAG (direct acyclic graph).
 - Oke, it looks like it's 'like' a dfs, that is you go down once to the goal, but you count the ways to possibly get there, like a plus path but also keeping track if we've seen the two keys.
 - Anyway this was a hard day but possible if i knew directly about the DAG way of handing problems like this.

### Day 12

Well well, last day. Im not excited to see the mystery i have to solve...
And i was right, fitting shapes inside a grid, now this sounds like something i am not familiar with...

Part 1 thoughts:
 - I have no idea how todo this efficiently, i've created the logic for everything before checking, but im at my limit atm.
 - I found this article https://arxiv.org/pdf/cs/0011047, maybe the logic here can help haha
 - I succummed yet again but learned a few things about how to solve the puzzle today, it was fun.
