# Syntax

Variables with type var, let, or const shall be in camel case
```
val exampleVariable = 5;
```

Parameters shall be in camel case

Variables with user defined type shall be in pascal case
```
MyClass ExampleClass;
function MyFunction(myParameter)
```


## {} Placement

Good
```
if(condition)
{
  code
}
```

Bad
```
if(condition) {
  code
}
```


## If-Else Statements

For single line if-else statements, don't use {}, unless you plan to add more lines
```
if(condition)
  code
```


In functions, return on error, don't use else

Good
```
function Sin(deg)
{
  if(deg < 0)
  {
    return 0;
  }
  
  calculate sin
}
```

Bad
```
function Sin(deg)
{
  if(deg < 0)
  {
    return 0;
  }
  else
  {
    calculate sin
  }
}

Bad
```
function Sin(deg)
{
  if(deg >= 0)
  {
    calculate sin
  }
  else
  {
    return 0;
  }
}


## Looping

Use while loops for
* Repeating a segmented of code
* Iterating through an array of values (Arrays, strings, etc.) BUT going through each element is not as important

Use for loops for
* Iterating through an array of values, going to each element
