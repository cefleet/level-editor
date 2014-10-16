var UI = {
  create : function(){
    var elem = $nE('nav', {"class":"navbar navbar-default navbar-fixed-top", "role":"navigation","id":"navigation"},
      $nE('div', {"class":"container-fluid"},
        $nE('div', {"class":"collapse navbar-collapse"},
          $nE('ul',{"class":"nav navbar-nav"},
            [
              $nE('li',{"class":"dropdown"},
                [
                  $nE('a',{"class":"dropdown-toggle", "data-toggle":"dropdown"}, [
                    $cTN('File'),
                    $nE('span',{"class":"caret"})
                  ]),
                  $nE('ul',{"class":"dropdown-menu","role":"menu"}, 
                    [
                      $nE('li',{},
                       $nE('a',{"id":"newMapLink"}, $cTN('New Map'))
                      ),
                      $nE('li',{},
                       $nE('a',{"id":"loadMapLink"}, $cTN('Load Map'))
                      ),
                      $nE('li',{"class":"divider"}),
                      $nE('li',{},
                       $nE('a',{"id":"saveMapLink"}, $cTN('Save Map'))
                      ),
                      $nE('li',{"class":"divider"}),
                      $nE('li',{},
                        $nE('a',{"id":"settingsLink"}, $cTN('Settings'))
                      )
                    ] 
                  )
                ]
              ),
              $nE('form',{"class":"navbar-form navbar-left"},
                $nE('div', {"class":"form-group"},
                  $nE('input', {"type":"text","class":"form-control", "placeholder":"Map Name", "id":"mapNameNavForm"})
                )
              )
            ]
          )
        )
      ) 
    );
   
   $aC(document.body,[elem]);
  },
  
  setupEvents : function(){

    this.events = MasterEmitter;
  
    //This stays here
    var links = $gBT('a', $g('navigation'));
    for(var i = 0; i < links.length; i++){
      links[i].addEventListener('click', function(){
        UI.events.emitEvent('navLinkClicked', [this.id]);
      }.bind(links[i]));   
    }
  }
}
