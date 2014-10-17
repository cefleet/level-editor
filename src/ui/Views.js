UI.Views = {
	navbar : function(){
		var navbar = $nE('nav', {"class":"navbar navbar-default navbar-fixed-top", "role":"navigation","id":"navigation"},
			$nE('div', {"class":"container-fluid"},
				$nE('div', {"class":"collapse navbar-collapse"},
					$nE('ul',{"class":"nav navbar-nav"},
						[
							$nE('li',{"class":"dropdown"},
								[
									$nE('a',{"class":"dropdown-toggle", "data-toggle":"dropdown"}, 
										[
											$cTN('File'),
											$nE('span',{"class":"caret"})
										]
									),
									$nE('ul',{"class":"dropdown-menu","role":"menu"}, 
										[
											$nE('li',{},
												$nE('a',{"id":"newMapNavLink"}, $cTN('New Map'))
											),
											$nE('li',{},
												$nE('a',{"id":"loadMapNavLink"}, $cTN('Load Map'))
											),
											$nE('li',{"class":"divider"}),
											$nE('li',{},
												$nE('a',{"id":"saveMapNavLink"}, $cTN('Save Map'))
											),
											$nE('li',{"class":"divider"}),
											$nE('li',{},
												$nE('a',{"id":"settingsNavLink"}, $cTN('Settings'))
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
		return navbar;
	}
}
