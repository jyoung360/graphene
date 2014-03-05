function toggleHighlight(classVal, toggleVal) {
	function replaceAll(find, replace, str) {
	  return str.replace(new RegExp(find, 'g'), replace);
	}
	
    if (classVal.indexOf(toggleVal) != -1) {
        return replaceAll("highlight", "", classVal)
    }
    else {
        return classVal + " " + toggleVal;
    }
}

function postRenderTimeSeriesView(vis) {
  var svg = vis;
  svg.selectAll('path[id*="a-"]').forEach( function(paths) { 
    paths.forEach(function(area){ 
      area.addEventListener('mouseenter', function (event) {
        var lineId = this.id.replace('a-','l-');
        var lines = svg.selectAll('path#'+lineId);
        var label = this.getAttribute('data-label');
        var overlay = document.getElementById('graphene_label_overlay');
        var x = event.clientX+10;
        var y = event.clientY-20;

        if(overlay) {
          overlay.innerHTML = label;
          overlay.style.top = y+'px';
          overlay.style.left = x+'px';
          overlay.style.display = '';
        }
        else {
          var body = document.getElementsByTagName('body').item(0);
          if(body) {
            body.insertAdjacentHTML('beforeend', '<div id="graphene_label_overlay" class="tsview-label" style="top:'+y+'px; left:'+x+'px">'+label+'</div>');
          }
        }
        lines.forEach(function(line) {
          line[0].setAttribute('class', toggleHighlight(line[0].getAttribute('class'), "line-highlight"))
        });
        this.setAttribute('class', toggleHighlight(this.getAttribute('class'), "area-highlight"));                      
      });
      area.addEventListener('mouseleave', function (path) {
        var overlay = document.getElementById('graphene_label_overlay');
        if(overlay) {
          overlay.style.display = 'none';
        }
        var lineId = this.id.replace('a-','l-');
        var lines = svg.selectAll('path#'+lineId);
        lines.forEach(function(line) {
          line[0].setAttribute('class', toggleHighlight(line[0].getAttribute('class'), "line-highlight"))
        });
        this.setAttribute('class', toggleHighlight(this.getAttribute('class'), "area-highlight"));                       
      });
    });
  });

  svg.selectAll('a.l').forEach( function(g) { 
      g.forEach(function(a){ 
          var aid = a.getAttribute('id')
          a.addEventListener('mouseenter', function() {
              svg.selectAll('path#l-' + aid).forEach ( function (g) {
                  g.forEach(function (path) {
                      path.setAttribute('class', toggleHighlight(path.getAttribute('class'), "line-highlight"));                      
                  })
              })
              svg.selectAll('path#a-' + aid).forEach ( function (g) {
                  g.forEach(function (path) {
                      path.setAttribute('class', toggleHighlight(path.getAttribute('class'), "area-highlight"));                      
                  })
              })
          })
          a.addEventListener('mouseleave', function() {
              svg.selectAll('path#l-' + aid).forEach ( function (g) {
                  g.forEach(function (path) {
                      path.setAttribute('class', toggleHighlight(path.getAttribute('class'), "line-highlight"));                      
                  })
              })
              svg.selectAll('path#a-' + aid).forEach ( function (g) {
                  g.forEach(function (path) {
                      path.setAttribute('class', toggleHighlight(path.getAttribute('class'), "area-highlight"));                      
                  })
              })
          })
      }) 
  })
}