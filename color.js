function getStyle(className) {
    var classes = document.styleSheets[4].cssRules;
    for (var x = 0; x < classes.length; x++) {
        if (classes[x].selectorText == className) {
            if(classes[x].cssText){
                return classes[x];
            }else{
                return classes[x].style;
            }
        }
    }
}

for (var i=0; i < document.styleSheets.length; i++){
  var styleSheet = document.styleSheets[i];
  console.log(styleSheet)
}

function setLiveColor(){
    console.log(getStyle('.cell').style)
}
