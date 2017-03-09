var canvas = document.getElementById('c1')
var context = canvas.getContext('2d')
var speed = 1
var startRadius  = 100,startX = 100,startY = 100
var circles = []
var spiroPathX = [],spiroPathY = []
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
    constructor(x,y,r,speed) {
        this.x = x
        this.y = y
        this.deg = 0
        this.r = r
        this.speed = speed
        this.mDeg  = 0
    }
    setNeighbor(circle) {
        this.neighbor = circle
    }
    setMidPoint(x,y,mDeg) {
        this.mx = x
        this.my = y
        this.mDeg = mDeg
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
    }
    updateMidPointOfNeighbor() {
        var neighbor = this.neighbor
        if(neighbor!=undefined) {
            neighbor.setMidPoint(this.mx+(neighbor.r+this.r)*Math.cos((this.mDeg+this.deg-90)*Math.PI/180),this.my+(neighbor.r+this.r)*Math.sin((this.mDeg+this.deg-90)*Math.PI/180),this.mDeg+this.deg)
        }
    }
    rotate() {
       this.deg += this.speed
    }
}
var initCircles = ()=>{
    for(var i=0;i<4;i++) {
        circles.push(new Circle(startX,startY,startRadius,speed))
        startX = 0
        startY = -startRadius
        startRadius/=3
        startY -=startRadius
        speed+=1
    }
    circles[0].setMidPoint(canvas.width/2,canvas.height/2,0)
    for(var i=3;i>=1 ;i--) {
        circles[i-1].setNeighbor(circles[i])
    }
    updateSpiroPath()
}
var updateSpiroPath = ()=>{
    circles.forEach((circle)=>{
        circle.updateMidPointOfNeighbor()
    })
    if(circles.length>2) {
       var circle = circles[circles.length-2]
       var neighbor = circle.neighbor
       if(neighbor!=undefined) {
            var x = circle.mx+(circle.r+2*neighbor.r)*(Math.cos((circle.mDeg+neighbor.deg-90)*Math.PI/180))
            var y = circle.my+(circle.r+2*neighbor.r)*(Math.sin((circle.mDeg+neighbor.deg-90)*Math.PI/180))
            spiroPathX.push(x)
            spiroPathY.push(y)
       }
    }

}
setDimensions()
initCircles()

var render = ()=>{
    context.clearRect(0,0,canvas.width,canvas.height)

    if(circles.length>0) {
        circles[0].draw()
        pathX = circles[0]
    }

    circles.forEach((circle)=>{
         circle.rotate()
    })
    updateSpiroPath()
    context.beginPath()
    for(var i=0;i<spiroPathX.length;i++) {
        if(i == 0) {
            context.moveTo(spiroPathX[i],spiroPathY[i])
        }
        else {
            context.lineTo(spiroPathX[i],spiroPathY[i])
        }
    }
    context.stroke()
}
setInterval(render,100)
