var trail = {
  dots: null,
  mousex:0,
  mousey:0,
  length:10,
  Dot: function()
  {
    var oDot = document.createElement("div");
    $(oDot).addClass("dot");
    $(document.body).append(oDot);
    return oDot;
  },

  createDots: function()
  {
    trail.dots = [];
    for(i=0;i<2;i++)
    {
      var dot = new trail.Dot();          
      $(dot).css({opacity:(trail.length-i)/trail.length});
      trail.dots[i]= dot;
    }
  },
  
  follow: function(tx, ty, dot)
  {
    var dotx = parseInt($(dot).css("left"));
    var doty = parseInt($(dot).css("top"));
    var newx = ((tx+dotx*2)/3);
    var newy = ((ty+doty*2)/3);
    
    $(dot).css({top:newy, left:newx});    
  },
  
  move: function()
  {
    trail.follow(trail.mousex, trail.mousey, trail.dots[0]);
    
    for(i=1;i<trail.length;i++)
    {
      dot = trail.dots[i-1];
      var tx = parseInt($(dot).css("left"));
      var ty = parseInt($(dot).css("top"));
      trail.follow(tx,ty, trail.dots[i]);
    }
  },
  mousemove: function(mx,my)
  {
    trail.mousex = mx;
    trail.mousey = my;
  },
  
  initialize: function()
  {
    trail.createDots();
    setInterval(function(){ trail.move(); }, 40);
  }
};
    
trail.initialize();

$(document).mousemove(function(e){
  trail.mousemove(e.pageX, e.pageY);
});