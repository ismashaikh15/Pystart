import { Lesson } from './types';

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    level: 1,
    title: 'The Magic Print',
    icon: 'MessageSquare',
    description: 'Learn how to make Python talk!',
    explanation: 'In Python, we use the `print()` command to show text on the screen. It is like telling a robot what to say!',
    example: 'print("Hello, World!")',
    challenge: {
      instruction: 'Make Python say your name! Type `print("Your Name")` in the editor.',
      starterCode: '# Type your code below\n',
      hint: 'Don\'t forget the quotes around your name and the brackets around everything!'
    }
  },
  {
    id: 'l2',
    level: 2,
    title: 'Secret Boxes (Variables)',
    icon: 'Box',
    description: 'Store information for later use.',
    explanation: 'Variables are like labeled boxes where you can store things. For example, `name = "Alex"` puts "Alex" inside a box called `name`.',
    example: 'name = "Pythonista"\nprint(name)',
    challenge: {
      instruction: 'Create a variable called `friend` and give it a name. Then print it!',
      starterCode: 'friend = ""\n',
      hint: 'Assign a name to the variable with `=` and then use print(friend).'
    }
  },
  {
    id: 'l3',
    level: 3,
    title: 'Decision Time (If Statements)',
    icon: 'Split',
    description: 'Help Python make choices.',
    explanation: 'Using `if`, we can tell Python to do something ONLY if a condition is true. It is like saying: "IF I am hungry, THEN I eat a snack!"',
    example: 'age = 10\nif age > 5:\n    print("You are big!")',
    challenge: {
      instruction: 'Write an if statement that checks if a number is greater than 10. If it is, print "Big number!"',
      starterCode: 'number = 15\nif number > 10:\n    ',
      hint: 'Make sure your print() is tucked in (indented) under the if line!'
    }
  },
  {
    id: 'l4',
    level: 4,
    title: 'Loop-de-Loop',
    icon: 'RotateCcw',
    description: 'Do things many times easily.',
    explanation: 'Loops help us repeat code without writing it over and over. A `for` loop counts through things one by one.',
    example: 'for i in range(3):\n    print("Hello!")',
    challenge: {
      instruction: 'Make Python print "I am a coder!" 5 times using a for loop.',
      starterCode: 'for i in range(5):\n    ',
      hint: 'Use the print command with the message "I am a coder!" inside the loop.'
    }
  },
  {
    id: 'l5',
    level: 5,
    title: 'Function Factory',
    icon: 'Sparkles',
    description: 'Learn to build your own commands.',
    explanation: 'Functions are like recipes. You define them once with `def`, and then you can "call" them whenever you need that recipe!',
    example: 'def say_hi():\n    print("Hi!")\n\nsay_hi()',
    challenge: {
      instruction: 'Create a function called `magic` that prints "Poof!". Then, don\'t forget to call it!',
      starterCode: 'def magic():\n    \n\nmagic()',
      hint: 'Define the function with def, print "Poof!", and make sure magic() is at the bottom without any spaces before it.'
    }
  }
];
