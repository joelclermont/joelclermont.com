---
title: "Day one with Go"
date: "2013-03-27"
slug: "2013/03/27/day-one-with-go"
tags: [programming, Go]
---
I have the habit of picking up a new programming language or two each year, not necessarily to master them or even to write production code with them, but just to be exposed to new approaches to familiar problems. For the last few months, [two](https://twitter.com/donatj) [friends](https://twitter.com/henderjon) of mine have been urging me to try out [Go](http://golang.org), a relatively new language from Google. Since I had a 17-day vacation planned in Florida, I decided to give Go a try while I had abundant free time.

<!--more-->
Here is the five-second marketing pitch from Google regarding Go:
> Go is an open source programming environment that makes it easy to build simple, reliable, and efficient software.

Beyond that, one thing that kept coming up when I heard people talk about Go was how it handled concurrency. My focus lately has been on writing scalable web services, so concurrency is something that gets my attention.

To get started, I worked through the interactive tutorial at [tour.golang.org](http://tour.golang.org). If you're even a little curious about Go, I highly recommend it. It works entirely in the browser, so there's nothing to install, and it has a nice mix of examples and fun, simple, but useful exercises to try on your own.

It stays at a fairly high level, just giving you an overview of the language, but where it makes sense, it links to more detailed docs on the subject being discussed. One small criticism: It would be nice if they had some sample solutions to the exercises. The exercises include tests, so you know you solved the problem, but as someone new to the language, I'd like to see an idiomatic Go solution.

A lot about Go is familiar, so I won't bore you with the details. Instead, let me point out some things I found unique or interesting.

## Compile-time checks

Since Go is a compiled language, you'd expect there to be some compile-time safety checks. Go does something I found a bit jarring at first: if you import a module or declare a variable, but don't use them, it fails to compile. You might think this is a bit overbearing (I know I did), but the more I played with Go, the more I liked this approach. Not only does it prevent naming errors, but it keeps the "cruft level" lower by forcing you to remove things you aren't using.

## Multiple return values

C# has "out" params and in other languages, like PHP, it's common to wrap multiple return values in an array. I really like how Go handles this though. Right in the function declaration, after the input parameters, you can specify the types of one (or more) return values

``` go
func swap(x, y string) (string, string) {
    return y, x
}
```

Even better, you can name these return values, providing an alternate syntax. Note how I just assign to the return vars and then use an empty `return` statement.

``` go
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return
}
```

## One true loop: `for`

This one seemed a little odd to me at first, too, but like the compile-time checks, it grew on me. There are no `foreach`, `do` or `while` loops. There is only `for`. But you can easily emulate a `while` loop by omitting the pre and post condition checks.

``` go
func main() {
    sum := 1
    for sum < 1000 {
        sum += sum
    }
    fmt.Println(sum)
}
```

Using the `range` form also gives you something like a foreach.

``` go
var pow = []int{1, 2, 4, 8, 16, 32, 64, 128}

func main() {
    for i, v := range pow {
        fmt.Printf("2**%d = %d\n", i, v)
    }
}
```

In the above example, `i` becomes the 0-based index of your loop and `v` is the current value. If you only need the index or the value, you can omit whichever one you don't need.

``` go
pow := make([]int, 10)
// you could also write this as i, _ but it's unnecessary
for i := range pow {
    pow[i] = 1 << uint(i)
}
for _, v := range pow {
    fmt.Printf("%d\n", v)
}
```

## Arrays and slices

Most programming languages have arrays, so nothing new to talk about there, but Go has something called slices. These are an abstraction on top of an underlying array data structure. Unlike arrays, slices don't have a fixed size. Also, a slice is basically just a definition of a particular array segment, so it's easier to pass around then an array. I'm not going to pretend to understand all the internals yet, so if you want a deeper dive, check out this [post on the Go blog](http://blog.golang.org/2011/01/go-slices-usage-and-internals.html).

This is one area I need to understand better and use more before I can form a more solid opinion on whether or not I like it.

## Maps have a built in key checker

When pulling values out of a map, you can also return a second boolean value indicating whether or not that key existed. This often results in more terse code than you would have in other languages where you need to test for the key first before trying to fetch the value.

``` go
m := make(map[string]int)

m["x"] = 10
m["y"] = 20

v, ok := m["x"]
// v = 10 (the value from the hash), ok = true

v, ok := m["z"]
//v = 0 (the default value for an int), ok = false
```
## Interfaces

Interfaces can be used *without* needing to declare that your ~~class~~ type implements an interface. Go is smart enough to see that your ~~class~~ type conforms to the interface and figures that out for you. Let this sink in for a bit and you'll see how genius it is. If my brief description wasn't enough for you, read this [post on the Go blog](http://golangtutorials.blogspot.com/2011/06/interfaces-in-go.html) for more details.

Edit: As @elimisteve points out in the comments, Go doesn't have classes. Changing `class` to `type` to be more accurate. Thanks!

## Concurrency

I know I teased this at the start, but I saved the best for last. Plus, the Go tour saved it to last as well, so my notes were made in that order.

With Go, you can easily spawn a new lightweight thread by adding `go` to the front of your function call. This new thread is in the same address space as your main application so you need some way to manage this shared memory. Go does this with the concept of channels.

A channel can both send and receive data. So perhaps your additional threads are doing some work and sending their results into the channel. Your main method could be reading from the channel and reporting progress back to the user. Here's a simple example to see what the syntax looks like.

``` go
func sum(a []int, c chan int) {
    sum := 0
    for _, v := range a {
        sum += v
    }
    c <- sum // send sum to c
}

func main() {
    a := []int{7, 2, 8, -9, 4, 0}

    // you have to make a channel before you can use it
    c := make(chan int)

    // two new threads created
    go sum(a[:len(a)/2], c)
    go sum(a[len(a)/2:], c)

    x, y := <-c, <-c // receive from c

    fmt.Println(x, y, x+y)
}
```

One important detail: a channel will block while waiting for the other side to send or receive. To get around this, you can define a buffered channel, with a maximum capacity. A buffered channel will get around the block issue as long as you don't let your buffer fill or drain completely.

Another cool technique with channels is using the `range` and `close` language features. In this example, the thread will keep sending until it's done, and then issue a `close` command on the channel. Back in the main method, it will keep receiving until it receives the `close`. This is a really nice, lightweight way to manage communications.

``` go
func fibonacci(n int, c chan int) {
    x, y := 0, 1
    for i := 0; i < n; i++ {
        c <- x
        x, y = y, x+y
    }
    // alerts the receiver that no more data is coming
    close(c)
}

func main() {
    c := make(chan int, 10)
    go fibonacci(cap(c), c)

    // this will keep receiving until it receives a close command
    for i := range c {
        fmt.Println(i)
    }
}
```

I have only briefly described channels and concurrency, but hopefully this is enough to make you curious to learn more. No surprise, but I'm going to again link you to the [Go blog](http://golangtutorials.blogspot.com/2011/06/channels-in-go.html) for more information.

What do you think? Is Go interesting to you? Have you tried it yourself? Share your experiences and opinions in the comments. Also, I will be diving even deeper into Go over the next few weeks and posting more information here. If you're interested, [subscribe to my RSS feed]({{ site.subscribe_rss }}).
