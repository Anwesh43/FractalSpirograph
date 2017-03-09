var canvas = document.getElementById('c1')
var context = canvas.getContext('2d')
var speed = 10
var startRadius  = 100,startX = 100,startY = 100
var circles = []
var setDimensions = ()=>{
    canvas.width = window.innerWidth/2
    canvas.height = window.innerHeight
    startX = canvas.width/2
    startY = canvas.height/2
    startRadius = Math.min(canvas.width,canvas.height)/4
    context = canvas.getContext('2d')
}
window.onresize = ()=>{
    setDimensions()
}
class Circle {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.deg = 0
        this.r = r
    }
    setNeighbor(circle) {
        this.neighbor = circle
    }
    draw() {
        context.strokeStyle = 'green'
        context.save()
        context.translate(this.x,this.y)
        context.rotate(this.deg*Math.PI/180)
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        if(this.neighbor!=undefined) {
            this.neighbor.draw()
        }
        context.restore()
        console.log("drawing the circle")
    }
    rotate() {
       this.deg += speed
    }
}
var initCircles = ()=>{
    for(var i=0;i<4;i++) {
        circles.push(new Circle(startX,startY,startRadius))
        startX = 0
        startY = -startRadius
        startRadius/=3
        startY -=startRadius
    }
    for(var i=3;i>=1 ;i--) {
        circles[i-1].setNeighbor(circles[i])
    }
}
setDimensions()
initCircles()

var render = ()=>{
    context.clearRect(0,0,canvas.width,canvas.height)
    if(circles.length>0) {
        circles[0].draw()
    }
    circles.forEach((circle)=>{
        circle.rotate()
    })
}
setInterval(render,100)
