   ////////////////////////
  // custom map spider //
 ///////////////////////
  function isOdd(num) { return num % 2;}

  map.addListener('bounds_changed', function() {
    var latMedian = [];
    var lngMedian = [];
    var totalMedian = [];
    for (var i=0; i<currentMarkers.length; i++){
      if( map.getBounds().contains(currentMarkers[i].getPosition())){
        if (typeof currentMarkers[i].offsetLatValue === "undefined"){
          currentMarkers[i].offsetLatValue = 0;
          currentMarkers[i].offsetLngValue = 0;
        }
        currentMarkers[i].positionValue = 0;
        latMedian.push(currentMarkers[i]);
        lngMedian.push(currentMarkers[i]);
        totalMedian.push(currentMarkers[i]);
      }
    }
     
    //12 is the cutoff for minimum number of markers in the current viewport needed to render the spider 
    if(map.getZoom() === 20 && totalMedian.length > 12){
      latMedian.sort(function(a, b) {
        var aLat = a.getPosition().lat();
        var bLat = b.getPosition().lat();
        return ((aLat < bLat) ? -1 : ((aLat > bLat) ? 1 : 0));
      });
  
      lngMedian.sort(function(a, b) {
        var aLng = a.getPosition().lng();
        var bLng = b.getPosition().lng();
        return ((aLng < bLng) ? -1 : ((aLng > bLng) ? 1 : 0));
      });
  
      $.each(latMedian, function(a, b){
        b.positionValue += a;
      });
  
      $.each(lngMedian, function(a, b){
        b.positionValue += a;
      });
  
      totalMedian.sort(function(a, b) {
        var aPositionValue = a.positionValue;
        var bPositionValue = b.positionValue;
        return ((aPositionValue < bPositionValue) ? -1 : ((aPositionValue > bPositionValue) ? 1 : 0));
      });
  
      var middle = Math.floor((totalMedian.length - 1) / 2);
      var upperCurrentMarkers = totalMedian.slice(middle, -1);
      var lowerCurrentMarkers = totalMedian.slice(0, middle - 1);
  
      $.each(upperCurrentMarkers, function(a, b){
        if(!b.pinMoved){
          if(isOdd(a) === 1){
            b.offsetLatValue = (a/64000);
            b.offsetLngValue = (-a/64000);
            b.pinMoved = true;
          }else{
            b.offsetLatValue = (a/64000);
            b.offsetLngValue = (a/64000);
            b.pinMoved = true;
          }
          var newLatLng = new google.maps.LatLng(
            b.getPosition().lat() + b.offsetLatValue,
            b.getPosition().lng() + b.offsetLngValue);
          b.setPosition(newLatLng);
        }
      });
  
      $.each(lowerCurrentMarkers, function(a, b){
        if(!b.pinMoved){
          if(isOdd(a) === 1){
            b.offsetLatValue = (-a/64000);
            b.offsetLngValue = (a/64000);
            b.pinMoved = true;
          }else{
            b.offsetLatValue = (-a/64000);
            b.offsetLngValue = (-a/64000);
            b.pinMoved = true;
          }
          var newLatLng = new google.maps.LatLng(
            b.getPosition().lat() + b.offsetLatValue,
            b.getPosition().lng() + b.offsetLngValue);
          b.setPosition(newLatLng);
        }
      });
    }else if (map.getZoom() !== 20) {
      $.each(currentMarkers, function(a, b){
          var newLatLng = new google.maps.LatLng(
            b.getPosition().lat() - b.offsetLatValue,
            b.getPosition().lng() - b.offsetLngValue);
            b.setPosition(newLatLng);
            b.offsetLngValue = 0;
            b.offsetLatValue = 0;
            b.pinMoved = false;
      })
    }
  });
